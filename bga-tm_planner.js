// ==UserScript==
// @name         BGA Terra mystica game planner
// @description  Visual aid that extends BGA Terra mystica game interface
// @namespace    https://github.com/Rincevent/TerraMysticaTurnCalculator
// @author       https://github.com/Rincevent
// @version      1.0.0
// @include      *boardgamearena.com/*
// @grant        none
// ==/UserScript==
//
// ==/UserScript==

// System variables - don't edit
const Is_Inside_Game = /\?table=[0-9]*/.test(window.location.href);
const Enable_Logging = true;

var TMPcommonActions = JSON.parse(`{
  "dwelling": {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0", "limit": "17", "max": "8"},
  "tradinghouse": {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "dwelling", "limit": "9", "max": "4"},
  "temple": {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "tradinghouse", "max": "3"},
  "stronghold": {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "tradinghouse", "max": "1"},
  "sanctuary": {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "temple", "max": "1"},
  "exchange": {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2", "max": "2"},
  "shipping": {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3", "max": "3"},
  "S1": {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
  "S2": {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0", "limit": "9", "hide_with_structure": "exchange", "hide_with_number": "2"},
  "S3": {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0", "limit": "9", "hide_with_structure": "exchange", "hide_with_number": "1"},
  "town": {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
}`);
var TMPfactionsOverride = JSON.parse(`{
  "alchemists": {},
  "auren": {
    "sanctuary": {"coin": "8"}
  },
  "chaosmagicians": {
    "stronghold": {"coin": "4"},
    "sanctuary": {"coin": "8"}
  },
  "cultists": {
    "stronghold": {"coin": "8"},
    "sanctuary": {"coin": "8"}
  },
  "darklings": {
    "sanctuary": {"coin": "10"},
    "exchange": {"remove": "1"},
    "S1": {"remove": "1"},
    "S2": {"remove": "1"},
    "S3": {"remove": "1"},
    "SP": {"name": "Spade", "worker": "0", "coin": "0", "priest": "1", "vp": "2"}
  },
  "dwarves": {
    "shipping": {"remove": "1"},
    "T1": {"name": "Tunneling 1W", "worker": "1", "coin": "0", "priest": "0", "vp": "4"},
    "T2": {"name": "Tunneling 2W", "worker": "2", "coin": "0", "priest": "0", "vp": "4", "hide_with_structure": "stronghold", "hide_with_number": "1"}
  },
  "engineers": {
    "dwelling": {"worker": "1", "coin": "1"},
    "tradinghouse": {"worker": "1", "coin": "2"},
    "temple": {"worker": "1", "coin": "4"},
    "stronghold": {"worker": "3", "coin": "6"},
    "sanctuary": {"worker": "3", "coin": "6"},
    "bridge": {"name": "Bridge", "worker": "2", "coin": "0", "priest": "0", "limit": "3"}
  },
  "fakirs": {
    "S1": {"remove": "1"},
    "stronghold": {"coin": "10"},
    "shipping": {"remove": "1"},
    "exchange": {"limit": "1"},
    "CF": {"name": "Carpet flight", "worker": "0", "coin": "0", "priest": "1", "vp": "4"}
  },
  "giants": {},
  "Halflings": {
    "stronghold": {"coin": "8"},
    "exchange": {"coin": "1"},
    "S1": {"vp": "1"},
    "S2": {"vp": "1"},
    "S3": {"vp": "1"}
  },
  "mermaids": {
    "sanctuary": {"coin": "8"},
    "shipping": {"vp": ["0", "2", "3", "4", "5"], "limit": "5", "max": "5"}
  },
  "nomads": {
    "stronghold": {"coin": "8"}
  },
  "swarmlings": {
    "dwelling": {"worker": "2", "coin": "3"},
    "tradinghouse": {"worker": "3", "coin": "4"},
    "temple": {"worker": "3", "coin": "6"},
    "stronghold": {"worker": "5", "coin": "8"},
    "sanctuary": {"worker": "5", "coin": "8"}
  },
  "witches": {
    "town": {"vp": "5"}
  }
}`);

