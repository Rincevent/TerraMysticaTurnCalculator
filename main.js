var selectedfactionName;
var commonActions = JSON.parse(`{
  "DW": {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0", "max": "8"},
  "TP": {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "DW", "max": "4"},
  "TE": {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "TP", "max": "3"},
  "SH": {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "TP", "max": "1"},
  "SA": {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "TE", "max": "1"},
  "UD": {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
  "US": {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3", "max": "3"},
  "S1": {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
  "S2": {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
  "S3": {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
  "TN": {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
}`);
var factionsOverride = JSON.parse(`{
  "Alchemists": {},
  "Auren": {
    "SA": {"coin": "8"}
  },
  "Chaos magicians": {
    "SH": {"coin": "4"},
    "SA": {"coin": "8"}
  },
  "Cultists": {
    "SH": {"coin": "8"},
    "SA": {"coin": "8"}
  },
  "Darklings": {
    "SA": {"coin": "10"},
    "UD": {"remove": "1"},
    "S1": {"remove": "1"},
    "S2": {"remove": "1"},
    "S3": {"remove": "1"},
    "SP": {"name": "Spade", "worker": "0", "coin": "0", "priest": "1", "vp": "2"}
  },
  "Dwarves": {
    "US": {"remove": "1"},
    "T1": {"name": "Tunneling 1W", "worker": "1", "coin": "0", "priest": "0", "vp": "4"},
    "T2": {"name": "Tunneling 2W", "worker": "2", "coin": "0", "priest": "0", "vp": "4"}
  },
  "Engineers": {
    "DW": {"worker": "1", "coin": "1"},
    "TP": {"worker": "1", "coin": "2"},
    "TE": {"worker": "1", "coin": "4"},
    "SH": {"worker": "3", "coin": "6"},
    "SA": {"worker": "3", "coin": "6"},
    "BR": {"name": "Bridge", "worker": "2", "coin": "0", "priest": "0", "limit": "3"}
  },
  "Fakirs": {
    "SH": {"coin": "10"},
    "US": {"remove": "1"},
    "UD": {"limit": "1"},
    "CF": {"name": "Carpet flight", "worker": "0", "coin": "0", "priest": "1", "vp": "4"}
  },
  "Giants": {},
  "Halflings": {
    "SH": {"coin": "8"},
    "UD": {"coin": "1"},
    "S1": {"vp": "1"},
    "S2": {"vp": "1"},
    "S3": {"vp": "1"}
  },
  "Mermaids": {
    "SA": {"coin": "8"},
    "US": {"vp": ["0", "2", "3", "4", "5"], "limit": "4", "max": "5"}
  },
  "Nomads": {
    "SH": {"coin": "8"}
  },
  "Swarmlings": {
    "DW": {"worker": "2", "coin": "3"},
    "TP": {"worker": "3", "coin": "4"},
    "TE": {"worker": "3", "coin": "6"},
    "SH": {"worker": "5", "coin": "8"},
    "SA": {"worker": "5", "coin": "8"}
  },
  "Witches": {
    "TN": {"vp": "5"}
  }
}`);
var boni = JSON.parse(`{
  "None": {"building": [], "vp": "0"},
  "4VP per pass SH/SA": {"building": ["SH", "SA"], "vp": "4", "passVP": "true"},
  "2VP per pass TP": {"building": ["TP"], "vp": "2", "passVP": "true"},
  "1VP per pass Dwelling": {"building": ["DW"], "vp": "1", "passVP": "true"},
  "3VP per pass Ship": {"building": ["US"], "vp": "3", "passVP": "true"}
}`);

var favors = JSON.parse(`{
  "2VP per Dwelling": {"building": ["DW"], "vp": "2"},
  "3VP per Trading Post": {"building": ["TP"], "vp": "3"},
  "2/3/4VP per pass TP": {"building": ["TP"], "vp": ["0", "2", "3", "3", "4"], "passVP": "true"}
}`);

var scorings = JSON.parse(`{
  "2VP per spade": {"building": ["S1", "S2", "S3", "SP"], "vp": "2"},
  "5VP per Town": {"building": ["TN"], "vp": "5"},
  "2VP per Dwelling": {"building": ["DW"], "vp": "2"},
  "5VP per SH/SA": {"building": ["SH", "SA"], "vp": "5"},
  "3VP per Trading Post": {"building": ["TP"], "vp": "3"},
  "4VP per Temple": {"building": ["TE"], "vp": "4"}
}`);

var factions = {};

function init() {
  buildFaction();
  $.each(factions, function(faction, data){
    $('#selectFactions').append(new Option(faction, faction));
  });
  populateFaction();
}

function buildFaction() {
  $.each(factionsOverride, function(faction, overrides){
    factions[faction] = {};
    $.each(commonActions, function(action, data){
      factions[faction][action] = {};
      $.each(data, function(key, value){
        factions[faction][action][key] = value;
      });
    });
    $.each(overrides, function(action, data){
      $.each(data, function(key, value){
        if (key == "remove") {
          delete factions[faction][action];
        } else {
          if(!factions[faction].hasOwnProperty(action)){
            factions[faction][action] = {};
          }
          factions[faction][action][key] = value;
        }
      });
    });
  });
}

