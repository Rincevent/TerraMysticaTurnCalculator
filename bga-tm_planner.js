// ==UserScript==
// @name         BGA Terra mystica game planner
// @description  Visual aid that extends BGA Terra mystica game interface
// @namespace    https://github.com/Rincevent/TerraMysticaTurnCalculator
// @author       https://github.com/Rincevent
// @version      1.5.0
// @include      *boardgamearena.com/*
// @grant        none
// ==/UserScript==
//
// ==/UserScript==

// System variables - don't edit
const Is_Inside_Game = /\?table=[0-9]*/.test(window.location.href);
const Enable_Logging = false;


var TMPcommonActions = JSON.parse(`{
  "dwelling": {"name": "Dwelling", "workers": "1", "coins": "2", "priests": "0", "limit": "17", "max": "8"},
  "tradinghouse": {"name": "Trading Post", "workers": "2", "coins": "3", "priests": "0", "upgrade": "dwelling", "limit": "9", "max": "4"},
  "temple": {"name": "Temple", "workers": "2", "coins": "5", "priests": "0", "limit": "4", "upgrade": "tradinghouse", "max": "3"},
  "stronghold": {"name": "Stronghold", "workers": "4", "coins": "6", "priests": "0", "limit": "1", "upgrade": "tradinghouse", "max": "1"},
  "sanctuary": {"name": "Sanctuary", "workers": "4", "coins": "6", "priests": "0", "limit": "1", "upgrade": "temple", "max": "1"},
  "exchangetrack": {"name": "Upgrade Dig", "workers": "2", "coins": "5", "priests": "1", "vp": "6", "limit": "2", "max": "2"},
  "shippingtrack": {"name": "Upgrade Ship", "workers": "0", "coins": "4", "priests": "1", "vp": ["2", "3", "4"], "limit": "3", "max": "3"},
  "exchangetrack-3": {"name": "Spade 1W", "workers": "1", "coins": "0", "priests": "0", "vp": "0"},
  "exchangetrack-2": {"name": "Spade 2W", "workers": "2", "coins": "0", "priests": "0", "vp": "0", "limit": "9", "hide_with_structure": "exchangetrack", "hide_with_number": "2"},
  "exchangetrack-1": {"name": "Spade 3W", "workers": "3", "coins": "0", "priests": "0", "vp": "0", "limit": "9", "hide_with_structure": "exchangetrack", "hide_with_number": "1"},
  "town": {"name": "Town", "workers": "0", "coins": "0", "priests": "0", "limit": "4"}
}`);
var TMPfactionsOverride = JSON.parse(`{
  "dwarves": {
    "shippingtrack": {"remove": "1"},
    "T1": {"name": "Tunneling 1W", "workers": "1", "coins": "0", "priests": "0", "vp": "4"},
    "T2": {"name": "Tunneling 2W", "workers": "2", "coins": "0", "priests": "0", "vp": "4", "hide_with_structure": "stronghold", "hide_with_number": "1"}
  },
  "engineers": {
    "bridge": {"name": "Bridge", "workers": "2", "coins": "0", "priests": "0", "limit": "3"}
  },
  "fakirs": {
    "exchangetrack-3": {"remove": "1"},
    "shippingtrack": {"remove": "1"},
    "exchangetrack": {"limit": "1"},
    "CF": {"name": "Carpet flight", "workers": "0", "coins": "0", "priests": "1", "vp": "4"}
  },
  "mermaids": {
    "shippingtrack": {"vp": ["0", "2", "3", "4", "5"], "limit": "5", "max": "5"}
  },
  "witches": {
    "town": {"vp": "5"}
  },
  "acolytes": {
    "exchangetrack-1": {"remove": "1"}
  },
  "dragonlords": {
    "exchangetrack-1": {"remove": "1"}
  },
  "riverwalkers": {
    "shippingtrack": {"remove": "1"},
    "exchangetrack-1": {"remove": "1"}
  },
  "golddiggers": {
    "exchangetrack-2": {"name": "Spade", "workers": "0", "coins": "3", "priests": "0", "vp": "1", "limit": "20", "hide_with_no_structure": "stronghold"},
    "exchangetrack-1": {"name": "Spade", "hide_with_structure": "stronghold", "hide_with_number": "1"}
  }
}`);