var TMPboni = JSON.parse(`{
  "0" : {"name": "None", "building": [], "vp": "0"},
  "7" : {"name": "1VP per pass Dwelling", "building": ["dwelling"], "vp": "1", "passVP": "true"},
  "8" : {"name": "2VP per pass TP", "building": ["tradinghouse"], "vp": "2", "passVP": "true"},
  "9" : {"name": "4VP per pass SH/SA", "building": ["stronghold", "sanctuary"], "vp": "4", "passVP": "true"},
  "10" : {"name": "3VP per pass Ship", "building": ["shipping"], "vp": "3", "passVP": "true"}
}`);

var TMPfavors = JSON.parse(`{
  "10" : {"name": "3VP per Trading Post", "building": ["tradinghouse"], "vp": "3"},
  "11" : {"name": "2VP per Dwelling", "building": ["dwelling"], "vp": "2"},
  "12" : {"name": "2/3/4VP per pass TP", "building": ["tradinghouse"], "vp": ["0", "2", "3", "3", "4"], "passVP": "true"}
}`);

var TMPscorings = JSON.parse(`{
  "1" : {"name": "2VP per Dwelling", "building": ["dwelling"], "vp": "2"},
  "2" : {"name": "2VP per Dwelling", "building": ["dwelling"], "vp": "2"},
  "3" : {"name": "3VP per Trading Post", "building": ["tradinghouse"], "vp": "3"},
  "4" : {"name": "3VP per Trading Post", "building": ["tradinghouse"], "vp": "3"},
  "5" : {"name": "5VP per SH/SA", "building": ["stronghold", "sanctuary"], "vp": "5"},
  "6" : {"name": "5VP per SH/SA", "building": ["stronghold", "sanctuary"], "vp": "5"},
  "7" : {"name": "2VP per spade", "building": ["S1", "S2", "S3", "SP"], "vp": "2"},
  "8" : {"name": "5VP per Town", "building": ["town"], "vp": "5"},
  "9" : {"name": "4VP per Temple", "building": ["temple"], "vp": "4"}
}`);