function populateFaction() {
  selectedfactionName = document.getElementById("selectFactions").value;
  var actions = factions[selectedfactionName];
  $("#divFaction").empty();
  $('#divFaction').append("<p></p>");
  $('#divFaction').append("<button id=\"buttonPlanning\" class=\"accordion\" onclick=\"toggleAccordion(this)\"><strong>Round plan</strong></button>");
  $('#divFaction').append("<div id=\"divPlanning\" class=\"panel\">");
  $('#divPlanning').append("<p><table>");
  $.each(actions, function(idx, action){
    var actName = action["name"];
    var max = 15;
    if(action.hasOwnProperty("limit")){
      max = action["limit"];
    }

    $('#divPlanning').append("<tr style=\"font-size:2vh\">");
    $('#divPlanning').append("<td style=\"font-size:2vh\">" + actName + ":</td>");
    $('#divPlanning').append("<td><select style=\"font-size:2vh\" id=\""+idx+"\" onchange=\"computeRessources()\"></td>");
    for (i = 0; i <= max; i++) {
      $('#'+idx).append(`<option value="${i}">${i}</option>`);
    }
    $('#divPlanning').append("</tr>");
  });
  $('#divPlanning').append("</table></p>");

  $('#divPlanning').append("<p><table>");
  $('#divPlanning').append("<tr style=\"font-size:2vh\"><td><strong>Resources needed:</strong></td></tr>");
  $('#divPlanning').append("<tr style=\"font-size:2vh\">");
  $('#divPlanning').append("<td style=\"font-size:2vh\"><label id=\"workerCount\">0</label> Worker(s), <label id=\"coinCount\">0</label> Coin(s), <label id=\"priestCount\">0</label> Priest(s)</td>");
  $('#divPlanning').append("</tr>");
  $('#divPlanning').append("</table></p>");

  $('#divFaction').append("<p></p>");
  $('#divFaction').append("<button class=\"accordion\" onclick=\"toggleAccordion(this)\"><strong>Scoring</strong></button>");
  $('#divFaction').append("<div id=\"divScoring\" class=\"panel\">");
  $('#divScoring').append("<p><table>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Scoring tile:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectScoring\" onchange=\"computeScoring()\"></td>");
  $.each(scorings, function(scoring, data){
    $('#selectScoring').append(new Option(scoring, scoring));
  });
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Bonus tile:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectBonus\" onchange=\"computeScoring()\"></td>");
  $.each(boni, function(bonus, data){
    $('#selectBonus').append(new Option(bonus, bonus));
  });
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Favor tiles:</td>");

  var favorIdx = 0;
  $.each(favors, function(favor, data){
    if (favorIdx > 0) {
      $('#divScoring').append("<tr style=\"font-size:2vh\">");
      $('#divScoring').append("<td></td>");
    }
    $('#divScoring').append("<td><input id=\""+favor+"\" type=\"checkbox\" onchange=\"computeScoring()\"><label for=\""+favor+"\" style=\"font-size:2vh\">"+favor+"</label></td>");
    $('#divScoring').append("</tr>");
    favorIdx++;
  });
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Existing Dwelling:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectEDwelling\" onchange=\"computeScoring()\"></td>");
  for (i = 0; i <= 8; i++) {
    $('#selectEDwelling').append(`<option value="${i}">${i}</option>`);
  }
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Existing Trading Post:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectETP\" onchange=\"computeScoring()\"></td>");
  for (i = 0; i <= 4; i++) {
    $('#selectETP').append(`<option value="${i}">${i}</option>`);
  }
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td><label for=\"checkboxESH\" style=\"font-size:2vh\">Existing SH: </label></td><td><input id=\"checkboxESH\" type=\"checkbox\" onchange=\"computeScoring()\"></td>");
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td><label for=\"checkboxESA\" style=\"font-size:2vh\">Existing SA: </label></td><td><input id=\"checkboxESA\" type=\"checkbox\" onchange=\"computeScoring()\"></td>");
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Existing Ship:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectEShip\" onchange=\"computeScoring()\"></td>");
  for (i = 0; i <= 5; i++) {
    $('#selectEShip').append(`<option value="${i}">${i}</option>`);
  }
  $('#divScoring').append("</tr>");
  $('#divScoring').append("</table></p>");
  $('#divScoring').append("<label style=\"font-size:2vh\"><strong>Expected VP: </strong></label>");
  $('#divScoring').append("<label style=\"font-size:2vh\" id=\"scoreLabel\">0</label>");
  $('#divScoring').append("<br><label style=\"font-size:1.5vh\">Details: </label>");
  $('#divScoring').append("<label style=\"font-size:1.5vh\" id=\"detailLabel\"></label>");
  $('#divScoring').append("<br><label style=\"color:red;font-size:2vh\" id=\"errorLabel\"></label>");

  toggleAccordion(document.getElementById("buttonPlanning"));
}

