// ==UserScript==
// @name         BGA Terra mystica layout manager
// @description  Help manage layouts for TM games on BGA
// @namespace    https://github.com/Rincevent/TerraMysticaTurnCalculator
// @author       https://github.com/Rincevent
// @version      1.0.0
// @include      *boardgamearena.com/*
// @grant        none
// ==/UserScript==

// System variables - don't edit
const Is_Inside_Game = /\?table=[0-9]*/.test(window.location.href);


// Main TM Layour maanger object
var TMLayoutManager = {
    dojo: null,
    game: null,

    // Init TM Layour maanger
    init: function() {
        // Check if the site was loaded correctly
        if (!window.parent || !window.parent.dojo || !window.parent.gameui) {
            return;
        }
        this.dojo = window.parent.dojo;
        this.game = window.parent.gameui;

        if (this.game.customLayout) {
            // prepare extra menu buttons
            this.dojo.place( '<br /><div style="display:block">\
                <h3>Layout management</h3>\
                <p><span>Save layout: </span><button type="button" id="save_layout_button" style="width:20%">Save</button></p>\
                <p><span>Load layout: </span><input type="file" id="load_layout_file_selector" accept=".json"></p>\
                <p><span>Change background: </span><input type="file" id="bg_file_selector" accept=".jpg, .jpeg, .png"></p>\
            </div>', $('controls') );
            this.dojo.connect( $('save_layout_button'), "onclick", this, "downloadBoardInfo");
            this.dojo.query( '#load_layout_file_selector' ).connect( 'onchange', this, 'onChangeLoadLayoutFileSelector' );
            this.dojo.query( '#bg_file_selector' ).connect( 'onchange', this, 'onChangeBGFileSelector' );

            // reparent and make player info board movable
            var parent = document.getElementById("tm_game_area");
            for( var player_id in this.game.gamedatas.players )
            {
                this.makeMovable(parent, 'overall_player_board_' + player_id);
            }

            this.makeMovable(parent, 'logs');
            this.makeResizable('logs');

            // load board layout position from local storage
            {
                const json = window.localStorage.getItem("BGA_TerraMystica_BoardPositions");
                try {
                    const obj = JSON.parse(json);
                    for (let i in this.game.players_in_order) {
                        if (obj.hasOwnProperty('player_info_board_'+i)) {
                            this.game.loadBoardRectToLocalStorage('overall_player_board_'+this.game.players_in_order[i], obj['player_info_board_'+i]);
                        }
                    }

                    if (obj.hasOwnProperty('logs')) {
                        this.game.loadBoardRectToLocalStorage('logs', obj['logs']);
                    }
                }
                catch (error) {
                    console.log( "Error loading info player board position: " + error );
                }
            }

            // style title bar
            this.resizeTitle();

            // hide stuff we do not want to see
            this.dojo.style( 'generalactions', 'display', 'none' );
            this.dojo.style( 'not_playing_help', 'visibility', 'hidden' );
            this.dojo.style( 'not_playing_help', 'position', 'absolute' );
            this.dojo.style( 'right-side', 'display', 'none' );
        }

        return this;
    },

    makeMovable: function(parent, board_id) {
        var board = document.getElementById(board_id);
        board.style.position = "absolute";
        parent.appendChild(board);

        var drager = document.createElement("div");
        drager.className = "dragable";
        board.appendChild(drager);
        drager.addEventListener("mousedown", this.game.initMoveDrag.bind(this.game), false);
        drager.parentDiv = board;
    },

    makeResizable:function(board_id) {   
        var board = document.getElementById(board_id); 
        var resizer = document.createElement("div");
        resizer.className = "resizer-both";
        board.appendChild(resizer);
        resizer.addEventListener("mousedown", this.initResizeDrag.bind(this), false);
        resizer.parentDiv = board;
    },

    
    initResizeDrag: function(e) {
        element = e.target.parentDiv;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
        this.resizing = element;
        document.documentElement.addEventListener("mousemove", this, false);
        document.documentElement.addEventListener("mouseup", this, false);
    },

    handleEvent: function(e) {
        switch(e.type) {
            case 'mousemove':
            if (this.resizing !== undefined) {
                var diffX = e.clientX - startX;
                var diffY = e.clientY - startY;
                var newWidth = Math.floor(startWidth + diffX);
                if (newWidth < 50) {
                    newWidth = 50;
                }
                var newHeight = Math.floor(startHeight + diffY);
                if (newHeight < 50) {
                    newHeight = 50;
                }
                this.resizing.style.width = newWidth + "px";
                this.resizing.style.height = newHeight + "px";
            }
            break;
            case 'mouseup':
                document.documentElement.removeEventListener("mousemove", this, false);
                document.documentElement.removeEventListener("mouseup", this, false);
                if (this.resizing !== undefined) {
                    this.saveBoardsToLocalStorage();
                }
                this.resizing = undefined;
            break;
        }
    },

    getBoardInfoJson: function() {
        var to_save = this.game.getBoardInfoJson();

        for (let i in this.game.players_in_order) {
            to_save['player_info_board_'+i] = this.game.retrieveBoardRect('overall_player_board_'+this.game.players_in_order[i], false);
        }

        to_save['logs'] = this.game.retrieveBoardRect('logs', true)

        return to_save;
    },

    saveBoardsToLocalStorage: function() {
        var to_save = this.getBoardInfoJson();
        var json = JSON.stringify(to_save);
        window.localStorage.setItem("BGA_TerraMystica_BoardPositions", json);
    },

    downloadBoardInfo: function() {
        var to_save = this.getBoardInfoJson();
        var json = JSON.stringify(to_save, null, 1);
        window.localStorage.setItem("BGA_TerraMystica_BoardPositions", json);

        var a = document.createElement("a");
        var file = new Blob([json], {type: 'text/json'});
        a.href = URL.createObjectURL(file);
        a.download = "BGA_TM_layout.json";
        a.click();
    },

    onChangeLoadLayoutFileSelector: function(event) {
        var tgt = event.target;
        var files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            var fileread = new FileReader();
            fileread.onload = function(e) {
                try {
                    var json = e.target.result;
                    window.localStorage.setItem("BGA_TerraMystica_BoardPositions", json);
                    location.reload();
                } catch (error) {
                    console.log( "Error in onChangeLoadLayoutFileSelector: " + error );
                }
              };
              fileread.readAsText(files[0]);
        }
    },

    onChangeBGFileSelector: function(event) {
		var tgt = event.target || window.event.srcElement;
		var files = tgt.files;

		// FileReader support
		if (FileReader && files && files.length) {
			var fr = new FileReader();
			fr.onload = function () {
				document.getElementById("overall-content").style.backgroundImage = `url(${fr.result})`;
			}
			fr.readAsDataURL(files[0]);
		}
	},

    resizeTitle: function() {
        this.dojo.style( 'page-title', 'width', 'fit-content' );
        this.dojo.style( 'page-title', 'margin', '0 auto' );
    },

    toggleChat: function() {
        var x = document.getElementById("chatbar");
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    },
};

