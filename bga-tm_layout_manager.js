// ==UserScript==
// @name         BGA Terra mystica layout manager
// @description  Help manage layouts for TM games on BGA
// @namespace    https://github.com/Rincevent/TerraMysticaTurnCalculator
// @author       https://github.com/Rincevent
// @version      1.2.1
// @include      *boardgamearena.com/*
// @grant        none
// ==/UserScript==

// System variables - don't edit
const Is_Inside_Game = /\?table=[0-9]*/.test(window.location.href);


// Main TM Layour maanger object
var TMLayoutManager = {
    dojo: null,
    game: null,
    playerInfoMoved: false,
    smallTittle: false,
    hideChat: false,

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
            this.dojo.place( '<p><span>Change background: </span><input type="file" id="bg_file_selector" accept=".jpg, .jpeg, .png"></p>\
                              <p><button id="bg_reset_button" style="width:20%">Reset</button></p>\
                              <p><span>Background opacity: <input type="range" id="bg_opacity" min="0" max="100" value="25" step="1"></p>\
                              <p><label for="floating_panels_cb">Floating player panel:</label>&nbsp;&nbsp;<input type="checkbox" id="floating_panels_cb" name="floating_panels_cb"></p>\
                              <p><label for="hide_chat_cb">Hide chat:</label>&nbsp;&nbsp;<input type="checkbox" id="hide_chat_cb" name="hide_chat_cb"></p>\
                              <p><label for="small_title_cb">Small title (unplayable - only for spectators mode):</label>&nbsp;&nbsp;<input type="checkbox" id="small_title_cb" name="small_title_cb"></p>', $('layout_options_div') );


            this.loadInfoFromJson();

            this.dojo.query( '#bg_file_selector' ).connect( 'onchange', this, 'onChangeBGFileSelector' );
            this.dojo.query( '#bg_opacity' ).connect( 'onchange', this, 'onChangeOpacity' );
            dojo.query( '#floating_panels_cb' ).connect( 'onchange', this, 'togglePlayerInfo' );
            dojo.query( '#hide_chat_cb' ).connect( 'onchange', this, 'toggleChat' );
            dojo.query( '#small_title_cb' ).connect( 'onchange', this, 'toggleSmallTitle' );
            dojo.query( '#bg_reset_button' ).connect( 'onclick', this, 'resetBackground' );

            // fit background size to panels
            this.game.fitGameArea();

            this.game.saveBoardsToLocalStorage = this.saveBoardsToLocalStorage.bind(this);
            this.parentOnScreenWidthChange = this.game.onScreenWidthChange.bind(this.game);
            this.game.onScreenWidthChange = this.onScreenWidthChange.bind(this);

        }

        return this;
    },

    onScreenWidthChange: function() {
        this.parentOnScreenWidthChange();
        this.onResize();
    },

    togglePlayerInfo: function() {
        this.playerInfoMoved = !this.playerInfoMoved;
        this.saveBoardsToLocalStorage();

        this.updatePlayerInfo();
    },

    updatePlayerInfo: function() {
        if (this.playerInfoMoved) {
            this.movePlayerInfo();
        } else {
            this.restorePlayerInfo();
        }

        // fit background size to panels
        this.game.fitGameArea();
    },

    movePlayerInfo: function() {
        // reparent and make player info board movable
        var parent = document.getElementById("tm_game_area");
        for( var player_id in this.game.gamedatas.players )
        {
            this.makeMovable(parent, 'overall_player_board_' + player_id);
        }

        this.makeMovable(parent, 'logs');
        this.makeResizable('logs');

        this.onResize();

        // hide stuff we do not want to see
        this.dojo.style( 'right-side', 'display', 'none' );
    },

    restorePlayerInfo: function() {
        var parent = document.getElementById("player_boards");
        for( var player_id in this.game.gamedatas.players )
        {
            this.makeUnMovable(parent, 'overall_player_board_' + player_id);
        }

        this.makeUnMovable(document.getElementById("logs_wrap"), 'logs');
        this.makeUnresizable('logs');

        this.dojo.style( 'right-side', 'display', 'block' );
    },

    makeUnMovable: function(parent, board_id) {
        var board = document.getElementById(board_id);
        board.style.position = null;
        board.style.top = null;
        board.style.left = null;
        parent.appendChild(board);

        var dragger = document.getElementById("dragger_" + board_id);
        if (dragger)
            dragger.parentElement.removeChild(dragger);
    },

    makeUnresizable: function(board_id) {
        var board = document.getElementById(board_id);
        board.style.width = null;
        board.style.height = null;

        var resizer = document.getElementById("resizer_" + board_id);
        if (resizer)
            resizer.parentElement.removeChild(resizer);
    },

    onResize: function() {
        try {
            if (this.playerInfoMoved) {
                for (let i in this.game.players_in_order) {
                    if (this.game.customLayoutInfo.hasOwnProperty('player_info_board_'+i)) {
                        const layout = this.game.customLayoutInfo['player_info_board_'+i];
                        var board = document.getElementById('overall_player_board_'+this.game.players_in_order[i]);
                        board.style.left = Math.floor(parseFloat(layout.left)*this.game.playzoneCoords.w) + "px";
                        board.style.top = Math.floor(parseFloat(layout.top)*this.game.playzoneCoords.w) + "px";
                    }
                }

                if (this.game.customLayoutInfo.hasOwnProperty('logs')) {
                    this.game.setBoardPosition(this.game.playzoneCoords.w, 'logs');
                    var board = document.getElementById('logs');
                    board.style.width = this.game.retrieveBoardWidth(this.game.playzoneCoords.w, 'logs') + "px";
                    board.style.height = this.game.retrieveBoardHeight(this.game.playzoneCoords.w, 'logs') + "px";
                }
            }
        }
        catch (error) {
            console.log( "Error loading info player board position: " + error );
        }
    },

    loadInfoFromJson: function() {
        if (this.game.customLayoutInfo.hasOwnProperty('opacity')) {
            this.bg_opacity = this.game.customLayoutInfo['opacity'];
            $( 'bg_opacity' ).value = Math.floor(this.bg_opacity*100);
            this.updateOpacity();
        } else {
            this.bg_opacity = 0.25;
        }

        if (this.game.customLayoutInfo.hasOwnProperty('floating_panels')) {
            this.playerInfoMoved = this.game.customLayoutInfo['floating_panels'];
            $( 'floating_panels_cb' ).checked = this.playerInfoMoved;
            this.updatePlayerInfo();
        }
        if (this.game.customLayoutInfo.hasOwnProperty('hide_chat')) {
            this.hideChat = this.game.customLayoutInfo['hide_chat'];
            $( 'hide_chat_cb' ).checked = this.hideChat;
            this.updateChat();
        }
        if (this.game.customLayoutInfo.hasOwnProperty('small_title')) {
            this.smallTittle = this.game.customLayoutInfo['small_title'];
            $( 'small_title_cb' ).checked = this.smallTittle;
            this.updateTitle();
        }

        const imgFile = window.localStorage.getItem("BGA_TerraMystica_CustomBG");
        if (imgFile != null && imgFile != undefined)
            document.getElementById("overall-content").style.backgroundImage = `url(${imgFile})`;
    },

    makeMovable: function(parent, board_id) {
        var board = document.getElementById(board_id);
        board.style.position = "absolute";
        parent.appendChild(board);

        var drager = document.createElement("div");
        drager.className = "dragable";
        drager.id = "dragger_" + board_id;
        board.appendChild(drager);
        drager.addEventListener("mousedown", this.game.initMoveDrag.bind(this.game), false);
        drager.parentDiv = board;
    },

    makeResizable:function(board_id) {
        var board = document.getElementById(board_id);
        var resizer = document.createElement("div");
        resizer.className = "resizer";
        resizer.id = "resizer_" + board_id;
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
        const game_page_width = dojo.coords( 'tm_game_area' ).w;
        var to_save = this.game.getBoardInfoJson();

        for (let i in this.game.players_in_order) {
            to_save['player_info_board_'+i] = this.game.retrieveBoardRect(game_page_width, 'overall_player_board_'+this.game.players_in_order[i], false);
        }

        to_save['logs'] = this.game.retrieveBoardRect(game_page_width, 'logs', true);

        to_save['opacity'] = this.bg_opacity;
        to_save['floating_panels'] = this.playerInfoMoved;
        to_save['hide_chat'] = this.hideChat;
        to_save['small_title'] = this.smallTittle;

        return to_save;
    },

    saveBoardsToLocalStorage: function() {
        var to_save = this.getBoardInfoJson();
        var json = JSON.stringify(to_save);
        window.localStorage.setItem("BGA_TerraMystica_Layout", json);
    },

    onChangeBGFileSelector: function(event) {
		var tgt = event.target || window.event.srcElement;
		var files = tgt.files;

		// FileReader support
		if (FileReader && files && files.length) {
			var fr = new FileReader();
			fr.onload = function () {
                const imgFile = fr.result;
                window.localStorage.setItem("BGA_TerraMystica_CustomBG", imgFile);
				document.getElementById("overall-content").style.backgroundImage = `url(${imgFile})`;
			}
			fr.readAsDataURL(files[0]);
		}
	},

    resetBackground: function(event) {
        document.getElementById("overall-content").style.backgroundImage = null;
        window.localStorage.setItem("BGA_TerraMystica_CustomBG", null);
    },

    updateOpacity: function() {
        this.dojo.style( 'faction_selection', 'background-color', 'rgba(255, 255, 255, '+this.bg_opacity+')' );
        this.dojo.query(".faction_supply").style('background-color', 'rgba(255, 255, 255, '+this.bg_opacity+')' );
        this.dojo.query(".favors_collection").style('background-color', 'rgba(255, 255, 255, '+this.bg_opacity+')' );
	},

    onChangeOpacity: function(event) {
        var changed = event.target;
        this.bg_opacity = changed.value / 100.0;
        this.updateOpacity();
        this.saveBoardsToLocalStorage();
	},

    toggleSmallTitle: function() {
        this.smallTittle = !this.smallTittle;
        this.saveBoardsToLocalStorage();
        this.updateTitle();
    },

    updateTitle: function() {
        if (this.smallTittle)
            this.resizeTitle();
        else
            this.restoreTitle();
    },

    resizeTitle: function() {
        if (this.smallTittle && !this.dojo.hasClass('page-title', 'fixed-page-title')) {
            this.dojo.style( 'page-title', 'width', 'fit-content' );
            this.dojo.style( 'page-title', 'margin', '0 auto' );
            this.dojo.style( 'generalactions', 'display', 'none' );
            this.dojo.style( 'not_playing_help', 'visibility', 'hidden' );
            this.dojo.style( 'not_playing_help', 'position', 'absolute' );
        }
    },

    restoreTitle: function() {
        this.dojo.style( 'page-title', 'width', null );
        this.dojo.style( 'page-title', 'margin', null );
        this.dojo.style( 'generalactions', 'display', 'inline' );
        this.dojo.style( 'not_playing_help', 'visibility', null );
        this.dojo.style( 'not_playing_help', 'position', null );
    },

    toggleChat: function() {
        this.hideChat = !this.hideChat
        this.saveBoardsToLocalStorage();
        this.updateChat();
    },

    updateChat: function() {
        var x = document.getElementById("chatbar");
        if (!this.hideChat) {
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

function onLoad(event) {
    if (Is_Inside_Game) {
        setTimeout(() => { // Wait for BGA to load dojo and TM scripts
            if (!window.parent || !window.parent.gameui || !window.parent.gameui.game_name ||
                (window.parent.gameui.game_name != "terramystica" && window.parent.gameui.game_name != "terramysticaext")) {
                return;
            }
            waitForTMLoading(() => {
                // Prevent multiple launches
                if (window.parent.isTMLayoutManagerStarted) {
                    return;
                } else {
                    console.log("TMLayoutManager activated");
                    window.parent.isTMLayoutManagerStarted = true;
                    window.parent.tmLayoutManager = TMLayoutManager.init();
                    document.documentElement.addEventListener("keypress", onKeyPress);
                    window.addEventListener("scroll", window.parent.tmLayoutManager.resizeTitle.bind(window.parent.tmLayoutManager));
                }
            });
        }, 2000);
    }
}

function onKeyPress(event) {
    if (event.ctrlKey && event.shiftKey && event.keyCode == 12 && Is_Inside_Game) { // L
        if (window.parent && window.parent.tmLayoutManager) {
            window.parent.tmLayoutManager.togglePlayerInfo();
        }
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 11 && Is_Inside_Game) { // K
        if (window.parent && window.parent.tmLayoutManager) {
            window.parent.tmLayoutManager.toggleChat();
        }
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 21 && Is_Inside_Game) { // U
        if (window.parent && window.parent.tmLayoutManager) {
            window.parent.tmLayoutManager.toggleSmallTitle();
        }
    }
}

window.addEventListener("load", onLoad);