var TMPboni = JSON.parse(`{
  "7" : {"name": "1VP per pass Dwelling", "building": ["dwelling"], "vp": "1", "passVP": "true"},
  "8" : {"name": "2VP per pass TP", "building": ["tradinghouse"], "vp": "2", "passVP": "true"},
  "9" : {"name": "4VP per pass SH/SA", "building": ["stronghold", "sanctuary"], "vp": "4", "passVP": "true"},
  "10" : {"name": "3VP per pass Ship", "building": ["shippingtrack"], "vp": "3", "passVP": "true"}
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
  "7" : {"name": "2VP per spade", "building": ["exchangetrack-1", "exchangetrack-2", "exchangetrack-3"], "vp": "2"},
  "8" : {"name": "5VP per Town", "building": ["town"], "vp": "5"},
  "9" : {"name": "4VP per Temple", "building": ["temple"], "vp": "4"}
}`);

// Main TM planner object
var TMPlanner = {
    dojo: null,
    game: null,
    players: {},
    factions: {},
    bonus_tiles: [],
    scoring_tiles: [],
    current_turn: 1,
    score: 0,

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
            var player = this.players[playerId];
            player.name = playerInfo.name;
            player.faction = null;
            player.cult = {};
            player.ressources = {};
            player.supply = {};
            player.built_structures = {};
            player.favors = [];
            player.priests_in_cult = 0;
            player.actions_limit = {};
            player.expanded = false;
        }

        // extract bonus tiles info
        for (var bonusIdx in this.gamedatas.bonus_cards) {
            var bonus = this.gamedatas.bonus_cards[bonusIdx];
            this.bonus_tiles.push(parseInt(bonus.bonus_type));
        }
        this.bonus_tiles.sort();

        // extract scoring tiles info
        for (var scoringIdx in this.gamedatas.scoring_tiles) {
            var scoring = this.gamedatas.scoring_tiles[scoringIdx];
            this.scoring_tiles.push(parseInt(scoring.scoring_type));
        }

        if (Enable_Logging) console.log("Bonus tiles: " + this.bonus_tiles);
        if (Enable_Logging) console.log("Scoring tiles: " + this.scoring_tiles);

        this.buildFaction();
        this.updateView();
        this.renderTMPMenu();
        this.renderPlayerScore();
        this.setStyles();

        this.onFactionChosen();
        this.computeFinalScore();

        // update state on events
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
        this.dojo.subscribe("incomePhase", this, "onChange");
        this.dojo.subscribe("powerActionConvert", this, "onChange");
        this.dojo.subscribe("powerActionBridge", this, "onChange");
        this.dojo.subscribe("workersForPriests", this, "onChange");
        this.dojo.subscribe("updateScore", this, "onChange" );
        this.dojo.subscribe("playerPassed", this, "onChange" );
        this.dojo.subscribe("townFounded", this, "onChange" );
        this.dojo.subscribe("townBonus", this, "onChange" );

        this.dojo.subscribe("factionBoardChosen", this, "onFactionChosen");
        return this;
    },

    onChange: function(event) {
        this.updateView();
        this.updatePlayerPlannerMenu();
        this.computeFinalScore();
    },

    onFactionChosen: function(event) {
        // update player faction info
        for (var playerId in this.gamedatas.players) {
            var faction = this.gamedatas.players[playerId].faction;
            if (this.factions.hasOwnProperty(faction)) {
                this.players[playerId].faction = this.gamedatas.players[playerId].faction;
            }
        }

        this.updatePlayerPlannerMenu();
    },

    buildFaction: function() {

        var ressources = ["workers", "coins", "priests"];

        // get the data from the game
        for(var faction_type in this.gamedatas.factions) {
            var faction = this.gamedatas.factions[faction_type];
            this.factions[faction_type] = {};
            for(var action in TMPcommonActions) {
                var data = TMPcommonActions[action];
                this.factions[faction_type][action] = {};
                for(var key in data) {
                    var value = data[key];
                    this.factions[faction_type][action][key] = value;
                }

                for(var ressourceIdx in ressources) {
                    var ressource = ressources[ressourceIdx];
                    var cost_name = action.replace('-', '_') + "_" + ressource + "_reduced_cost";
                    if (faction.hasOwnProperty(cost_name)) {
                        this.factions[faction_type][action][ressource] = faction[cost_name];
                    } else {
                        var cost_name = action.replace('-', '_') + "_" + ressource + "_cost";
                        if (faction.hasOwnProperty(cost_name)) {
                            this.factions[faction_type][action][ressource] = faction[cost_name];
                        } else {
                            this.factions[faction_type][action][ressource] = 0;
                        }
                    }
                }
            }

            if (faction.hasOwnProperty("spade_used_vp_gain")) {
                this.factions[faction_type]["exchangetrack-1"]["vp"] = faction["spade_used_vp_gain"];
                this.factions[faction_type]["exchangetrack-2"]["vp"] = faction["spade_used_vp_gain"];
                this.factions[faction_type]["exchangetrack-3"]["vp"] = faction["spade_used_vp_gain"];
            }
            if (faction.hasOwnProperty("exchangetrack_upgrade") && faction["exchangetrack_upgrade"] == false) {
                delete this.factions[faction_type]["exchangetrack"];
                delete this.factions[faction_type]["exchangetrack-3"];
                delete this.factions[faction_type]["exchangetrack-2"];
                this.factions[faction_type]["exchangetrack-1"]["name"] = "Spade";
            }

            if (this.score == 0) {
                delete this.factions[faction_type]["town"];
            }
        }

        // override with specific faction info when needed
        for(var faction in TMPfactionsOverride) {
            if (this.factions.hasOwnProperty(faction)) {
                var overrides = TMPfactionsOverride[faction];
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
        }

        if (Enable_Logging) console.log("Factions info:");
        if (Enable_Logging) console.log(this.factions);
    },

     // update game view
    updateView: function() {
         // collect info for each players
         for (var playerId in this.gamedatas.players) {
             var playerInfo = this.gamedatas.players[playerId];
             var player = this.players[playerId];
             player.built_structures = { "dwelling": 0, "tradinghouse": 0, "temple": 0, "stronghold": 0, "sanctuary": 0, "shippingtrack": parseInt(playerInfo.player_shipping), "exchangetrack": parseInt(playerInfo.player_exchange)-1 };

             if (playerInfo.faction == "mermaids") {
                player.built_structures["shippingtrack"] += 1;
            }

             player.cult.air = parseInt(playerInfo.player_aircult);
             player.cult.earth = parseInt(playerInfo.player_earthcult);
             player.cult.fire = parseInt(playerInfo.player_firecult);
             player.cult.water = parseInt(playerInfo.player_watercult);
             player.ressources.coins = parseInt(playerInfo.player_coins);
             player.score = parseInt(playerInfo.score);
             player.ressources.spades = parseInt(playerInfo.player_spades);
             player.ressources.workers = this.game.workersCollection[playerId].items.length;
             player.supply.bridge = this.game.bridgeSupply[playerId].items.length;

             player.favors = [];
             for (var i=0; i< this.game.favorsCollection[playerId].items.length; i++) {
                 var favorIdx = parseInt(this.game.favorsCollection[playerId].items[i].id.split("_")[2]);
                 player.favors.push(parseInt(this.gamedatas.favor_tiles[favorIdx].favor_type));
             }
             player.ressources.power1 = this.game.power1Supply[playerId].items.length;
             player.ressources.power2 = this.game.power2Supply[playerId].items.length;
             player.ressources.power3 = this.game.power3Supply[playerId].items.length;

             player.ressources.priests = this.game.priestsCollection[playerId].items.length;
             player.supply.priests = this.game.priestSupply[playerId].items.length;

             // calculate the number of priest in cult
             player.priests_in_cult = 0;
             for (var priestIdx in this.gamedatas.priests) {
                 var priest = this.gamedatas.priests[priestIdx];
                 if (priest.player_id == playerId && priest.cos_id != null) {
                     player.priests_in_cult += 1;
                 }
             }
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
            var menuHtml = "<div id='TMP_menu_list_toggle_" + playerId + "' class='toggle_container'>";
            menuHtml += "<a href='javascript:void(0)' class='collapser TMP_hidden' data-target='#TMP_menu_content_" + playerId + "'>-P</a>";
            menuHtml += "<a href='javascript:void(0)' class='expander' data-target='#TMP_menu_content_" + playerId + "'>+P</a>";
            menuHtml += "</div>";
            this.dojo.place(menuHtml, "player_name_" + playerId, "first");
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
    },

    // add income information directly on player panel
    renderPlayerScore: function() {
        if (this.score == 0)
            return;
        for (var playerId in this.players) {

            // add new income info
            this.dojo.place("<span id='player_final_score_"+ playerId + "'> (0)</span>", "player_score_" + playerId, "after");
        }
    },

    // render planner menu for each players
    renderPlayerPlannerMenu: function(playerId) {
        var player = this.players[playerId];
        if (this.dojo.exists('TMP_menu_content_' + playerId) || !this.playerHasFaction(player)) {
            return;
        }

        var extraClass = player.expanded ? '' : ' TMP_hidden';
        this.dojo.place("<div class='menu_content" + extraClass +"' id='TMP_menu_content_" + playerId + "'></div>", "player_board_" + playerId, "last");

        var menuHtml = "<div id='divPlanning_" + playerId + "' >";
        menuHtml += "<div class='TMPtab'>"
        for (var i=1; i <= 6; i++) {
            menuHtml += "<button class='TMPtablinks' id='radio_" + i + "_" + playerId + "'>R" + i + "</button>";
        }
        menuHtml += "</div>"

        for (var j=1; j <= 6; j++) {
            menuHtml += "<div id='tab_" + j + "_" + playerId + "' class='TMPtabcontent'>";
            menuHtml += "<table>";
            var faction = this.factions[player.faction];
            for (var actionIdx in faction) {
                var action = faction[actionIdx];
                var actName = action.name;
                var limit = 15;
                if (this.score != 0 || actName != "Town") {
                    menuHtml += "<tr id='select_line_" + j + "_" + playerId + "_" + actionIdx + "'>";
                    menuHtml += "<td style='padding-top: 3px'>" + actName + ":</td>";
                    menuHtml += "<td style='padding-left: 10px; padding-top: 3px'><input type='number' class='select_TMP' value='0' min='0' max='" + limit + "' id='select_" + j + "_" + playerId + "_" + actionIdx + "' style='width: 3em'>";
                    menuHtml += "</select></td></tr>";
                }
            }
            menuHtml += "</table>";
            menuHtml += "<p></p>";
            menuHtml += "<table>";
            menuHtml += "<tr><td style='padding-top: 5px'><u>Needs:</u></td></tr>";
            menuHtml += "<tr><td style='position: relative; top: -2px'>";
            menuHtml += "<label id='workerCount_" + j + "_" + playerId + "' style='position: relative; left: 8px; top: 6px'>0</label><div class='workers_collection ttworkers' style='position: relative; top: 10px; left: 10px; width: 21px; height: 21px; background-size: 364px 42px; background-position: -21px 0px'></div>";
            menuHtml += "<label id='coinCount_" + j + "_" + playerId + "' style='padding-left: 15px; position: relative; top: 6px'>0</label><div class='coins_icon tm_panel_icon ttcoins' style='position: relative; top: 10px; left: 10px'></div>";

            var priestStyle = "<position: relative; background-size: 351px 450px; background-repeat: no-repeat; background-position: -301px -281px; width: 51px; height: 51px;";
            var priestElem = document.getElementById("priests_collection_" + playerId);
            if (!isObjectEmpty(priestElem)) {
                priestStyle = priestElem.getAttribute('style');
            }
            menuHtml += "<label id='priestCount_" + j + "_" + playerId + "' style='padding-left: 2px; position: relative; left: 12px; top: 6px'>0</label><div class='priests_collection ttpriests' style='" + priestStyle + "'></div>";
            menuHtml += "</td></tr>";
            menuHtml += "</table>";
            if (this.score != 0) {
                menuHtml += "<p></p>";
                menuHtml += "<div  id='expectedScore_" + j + "_" + playerId + "'>";
                menuHtml += "<label><u>Scoring:</u> +</label>";
                menuHtml += "<label id='scoreLabel_" + j + "_" + playerId + "'>0</label>";
                menuHtml += "<i class='fa fa-star'></i></div>";
                menuHtml += "<br><label style='color:red' id='errorLabel_" + j + "_" + playerId + "'></label>";
                menuHtml += "</div>";
            }
        }
        this.dojo.place(menuHtml, "TMP_menu_content_" + playerId, "only");

        var selects_tmp = this.dojo.query(".select_TMP", "TMP_menu_content_" + playerId);
        for (var k=0; k < selects_tmp.length; k++) {
            this.dojo.connect(selects_tmp[k], "onchange", this, "computeResourcesNeeded");
        }

        for (var r=1; r <= 6; r++) {
            this.dojo.connect(document.getElementById("radio_" + r + "_"+ playerId), "onclick", this, "radioRoundSelected");
        }

        // retrieve existing planned actions stored in local storage
        var selectedRoundId = window.localStorage.getItem("TMPlanner_" + this.game.table_id + "_" + playerId + "_plannedround");
        if (selectedRoundId != null && selectedRoundId != "") {
            this.radioRoundSelected({"target": document.getElementById(selectedRoundId)});
        } else {
            var round = (!isObjectEmpty(this.current_turn) ? this.current_turn : 1);
            this.radioRoundSelected({"target": document.getElementById("radio_" + round + "_"+ playerId)});
        }

        for (var l=1; l <= 6; l++) {
            var storedAction = this.retrievePlannedActionsForPlayer(playerId, l);
            if (!isObjectEmpty(storedAction)) {
                for (var actIdx in storedAction) {
                    var elem = document.getElementById("select_" + l + "_" + playerId + "_" + actIdx);
                    elem.value = storedAction[actIdx];
                    this.computeResourcesNeeded({"target": elem});
                }
            }
        }
    },

    getActionLimit: function(player, actionIdx) {
        var faction = this.factions[player.faction];
        var action = faction[actionIdx];
        var limit = 15;
        if (action.hasOwnProperty("limit")) {
            limit = parseInt(action.limit);
        }
        if (player.supply.hasOwnProperty(actionIdx)) {
            limit = parseInt(player.supply[actionIdx]);
        }
        if (player.built_structures.hasOwnProperty(actionIdx)) {
            limit -= parseInt(player.built_structures[actionIdx]);
        }
        if (actionIdx == "temple" || actionIdx == "tradinghouse" || actionIdx == "dwelling") {
            limit -= parseInt(player.built_structures.sanctuary);
        }
        if (actionIdx == "tradinghouse" || actionIdx == "dwelling") {
            limit -= parseInt(player.built_structures.temple);
            limit -= parseInt(player.built_structures.stronghold);
        }
        if (actionIdx == "dwelling") {
            limit -= parseInt(player.built_structures.tradinghouse);
        }

        // hide action of some structure are built (e.g. hide 2W tunneling if dwarve stronghold is built)
        if (action.hasOwnProperty("hide_with_structure")) {
            if (parseInt(player.built_structures[action.hide_with_structure]) >= parseInt(action.hide_with_number)) {
                limit = 0;
            }
        }
        if (action.hasOwnProperty("hide_with_no_structure")) {
            if (parseInt(player.built_structures[action.hide_with_no_structure]) == 0) {
                limit = 0;
            }
        }

        return limit;
    },

    updatePlayerPlannerMenu: function() {
        for (var playerId in this.players) {
            this.renderPlayerPlannerMenu(playerId);
            var player = this.players[playerId];

            // do nothing yet if players have no faction selected
            if (!this.playerHasFaction(player)) {
                return;
            }

            var faction = this.factions[player.faction];
            for (var actionIdx in faction) {
                var action = faction[actionIdx];
                var actName = action.name;
                var limit = this.getActionLimit(player, actionIdx);

                if(!player.actions_limit.hasOwnProperty(actionIdx) || player.actions_limit[actionIdx] != limit) {
                    player.actions_limit[actionIdx] = limit;
                    for (var r=1; r<= 6; r++) {
                        var elem = document.getElementById("select_" + r + "_" + playerId + "_" + actionIdx);
                        if (isObjectEmpty(elem)) {
                            return;
                        }
                        elem.setAttribute("max", limit);
                        if (parseInt(elem.value) > limit) {
                            elem.value = limit;
                        }
                        var elemLine = document.getElementById("select_line_" + r + "_" + playerId + "_" + actionIdx);
                        if (limit <= 0) {
                            elemLine.setAttribute("class", "TMP_hidden");
                        } else {
                           elemLine.className = elemLine.className.replace('TMP_hidden','');
                        }
                    }
                }
            }
        }
    },

    // Toggle hide / show of any visual element given data-target
    toggleCollapserExpander: function(event) {
        var dataTarget = event.target.getAttribute('data-target');
        this.dojo.query(".collapser, .expander", event.target.parentNode).toggleClass("TMP_hidden");
        this.dojo.query(dataTarget).toggleClass("TMP_hidden");

        var arr = dataTarget.split("_");
        var playerId = arr[arr.length - 1];
        this.players[playerId].expanded = !this.players[playerId].expanded;
        this.renderPlayerPlannerMenu(playerId);
    },

    playerHasFaction : function(player) {
        return player.faction != null && this.factions.hasOwnProperty(player.faction);
    },

    getPlannedActions : function(playerId, round) {
        var plannedActions = {};
        var faction = this.factions[this.players[playerId].faction];
        for (var actionIdx in faction) {
            var elem = document.getElementById("select_" + round + "_" + playerId + "_" + actionIdx);
            if (!isObjectEmpty(elem)) {
                var count = parseInt(elem.value);
                if (count > 0) {
                    plannedActions[actionIdx] = count;
                }
            }
        }
        return plannedActions;
    },

    storePlannedActionsForPlayer : function(playerId, round, plannedActions) {
        window.localStorage.setItem("TMPlanner_" + this.game.table_id + "_" + round + "_" + playerId, JSON.stringify(plannedActions));
    },

    retrievePlannedActionsForPlayer : function(playerId, round) {
        var json = window.localStorage.getItem("TMPlanner_" + this.game.table_id + "_" + round + "_" + playerId);
        if (json != null && json != "") {
            return JSON.parse(json);
        }
        return null;
    },

    computeResourcesNeeded : function(event) {
        var selectId = event.target.getAttribute('id');
        var selectSplit = selectId.split("_");
        var round = parseInt(selectSplit[1]);
        var playerId = parseInt(selectSplit[2]);
        var selectActionIdx = selectSplit[3];
        var player = this.players[playerId];

        // do nothing yet if players have no faction selected
        if (!this.playerHasFaction(player)) {
            return;
        }

        // change value if not within range
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        var limit = this.getActionLimit(player, selectActionIdx);
        if (event.target.value > limit) {
            event.target.value = limit;
        }

        var nbWorkers = 0;
        var nbCoins = 0;
        var nbPriests = 0;
        var faction = this.factions[player.faction];
        var plannedActions = this.getPlannedActions(playerId, round);
        for (var actionIdx in plannedActions) {
            var count = plannedActions[actionIdx];
            var action = faction[actionIdx];
            nbWorkers += action.workers*count;
            nbCoins += action.coins*count;
            nbPriests += action.priests*count;
        }
        document.getElementById("workerCount_" + round + "_" + playerId).innerHTML = nbWorkers;
        document.getElementById("coinCount_" + round + "_" + playerId).innerHTML = nbCoins;
        document.getElementById("priestCount_" + round + "_" + playerId).innerHTML = nbPriests;

        this.storePlannedActionsForPlayer(playerId, round, plannedActions);
        this.computeScoring(playerId, round);
        this.computeFinalScore();
    },

    computeArrayScore : function(arr, score_arr, added_score, tooltips, tootlip_name) {
        // sort the array
        var keys = Object.keys(arr);
        var sorted = [];
        for(var i = 0; i < keys.length; i++) {
            sorted.push([keys[i], arr[keys[i]]]);
        }
        sorted.sort(function(first, second) {
            return second[0] - first[0];
        });

        // add to score
        var score_idx = 0;
        for (let i = 0; i < sorted.length && score_idx < 3; i++) {
            var players = sorted[i][1];
            var score = 0;
            for (let j = 0; j < players.length && score_idx < 3; j++) {
                score += score_arr[score_idx];
                ++score_idx;
            }
            score /= players.length;
            for (let j = 0; j < players.length; j++) {
                added_score[players[j]] += Math.floor(score);
                tooltips[players[j]] += Math.floor(score) + "VP for " + tootlip_name + "<br>";
            }
        }
        return added_score;
    },

    computeCurrentRound: function() {
        for( var scoring_id = 1; scoring_id <= 6; scoring_id++ ) {
            if (this.gamedatas.scoring_tiles[scoring_id].scoring_done == 0) {
                return scoring_id;
            }
        }
        return 6;
    },

    computeFinalScore : function() {
        if (this.score == 0)
        return;

        var cult_types = ["fire", "water", "earth", "air"];
        var cults = {
            "fire": {},
            "water": {},
            "earth": {},
            "air": {}
        };
        var cult_score = [8, 4, 2];

        var network = {};
        var network_score = [18, 12, 6];

        var fi = {};

        var added_score = {};
        var tooltips = {};
        var round = this.computeCurrentRound();

        // collect player data
        for (var playerId in this.players) {
             var player = this.players[playerId];

            for (var cultIdx in cult_types) {
                var cult = cult_types[cultIdx];
                var cult_point = parseInt(this.gamedatas.players[playerId]['player_' + cult + 'cult']);
                if (cult_point > 0) {
                    if (cults[cult].hasOwnProperty (cult_point)) {
                        cults[cult][cult_point].push(playerId);
                    } else {
                        cults[cult][cult_point] = [playerId];
                    }
                }
            }

            var structure_count = parseInt(this.gamedatas.counters["structures_count_" + playerId].counter_value);
            if (structure_count > 0) {
                if (network.hasOwnProperty (structure_count)) {
                    network[structure_count].push(playerId);
                } else {
                    network[structure_count] = [playerId];
                }
            }

            if (this.gamedatas.counters.hasOwnProperty("fire_ice_scoring_count_" + playerId)) {
                var fi_count = parseInt(this.gamedatas.counters["fire_ice_scoring_count_" + playerId].counter_value);
                if (fi_count > 0) {
                    if (fi.hasOwnProperty (fi_count)) {
                        fi[fi_count].push(playerId);
                    } else {
                        fi[fi_count] = [playerId];
                    }
                }
            }

            added_score[playerId] = parseInt(document.getElementById("player_score_" + playerId).innerHTML);
            tooltips[playerId] = "";

            if (!this.playerPassed(playerId) || round < 6) {
                var scoreInfo = this.computeScoringInternal(playerId, round);
                added_score[playerId] += scoreInfo[0];
                tooltips[playerId] = scoreInfo[2];
            }
        }

        // compute cult score
        for (var cultIdx in cult_types) {
            var cult = cult_types[cultIdx];
            added_score = this.computeArrayScore(cults[cult], cult_score, added_score, tooltips, cult + " cult");
        }

        // compute network score
        added_score = this.computeArrayScore(network, network_score, added_score, tooltips, "network");

        // compute F&I score
        if (Object.keys(fi).length > 0) {
            added_score = this.computeArrayScore(fi, network_score, added_score, tooltips, "F&I scoring");
        }

        for (var playerId in added_score) {
            document.getElementById("player_final_score_" + playerId).innerHTML = " (" + added_score[playerId] + ")";
            this.game.addTooltipHtml("player_final_score_" + playerId, "Calculated final score: " + "<br>" + tooltips[playerId]);
        }
    },

    radioRoundSelected : function(event) {
        if(isObjectEmpty(event.target)) {
            return;
        }
        var radioId = event.target.getAttribute('id');
        var split = radioId.split("_");
        var round = parseInt(split[1]);
        var playerId = split[2];

        var i, tabcontent, tablinks;
        tabcontent = event.target.parentElement.parentElement.getElementsByClassName("TMPtabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = event.target.parentElement.getElementsByClassName("TMPtablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById("tab_" + round + "_" + playerId).style.display = "block";
        event.target.className += " active";

        window.localStorage.setItem("TMPlanner_" + this.game.table_id + "_" + playerId + "_plannedround", radioId);
        this.computeScoring(playerId, round);
    },

    playerPassed: function(playerId) {
        var playerPassed = false;
        var playerPassedElem = document.getElementById("fp_container_" + playerId);
        if (!isObjectEmpty(playerPassedElem)) {
            playerPassed = playerPassedElem.classList.contains("fp_container_passed");
        }
        return playerPassed;
    },

    computeFinalScoreForTile: function(tile, plannedActions, buildingsAfterActions) {
        var VPToAdd = 0;
        if (typeof tile === "undefined" || tile == null)
            return VPToAdd;
        for(var idF in tile.building) {
            var building = tile.building[idF];
            var count = 0;
            if (tile.hasOwnProperty("passVP")) {
                count = parseInt(buildingsAfterActions[building]);
                if (Array.isArray(tile.vp)) {
                    if (tile.vp.length > count) {
                        VPToAdd += parseInt(tile.vp[count]);
                    }
                } else {
                    VPToAdd += parseInt(tile.vp)*count;
                }

            } else {
                count = plannedActions[building];
                if (!isObjectEmpty(count)) {
                    VPToAdd += parseInt(tile.vp)*count;
                }
            }
        }
        return VPToAdd;
    },

    computeScoringInternal: function(playerId, round) {

        var VP = 0;
        var errorString = "";
        var detailString = "";
        var player = this.players[playerId];
        let existingBuildings = player.built_structures;
        var buildingsAfterActions = Object.assign({}, existingBuildings);

        // do nothing yet if players have no faction selected
        if (!this.playerHasFaction(player)) {
            return [0, "", ""];
        }

        // compute score for actions
        var faction = this.factions[this.players[playerId].faction];
        var plannedActions = this.getPlannedActions(playerId, round);
        for (var actionIdx in plannedActions) {
            var count = plannedActions[actionIdx];
            var action = faction[actionIdx];
            if(action.hasOwnProperty("vp")) {
                var VPToAdd = 0;
                if (Array.isArray(action.vp)) {
                    var startingPoint = existingBuildings[actionIdx];
                    if (action.vp.length >= (parseInt(startingPoint) + parseInt(count))) {
                        for (var i = 0; i < count; i++) {
                            VPToAdd += parseInt(action.vp[startingPoint]);
                            startingPoint++;
                        }
                    }
                }
                else {
                    VPToAdd = parseInt(action.vp)*count;
                }
                if (VPToAdd > 0) {
                    VP += VPToAdd;
                    detailString += VPToAdd + "VP for \"" + action.name + "\"<br>";
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

        // check if we do not build more that we are allowed to
        for (var idx in buildingsAfterActions) {
            var countAA = buildingsAfterActions[idx];
            if (faction.hasOwnProperty(idx) && countAA > faction[idx].max) {
                var actionName = faction[idx].name;
                errorString += "<u>Warning:</u> not able to build " + plannedActions[idx] + " " + actionName + ", only " + (parseInt(faction[idx].max) - parseInt(this.players[playerId].built_structures[idx])) + " " + actionName + " in the supply. Some " + actionName + " must be upgraded first.<br>";
            }
        }

        // compute score for scoring tile
        var scoringIdx = this.scoring_tiles[round - 1];
        var scoring = TMPscorings[scoringIdx];
        var VPToAddSc = this.computeFinalScoreForTile(scoring, plannedActions, buildingsAfterActions);
        if (VPToAddSc > 0) {
            VP += VPToAddSc;
            detailString += VPToAddSc + "VP for scoring tile \"" + scoring.name + "\"<br>";
        }

        // compute score for bonus tile
        var bonusRound = this.current_turn;
        if (this.playerPassed(playerId)) {
            bonusRound += 1;
        }
        if (bonusRound == round) { // we can not compute bonus tile if plan for next turn and player did not pass yet
            var bonusIdx = this.players[playerId].bonus_card;
            var bonus = TMPboni["1"];
            if (TMPboni.hasOwnProperty(bonusIdx)) {
                bonus = TMPboni[bonusIdx];
            }
            var VPToAddB = this.computeFinalScoreForTile(bonus, plannedActions, buildingsAfterActions);
            if (VPToAddB > 0) {
                VP += VPToAddB;
                detailString += VPToAddB + "VP for bonus tile \"" + bonus.name + "\"<br>";
            }
        }

        // compute score for favors
        for(var favorId in this.players[playerId].favors) {
            var favorIdx = this.players[playerId].favors[favorId];
            if (TMPfavors.hasOwnProperty(favorIdx)) {
                var favor = TMPfavors[favorIdx];
                var VPToAddF = this.computeFinalScoreForTile(favor, plannedActions, buildingsAfterActions);
                if (VPToAddF > 0) {
                    VP += VPToAddF;
                    detailString += VPToAddF + "VP for favor tile \"" + favor.name + "\"<br>";
                }
            }
        }

        if (errorString !== "") {
            errorString = "<br>" + errorString;
        }
        return [VP, errorString, detailString];
    },

    computeScoring: function(playerId, round) {
        if (this.score == 0)
            return;
        var scoreInfo = this.computeScoringInternal(playerId, round);
        document.getElementById("scoreLabel_" + round + "_" + playerId).innerHTML = scoreInfo[0];
        document.getElementById("errorLabel_" + round + "_" + playerId).innerHTML = scoreInfo[1];
        this.game.addTooltipHtml("expectedScore_" + round + "_" + playerId, scoreInfo[2]);
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
            "width: 16%;" +
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

            /* Style the tab content */
            ".TMPtabcontent {" +
            "  display: none;" +
            "  padding: 6px 12px;" +
            "  border: 1px solid #ccc;" +
            "  border-top: none;" +
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

// Everything starts here
window.onload = async function() {
    if (Is_Inside_Game) {
        setTimeout(() => { // Wait for BGA to load dojo and TM scripts
            if (!window.parent || !window.parent.gameui || !window.parent.gameui.game_name ||
                (window.parent.gameui.game_name != "terramystica" && window.parent.gameui.game_name != "terramysticaext")) {
                return;
            }
            waitForTMLoading(() => {
                // Prevent multiple launches
                if (window.parent.isTMPlannerStarted) {
                    return;
                } else {
                    if (Enable_Logging) console.log("TMPlanner activated");
                    window.parent.isTMPlannerStarted = true;
                    window.parent.tmPlanner = TMPlanner.init();
                }
            });
        }, 2000);
    }
};