function isObjectEmpty(object) {
    return object == null || typeof(object) == "undefined" ||
        (Object.keys(object).length === 0 && object.constructor === Object);
}

function waitForTMLoading(lambda) {
    // check if game is properly loaded, if not loop until it is
    var gamedatas = window.parent.gameui.gamedatas;
    if (!isObjectEmpty(gamedatas)) {
        if (Object.keys(gamedatas.players).length > 0) {
            var firstPlayerId = Object.keys(gamedatas.players)[0];
            var elem = document.getElementById("workers_count_" + firstPlayerId);
            if (!isObjectEmpty(elem)) {
                lambda();
                return;
            }
        }
    }

    setTimeout(() => {waitForTMLoading(lambda);} , 1000);
}

function onKeyPress(event) {
    if (event.ctrlKey && event.shiftKey && event.keyCode == 12 && Is_Inside_Game) { // L
        if (!window.parent || !window.parent.gameui || !window.parent.gameui.game_name ||
            (window.parent.gameui.game_name != "terramystica") || window.parent.isTMLayoutManagerStarted) {
            return;
        }
        waitForTMLoading(() => {
            console.log("TMLayoutManager activated");
            window.parent.isTMLayoutManagerStarted = true;
            window.parent.tmLayoutManager = TMLayoutManager.init();
        });
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 11 && Is_Inside_Game) { // K
        if (window.parent && window.parent.tmLayoutManager) {
            window.parent.tmLayoutManager.toggleChat();
        }
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 21 && Is_Inside_Game) { // U
        if (window.parent && window.parent.tmLayoutManager) {
            window.parent.tmLayoutManager.resizeTitle();
        }
    }
}

document.documentElement.addEventListener("keypress", onKeyPress); 