function computeRessources() {
  var actions = factions[selectedfactionName];  
  var nbWorkers = 0;
  var nbCoins = 0;
  var nbPriests = 0;
  $.each(actions, function(idx, action){  
    var count = document.getElementById(idx).value;
    if (count>0){
      nbWorkers += action["worker"]*count;
      nbCoins += action["coin"]*count;
      nbPriests += action["priest"]*count;
    }
  });  
  $('#workerCount').text(nbWorkers);
  $('#coinCount').text(nbCoins);
  $('#priestCount').text(nbPriests);
  computeScoring();
}

function computeScoring() {
  var VP = 0;
  var errorString = "";
  var detailString = "";
  let existingBuildings = {
    DW : parseInt(document.getElementById("selectEDwelling").value),
    TP : parseInt(document.getElementById("selectETP").value),
    SH : (document.getElementById("checkboxESH").checked ? 1 : 0),
    SA : (document.getElementById("checkboxESA").checked ? 1 : 0),
    US : parseInt(document.getElementById("selectEShip").value)
  };
  var buildingsAfterActions = Object.assign({}, existingBuildings);

  // compute score for actions
  var actions = factions[selectedfactionName];
  $.each(actions, function(idx, action) {
    var count = parseInt(document.getElementById(idx).value);
    if (count > 0) {
      if(action.hasOwnProperty("vp")) {
        if (Array.isArray(action["vp"])) {
          var startingPoint = existingBuildings[idx];
          if (action["vp"].length >= (parseInt(startingPoint) + parseInt(count))) {
            var VPToAdd = 0;
            for (i = 0; i < count; i++) {
              VPToAdd += parseInt(action["vp"][startingPoint]);
              startingPoint++;
            }
            VP += VPToAdd;
            if (detailString !== "") {
              detailString += " + ";
            }
            detailString += VPToAdd + "VP for \"" + action["name"] + "\"";
          }
        }
        else {
          var VPToAdd = parseInt(action["vp"])*count;
          VP += VPToAdd;
          if (detailString !== "") {
            detailString += " + ";
          }
          detailString += VPToAdd + "VP for \"" + action["name"] + "\"";
        }
      }
      if (buildingsAfterActions.hasOwnProperty(idx)){
        buildingsAfterActions[idx] += count;
      }
      if(action.hasOwnProperty("upgrade")){
        var upgradeFrom = action["upgrade"];
        if (buildingsAfterActions.hasOwnProperty(upgradeFrom)){
          buildingsAfterActions[upgradeFrom] -= count;
          if (buildingsAfterActions[upgradeFrom] < 0) {
            errorString += "Error: not enough " + actions[upgradeFrom]["name"] + " to upgrade from to perfom " + count + "X " + action["name"] + ". ";
          }
        }
      }
    }
  });

  // check if we do not build more that we are allowed to
  $.each(buildingsAfterActions, function(idx, count) {
    if (count > actions[idx].max) {
      var actionName = actions[idx].name;
      errorString += "Error: not able to perform " + count + "X " + actionName + ", the maximum number of " + actionName + " is " + actions[idx].max + ". ";}
  });

  // compute score for scoring tile
  var scoringName = document.getElementById("selectScoring").value;
  var scoring = scorings[scoringName];
  var VPToAdd = 0;
  $.each(scoring.building, function(id, building) {
    var elem = document.getElementById(building);
    if (elem) {
      var count = parseInt(elem.value);
      VPToAdd += parseInt(scoring.vp)*count;
    }
  });
  if (VPToAdd > 0) {
    VP += VPToAdd;
    if (detailString !== "") {
      detailString += " + ";
    }
    detailString += VPToAdd + "VP for scoring tile \"" + scoringName + "\"";
  }

  // compute score for bonus tile
  var bonusName = document.getElementById("selectBonus").value;
  var bonus = boni[bonusName];
  var VPToAdd = 0;
  $.each(bonus.building, function(id, building) {
      var count = parseInt(buildingsAfterActions[building]);
      VPToAdd += parseInt(bonus.vp)*count;
  });
  if (VPToAdd > 0) {
    VP += VPToAdd;
    if (detailString !== "") {
      detailString += " + ";
    }
    detailString += VPToAdd + "VP for bonus tile \"" + bonusName + "\"";
  }

  // compute score for favors
  $.each(favors, function(favor, data) {
    if (document.getElementById(favor).checked) {
      var VPToAdd = 0;
      $.each(data.building, function(id, building) {
        if (data.hasOwnProperty("passVP")) {
          var count = parseInt(buildingsAfterActions[building]);
          if (data.vp.length > count) {
            VPToAdd += parseInt(data.vp[count]);
          }
        } else {
          var elem = document.getElementById(building);
          if (elem) {
            var count = parseInt(elem.value);
            VPToAdd += parseInt(data.vp)*count;
          }
        }
      });
      if (VPToAdd > 0) {
        VP += VPToAdd;
        if (detailString !== "") {
          detailString += " + ";
        }
        detailString += VPToAdd + "VP for favor tile \"" + favor + "\"";
      }
    }
  });

  $('#scoreLabel').text(VP);
  $('#errorLabel').text(errorString)
  $('#detailLabel').text(detailString)
}

function toggleAccordion(e) {
  e.classList.toggle("active");
  var panel = e.nextElementSibling;
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
}