// Main TM object
var TMPlanner = {
    dojo: null,
    game: null,
    players: {},
    factions: {},
    bonus_tiles: [],
    scoring_tiles: [],
    current_turn: 1,

    // Init TM turn planner
    init: function() {
        // Check if the site was loaded correctly
        if (!window.parent || !window.parent.dojo || !window.parent.gameui) {
            return;
        }
        this.dojo = window.parent.dojo;
        this.game = window.parent.gameui;
        this.gamedatas = this.game.gamedatas;

		// prepare data structure for each players
		for (var playerId in this.gamedatas.players) {
            var playerInfo = this.gamedatas.players[playerId];
            this.players[playerId] = {};
            this.players[playerId].name = playerInfo.name;
            this.players[playerId].faction = playerInfo.faction;
            this.players[playerId].cult = {};
            this.players[playerId].ressources = {};
            this.players[playerId].supply = {};
            this.players[playerId].built_structures = {};
            this.players[playerId].favors = [];
            this.players[playerId].plannedRound = 0;
		}

        // extract bonus tiles
        for (var bonusIdx in this.gamedatas.bonus_cards) {
            var bonus = this.gamedatas.bonus_cards[bonusIdx];
            this.bonus_tiles.push(parseInt(bonus.bonus_type));
        }
        this.bonus_tiles.sort();

        // extract scoring tiles
        for (var scoringIdx in this.gamedatas.scoring_tiles) {
            var scoring = this.gamedatas.scoring_tiles[scoringIdx];
            this.scoring_tiles.push(parseInt(scoring.scoring_type));
        }

		if (Enable_Logging) console.log("Bonus tiles: " + this.bonus_tiles);
		if (Enable_Logging) console.log("Scoring tiles: " + this.scoring_tiles);

        this.buildFaction();
        this.updateView();
        this.renderTMPMenu();
        this.setStyles();

        this.dojo.subscribe("dwellingPlaced", this, "onChange");
        this.dojo.subscribe("landscapePlaced", this, "onChange");
        this.dojo.subscribe("structureUpgraded", this, "onChange");
        this.dojo.subscribe("bonusCardChosen", this, "onChange");
        this.dojo.subscribe("favorTileChosen", this, "onChange");
        this.dojo.subscribe("playerPassed", this, "onChange");
        this.dojo.subscribe("advanceExchangeTrack", this, "onChange");
        this.dojo.subscribe("advanceShippingTrack", this, "onChange");
        this.dojo.subscribe("advanceCultTrack", this, "onChange");
        this.dojo.subscribe("orderAPriest", this, "onChange");
        this.dojo.subscribe("actionUsed", this, "onChange");
        this.dojo.subscribe("specialActionUsed", this, "onChange");
        this.dojo.subscribe("terrainTransformed", this, "onChange");
        this.dojo.subscribe("townFounded", this, "onChange");
        this.dojo.subscribe("incomePhase", this, "onChange");
        this.dojo.subscribe("powerActionConvert", this, "onChange");
        this.dojo.subscribe("powerViaStructures", this, "onChange");
        this.dojo.subscribe("powerIncome", this, "onChange");
        this.dojo.subscribe("workersIncome", this, "onChange");
        this.dojo.subscribe("workersForPriests", this, "onChange");

        return this;
    },

    onChange: function(event) {
        this.updateView();
        this.updatePlayerPlannerMenu();
    },


    buildFaction: function() {
        for(var playerId in this.players) {
            var faction = this.players[playerId].faction;
            var overrides = TMPfactionsOverride[faction];
            this.factions[faction] = {};
            for(var action in TMPcommonActions) {
                var data = TMPcommonActions[action];
                this.factions[faction][action] = {};
                for(var key in data) {
                    var value = data[key];
                    this.factions[faction][action][key] = value;
                }
            }
            for (var actionO in overrides) {
                var dataO = overrides[actionO];
                for(var keyO in dataO) {
                    var valueO = dataO[keyO];
                    if (keyO == "remove") {
                        delete this.factions[faction][actionO];
                    } else {
                        if(!this.factions[faction].hasOwnProperty(actionO)) {
                            this.factions[faction][actionO] = {};
                        }
                        this.factions[faction][actionO][keyO] = valueO;
                    }
                }
            }
        }

		if (Enable_Logging) console.log("Factions info:");
        if (Enable_Logging) console.log(this.factions);
    },

     // update game view
    updateView: function() {
         // collect info for each players
         for (var playerId in this.gamedatas.players) {
             var playerInfo = this.gamedatas.players[playerId];
             this.players[playerId].built_structures = { "dwelling": 0, "tradinghouse": 0, "temple": 0, "stronghold": 0, "sanctuary": 0, "shipping": parseInt(playerInfo.player_shipping), "exchange": parseInt(playerInfo.player_exchange)-1 };

             this.players[playerId].cult.air = parseInt(playerInfo.player_aircult);
             this.players[playerId].cult.earth = parseInt(playerInfo.player_earthcult);
             this.players[playerId].cult.fire = parseInt(playerInfo.player_firecult);
             this.players[playerId].cult.water = parseInt(playerInfo.player_watercult);
             this.players[playerId].ressources.coins = parseInt(playerInfo.player_coins);
             this.players[playerId].score = parseInt(playerInfo.score);
             this.players[playerId].ressources.spades = parseInt(playerInfo.player_spades);
             this.players[playerId].ressources.workers = this.game.workersCollection[playerId].items.length;
             this.players[playerId].supply.bridge = this.game.bridgeSupply[playerId].items.length;

             for (var i=0; i< this.game.favorsCollection[playerId].items.length; i++) {
                 var favorIdx = parseInt(this.game.favorsCollection[playerId].items[i].id.split("_")[2]);
                 this.players[playerId].favors.push(parseInt(this.gamedatas.favor_tiles[favorIdx].favor_type));
             }
             this.players[playerId].ressources.power1 = this.game.power1Supply[playerId].items.length;
             this.players[playerId].ressources.power2 = this.game.power2Supply[playerId].items.length;
             this.players[playerId].ressources.power3 = this.game.power3Supply[playerId].items.length;

             this.players[playerId].ressources.priests = this.game.priestsCollection[playerId].items.length;
             this.players[playerId].supply.priests = this.game.priestSupply[playerId].items.length;
         }

        // which player has which bonus tiles
        for (var bonusIdx in this.gamedatas.bonus_cards) {
            var bonus = this.gamedatas.bonus_cards[bonusIdx];
            if (bonus.player_id != null) {
                this.players[parseInt(bonus.player_id)].bonus_card = parseInt(bonus.bonus_type);
            }
        }

        //what is current turn
        for (var scoringIdx in this.gamedatas.scoring_tiles) {
            var scoring = this.gamedatas.scoring_tiles[scoringIdx];
            if (scoring.scoring_done != "0") {
                this.current_turn = parseInt(scoringIdx) + 1;
            }
        }

        // extract structures built by each players
        for (var structureIdx in this.gamedatas.structures) {
            var structure = this.gamedatas.structures[structureIdx];
            if (structure.bts_id != null) {
                this.players[structure.player_id].built_structures[structure.struct_type] += 1;
            }
        }

		if (Enable_Logging) console.log("Current turn: " + this.current_turn);
		if (Enable_Logging) console.log("Players info:");
        if (Enable_Logging) console.log(this.players);
    },

    // Render TMP planner accordeon
    renderTMPMenu: function() {
        for (var playerId in this.players) {
            var menuHtml = "<div id='TMP_menu_" + playerId + "'>";
            menuHtml += "<p><div id='TMP_menu_list_toggle_" + playerId + "' class='toggle_container'>";
            menuHtml += "<a href='javascript:void(0)' class='collapser TMP_hidden' data-target='#TMP_menu_content_" + playerId + "'>-Plan</a>";
            menuHtml += "<a href='javascript:void(0)' class='expander' data-target='#TMP_menu_content_" + playerId + "'>+Plan</a>";
            menuHtml += "</div></p>";
            menuHtml += "<div class='menu_content TMP_hidden' id='TMP_menu_content_" + playerId + "'>";
            menuHtml += "</div></div>";
            this.dojo.place(menuHtml, "player_faction_" + playerId, "after");
        }

        // Expand & collapse menu handlers
        var collapsers = this.dojo.query(".collapser");
        for (var i=0; i < collapsers.length; i++) {
            this.dojo.connect(collapsers[i], "onclick", this, "toggleCollapserExpander");
        }
        var expanders = this.dojo.query(".expander");
        for (var j=0; j < collapsers.length; j++) {
            this.dojo.connect(expanders[j], "onclick", this, "toggleCollapserExpander");
        }

        this.renderPlayerPlannerMenu();
    },

    getActionLimit: function(playerId, actionIdx) {
        var faction = this.factions[this.players[playerId].faction];
        var action = faction[actionIdx];
        var limit = 15;
        if (action.hasOwnProperty("limit")) {
            limit = parseInt(action.limit);
        }
        if (this.players[playerId].supply.hasOwnProperty(actionIdx)) {
            limit = parseInt(this.players[playerId].supply[actionIdx]);
        }
        if (this.players[playerId].built_structures.hasOwnProperty(actionIdx)) {
            limit -= parseInt(this.players[playerId].built_structures[actionIdx]);
        }
        if (actionIdx == "temple" || actionIdx == "tradinghouse" || actionIdx == "dwelling") {
            limit -= parseInt(this.players[playerId].built_structures.sanctuary);
        }
        if (actionIdx == "tradinghouse" || actionIdx == "dwelling") {
            limit -= parseInt(this.players[playerId].built_structures.temple);
            limit -= parseInt(this.players[playerId].built_structures.stronghold);
        }
        if (actionIdx == "dwelling") {
            limit -= parseInt(this.players[playerId].built_structures.tradinghouse);
        }

        // hide action of some structure are built (e.g. hide 2W tunneling if dwarve stronghold is built)
        if (action.hasOwnProperty("hide_with_structure")) {
            if (parseInt(this.players[playerId].built_structures[action.hide_with_structure]) >= parseInt(action.hide_with_number)) {
                limit = 0;
            }
        }
        return limit;
    },

    // render planner menu for each players
    renderPlayerPlannerMenu: function() {
        for (var playerId in this.players) {
            var menuHtml = "<div id='divPlanning_" + playerId + "' >";
            menuHtml += "<div class='TMPtab'>"
            menuHtml += "<button class='TMPtablinks' id='radio_0_"+ playerId + "'>Current</button>";
            menuHtml += "<button class='TMPtablinks' id='radio_1_"+ playerId + "'>Next round</button>";
            menuHtml += "</div>"
            menuHtml += "<table>";
            var faction = this.factions[this.players[playerId].faction];
            for (var actionIdx in faction) {
                var action = faction[actionIdx];
                var actName = action.name;
                var limit = 15;
                menuHtml += "<tr id='select_line_" + playerId + "_" + actionIdx + "'>";
                menuHtml += "<td style='padding-top: 3px'>" + actName + ":</td>";
                menuHtml += "<td style='padding-left: 10px; padding-top: 3px'><input type='number' class='select_TMP' value='0' min='0' max='" + limit + "' id='select_" + playerId + "_" + actionIdx + "' style='width: 3em'>";
                menuHtml += "</select></td></tr>";
            }
            menuHtml += "</table>";
            menuHtml += "<p></p>";
            menuHtml += "<table>";
            menuHtml += "<tr><td style='padding-top: 5px'><u>Needs:</u></td></tr>";
            menuHtml += "<tr><td style='position: relative; top: -2px'>";
            menuHtml += "<label id='workerCount_" + playerId + "' style='position: relative; left: 8px; top: 6px'>0</label><div class='workers_collection ttworkers' style='position: relative; top: 10px; width: 21px; height: 21px; background-size: 364px 42px; background-position: -21px 0px'></div>";
            menuHtml += "<label id='coinCount_" + playerId + "' style='padding-left: 15px; position: relative; top: 6px'>0</label><div class='coins_icon tm_panel_icon ttcoins' style='position: relative; top: 10px'></div>";

            var priestStyle = "<position: relative; background-size: 351px 450px; background-repeat: no-repeat; background-position: -301px -281px; width: 51px; height: 51px;";
            var priestElem = document.getElementById("priests_collection_" + playerId);
            if (!isObjectEmpty(priestElem)) {
                priestStyle = priestElem.getAttribute('style');
            }
            menuHtml += "<label id='priestCount_" + playerId + "' style='padding-left: 2px; position: relative; left: 12px; top: 6px'>0</label><div class='priests_collection ttpriests' style='" + priestStyle + "'></div>";
            menuHtml += "</td></tr>";
            menuHtml += "</table>";
            menuHtml += "<p></p>";
            menuHtml += "<div  id='expectedScore_" + playerId + "'>";
            menuHtml += "<label><u>Scoring:</u> +</label>";
            menuHtml += "<label id='scoreLabel_" + playerId + "'>0</label>";
            menuHtml += "<i class='fa fa-star'></i></div>";
            menuHtml += "<br><label style='color:red' id='errorLabel_" + playerId + "'></label>";
            this.dojo.place(menuHtml, "TMP_menu_content_" + playerId, "only");

            var selects_tmp = this.dojo.query(".select_TMP", "TMP_menu_content_" + playerId);
            for (var k=0; k < selects_tmp.length; k++) {
                this.dojo.connect(selects_tmp[k], "onchange", this, "computeResourcesNeeded");
            }
            this.dojo.connect(document.getElementById("radio_0_"+ playerId), "onclick", this, "radioRoundSelected");
            this.dojo.connect(document.getElementById("radio_1_"+ playerId), "onclick", this, "radioRoundSelected");
            this.radioRoundSelected({"target": document.getElementById("radio_0_"+ playerId)});
        }
        this.updatePlayerPlannerMenu();
    },

    updatePlayerPlannerMenu: function() {
        for (var playerId in this.players) {
            var menuHtml = "<div id='divPlanning_" + playerId + "' >";
            menuHtml += "<table>";
            var faction = this.factions[this.players[playerId].faction];
            for (var actionIdx in faction) {
                var action = faction[actionIdx];
                var actName = action.name;
                var limit = this.getActionLimit(playerId, actionIdx);

                var elem = document.getElementById("select_" + playerId + "_" + actionIdx);
                if (isObjectEmpty(elem)) {
                    return;
                }
                elem.setAttribute("max", limit);
                if (parseInt(elem.value) > limit) {
                    elem.value = limit;
                }
                if (limit <= 0) {
                    document.getElementById("select_line_" + playerId + "_" + actionIdx).setAttribute("class", "TMP_hidden");
                }
            }
            this.computeScoring(playerId);
        }
    },

    // Toggle hide / show of any visual element given data-target
    toggleCollapserExpander: function(event) {
        this.dojo.query(".collapser, .expander", event.target.parentNode).toggleClass("TMP_hidden");
        this.dojo.query(event.target.getAttribute('data-target')).toggleClass("TMP_hidden");
    },

    computeResourcesNeeded : function(event) {
        var selectId = event.target.getAttribute('id');
        var selectSplit = selectId.split("_");
        var playerId = parseInt(selectSplit[1]);
        var selectActionIdx = selectSplit[2];

        // change value if not within range
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        var limit = this.getActionLimit(playerId, selectActionIdx);
        if (event.target.value > limit) {
            event.target.value = limit;
        }

        var nbWorkers = 0;
        var nbCoins = 0;
        var nbPriests = 0;
        var faction = this.factions[this.players[playerId].faction];
        for (var actionIdx in faction) {
            var elem = document.getElementById("select_" + playerId + "_" + actionIdx);
            if (!isObjectEmpty(elem)) {
                var count = parseInt(elem.value);
                if (count > 0) {
                    var action = faction[actionIdx];
                    nbWorkers += action.worker*count;
                    nbCoins += action.coin*count;
                    nbPriests += action.priest*count;
                }
            }
        }
        document.getElementById("workerCount_" + playerId).innerHTML = nbWorkers;
        document.getElementById("coinCount_" + playerId).innerHTML = nbCoins;
        document.getElementById("priestCount_" + playerId).innerHTML = nbPriests;

        this.computeScoring(playerId);
    },


    radioRoundSelected : function(event) {
        if(isObjectEmpty(event.target)) {
            return;
        }
        var radioId = event.target.getAttribute('id');
        var split = radioId.split("_");
        var round = parseInt(split[1]);
        var other_round = 1-round;
        var playerId = split[2];
        var other_radio_id = "radio_" + other_round + "_" + playerId;
        var other_radio = document.getElementById(other_radio_id);
        if(!isObjectEmpty(other_radio)) {
            other_radio.className = other_radio.className.replace(" active", "");
        }
        event.target.className += " active";

        this.players[playerId].plannedRound = round;
        this.computeScoring(playerId);
    },

    computeScoring: function(playerId) {
        var VP = 0;
        var errorString = "";
        var detailString = "";
        let existingBuildings = {
            dwelling : parseInt(this.players[playerId].built_structures.dwelling),
            tradinghouse : parseInt(this.players[playerId].built_structures.tradinghouse),
            stronghold : parseInt(this.players[playerId].built_structures.stronghold),
            sanctuary : parseInt(this.players[playerId].built_structures.sanctuary),
            shipping : parseInt(this.players[playerId].built_structures.shipping)
        };
        var buildingsAfterActions = Object.assign({}, existingBuildings);

        // check for which turn we are planning
        var plannedTurn = this.players[playerId].plannedRound;
        var playerPassed = false;
        var playerPassedElem = document.getElementById("fp_container_" + playerId);
        if (!isObjectEmpty(playerPassedElem)) {
            playerPassed = playerPassedElem.classList.contains("fp_container_passed");
        }

        if (playerPassed) { // plan next turn if player already passed
            plannedTurn = 1;
        }
        if (this.current_turn == 6) { // can not plan next turn if it is last turn
            plannedTurn = 0;
        }

        // compute score for actions
        var faction = this.factions[this.players[playerId].faction];
        for (var actionIdx in faction) {
            var action = faction[actionIdx];
            var elem = document.getElementById("select_" + playerId + "_" + actionIdx);
            var count = 0;
            if (!isObjectEmpty(elem)) {
                count = parseInt(elem.value);
            }
            if (count > 0) {
                if(action.hasOwnProperty("vp")) {
                    if (Array.isArray(action.vp)) {
                        var startingPoint = existingBuildings[actionIdx];
                        if (action.vp.length >= (parseInt(startingPoint) + parseInt(count))) {
                            var VPToAdd = 0;
                            for (var i = 0; i < count; i++) {
                                VPToAdd += parseInt(action.vp[startingPoint]);
                                startingPoint++;
                            }
                            VP += VPToAdd;
                            detailString += VPToAdd + "VP for \"" + action.name + "\"<br>";
                        }
                    }
                    else {
                        var VPToAddS = parseInt(action.vp)*count;
                        VP += VPToAddS;
                        detailString += VPToAddS + "VP for \"" + action.name + "\"<br>";
                    }
                }
                if (buildingsAfterActions.hasOwnProperty(actionIdx)){
                    buildingsAfterActions[actionIdx] += count;
                }
                if(action.hasOwnProperty("upgrade")){
                    var upgradeFrom = action.upgrade;
                    if (buildingsAfterActions.hasOwnProperty(upgradeFrom)){
                        buildingsAfterActions[upgradeFrom] -= count;
                        if (buildingsAfterActions[upgradeFrom] < 0) {
                            errorString += "<u>Warning:</u> not enough " + faction[upgradeFrom].name + " to upgrade from to build " + count + " " + action.name + ".<br>";
                        }
                    }
                }
            }
        }

        // check if we do not build more that we are allowed to
        for (var idx in buildingsAfterActions) {
            var countAA = buildingsAfterActions[idx];
            if (faction.hasOwnProperty(idx) && countAA > faction[idx].max) {
                var actionName = faction[idx].name;
                errorString += "<u>Warning:</u> not able to build " + parseInt(document.getElementById("select_" + playerId + "_" + idx).value) + " " + actionName + ", only " + (parseInt(faction[idx].max) - parseInt(this.players[playerId].built_structures[idx])) + " " + actionName + " in the supply. Some " + actionName + " must be upgraded first.<br>";
            }
        }

        // compute score for scoring tile
        var scoringIdx = this.scoring_tiles[this.current_turn + plannedTurn - 1];
        var scoring = TMPscorings[scoringIdx];
        var VPToAddSc = 0;
        for(var id in scoring.building) {
            var building = scoring.building[id];
            var elemSc = document.getElementById("select_" + playerId + "_" + building);
            if (!isObjectEmpty(elemSc)) {
                var countSc = parseInt(elemSc.value);
                VPToAddSc += parseInt(scoring.vp)*countSc;
            }
        }
        if (VPToAddSc > 0) {
            VP += VPToAddSc;
            detailString += VPToAddSc + "VP for scoring tile \"" + scoring.name + "\"<br>";
        }

        // compute score for bonus tile
        var bonusIdx = this.players[playerId].bonus_card;
        if (plannedTurn == 1 && !playerPassed) {
            bonusIdx = 0; // we can not compute bonus tile if plan for next turn and player did not pass yet
        }
        var bonus = TMPboni["0"];
        if (TMPboni.hasOwnProperty(bonusIdx)) {
            bonus = TMPboni[bonusIdx];
        }
        var VPToAddB = 0;
        for(var idB in bonus.building) {
            var buildingB = bonus.building[idB];
            var countB = parseInt(buildingsAfterActions[buildingB]);
            VPToAddB += parseInt(bonus.vp)*countB;
        }
        if (VPToAddB > 0) {
            VP += VPToAddB;
            detailString += VPToAddB + "VP for bonus tile \"" + bonus.name + "\"<br>";
        }

        // compute score for favors
        for(var favorId in this.players[playerId].favors) {
            var favorIdx = this.players[playerId].favors[favorId];
            if (TMPfavors.hasOwnProperty(favorIdx)) {
                var favor = TMPfavors[favorIdx];
                var VPToAddF = 0;
                for(var idF in favor.building) {
                    var buildingF = favor.building[idF];
                    if (favor.hasOwnProperty("passVP")) {
                        var countF = parseInt(buildingsAfterActions[buildingF]);
                        if (favor.vp.length > countF) {
                            VPToAddF += parseInt(favor.vp[countF]);
                        }
                    } else {
                        var elemF = document.getElementById("select_" + playerId + "_" + buildingF);
                        if (!isObjectEmpty(elemF)) {
                            var countFF = parseInt(elemF.value);
                            VPToAddF += parseInt(favor.vp)*countFF;
                        }
                    }
                }
                if (VPToAddF > 0) {
                    VP += VPToAddF;
                    detailString += VPToAddF + "VP for favor tile \"" + favor.name + "\"<br>";
                }
            }
        }

        if (errorString !== "") {
            errorString = "<br>" + errorString;
        }
        document.getElementById("scoreLabel_" + playerId).innerHTML = VP;
        document.getElementById("errorLabel_" + playerId).innerHTML = errorString;
        this.game.addTooltipHtml("expectedScore_" + playerId, detailString);
    },

    // Set CSS styles
    setStyles: function() {
        this.dojo.query("body").addClass("TMP_enabled");
        this.dojo.place(
            "<style type='text/css' id='TMP_Styles'>" +
            // Generic settings
            ".TMP_enabled .TMP_hidden { display: none; } " +
            ".TMP_enabled .toggle_container { display: inline; } " +

            /* Style the tab */
            ".TMPtab {" +
            "overflow: hidden;" +
            "border: 1px solid #ccc;" +
            "background-color: #f1f1f1;" +
            "}" +

            /* Style the buttons inside the tab */
            ".TMPtab button {" +
            "width: 50%;" +
            "background-color: inherit;" +
            "float: left;" +
            "border: none;" +
            "outline: none;" +
            "cursor: pointer;" +
            "padding: 5px 5px;" +
            "transition: 0.3s;" +
            "}" +

            /* Change background color of buttons on hover */
            ".TMPtab button:hover {" +
            "background-color: #ddd;" +
            "}" +

            /* Create an active/current tablink class */
            ".TMPtab button.active {" +
            "background-color: #ccc;" +
            "}" +
            "</style>", "overall-content", "first");
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isObjectEmpty(object) {
    return object == null || typeof(object) == "undefined" ||
        (Object.keys(object).length === 0 && object.constructor === Object);
}

// Everything starts here
window.onload = async function() {
    if (Is_Inside_Game) {
        await sleep(3000); // Wait for BGA to load dojo and TM scripts
        if (!window.parent || !window.parent.gameui || !window.parent.gameui.game_name ||
            window.parent.gameui.game_name != "terramystica") {
            return;
        }

        // Prevent multiple launches
        if (window.parent.isTMPlannerStarted) {
            return;
        } else {
            if (Enable_Logging) console.log("TMPlanner activated");
            window.parent.isTMPlannerStarted = true;
            window.parent.tmPlanner = TMPlanner.init();
        }
    }
};
