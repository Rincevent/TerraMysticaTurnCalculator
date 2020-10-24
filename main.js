var selectedfactionName;
var factions = JSON.parse(`{
  "Alchemists": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Auren": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Chaos magicians": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "4", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Cultists": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "8", "priest": "0", "vp": "7", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],  
  "Darklings": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "10", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade", "worker": "0", "coin": "0", "priest": "1", "vp": "2"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Dwarves": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Tunneling 1W", "worker": "1", "coin": "0", "priest": "0", "vp": "4"},
    {"name": "Tunneling 2W", "worker": "2", "coin": "0", "priest": "0", "vp": "4"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Engineers": [
    {"name": "Dwelling", "worker": "1", "coin": "1", "priest": "0"},
    {"name": "Trading Post", "worker": "1", "coin": "2", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "1", "coin": "4", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "3", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "3", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Fakirs": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "10", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "1"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Carpet flight", "worker": "0", "coin": "0", "priest": "1", "vp": "4"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Giants": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],  
  "Halflings": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "1", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0", "vp": "1"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0", "vp": "1"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0", "vp": "1"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],    
  "Mermaids": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "1", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4", "5"], "limit": "4"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Nomads": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],
  "Swarmlings": [
    {"name": "Dwelling", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Trading Post", "worker": "3", "coin": "4", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "3", "coin": "6", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "5", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "5", "coin": "8", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "limit": "4"}
  ],  
  "Witches": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0", "upgrade": "Dwelling"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4", "upgrade": "Trading Post"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Trading Post"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1", "upgrade": "Temple"},
    {"name": "Upgrade Spade", "worker": "2", "coin": "5", "priest": "1", "vp": "6", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "vp": ["2", "3", "4"], "limit": "3"},
    {"name": "Spade 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Spade 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Spade 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Town", "worker": "0", "coin": "0", "priest": "0", "vp": "5", "limit": "4"}
  ]  
}`);
var boni = JSON.parse(`{
  "None": {"building": [], "vp": "0"},
  "4VP per pass SH/SA": {"building": ["Stronghold", "Sanctuary"], "vp": "4"},
  "2VP per pass TP": {"building": ["Trading Post"], "vp": "2"},
  "1VP per pass Dwelling": {"building": ["Dwelling"], "vp": "1"},
  "3VP per pass Ship": {"building": ["Upgrade Ship"], "vp": "3"}
}`);

var favors = JSON.parse(`{
  "2VP per Dwelling": {"building": ["Dwelling"], "vp": "2"},
  "3VP per Trading Post": {"building": ["Trading Post"], "vp": "3"},
  "2/3/4VP per pass TP": {"building": ["Trading Post"], "vp": ["2", "3", "3", "4"]}
}`);

var scorings = JSON.parse(`{
  "2VP per spade": {"building": ["Spade 1W", "Spade 2W", "Spade 3W", "Spade"], "vp": "2"},
  "5VP per Town": {"building": ["Town"], "vp": "5"},
  "2VP per Dwelling": {"building": ["Dwelling"], "vp": "2"},
  "5VP per SH/SA": {"building": ["Stronghold", "Sanctuary"], "vp": "5"},
  "3VP per Trading Post": {"building": ["Trading Post"], "vp": "3"},
  "4VP per Temple": {"building": ["Temple"], "vp": "4"}
}`);

function init() {
  $.each(factions, function(faction, data){
    $('#selectFactions').append(new Option(faction, faction));
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
    $('#divScoring').append("<td><input id=\"favor-"+favorIdx+"\" type=\"checkbox\" onchange=\"computeScoring()\"><label for=\"favor-"+favorIdx+"\" style=\"font-size:2vh\">"+favor+"</label></td>");
    $('#divScoring').append("</tr>");
    ++favorIdx;
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
  $('#divScoring').append("<td style=\"font-size:2vh\">Existing SH/SA:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectESHSA\" onchange=\"computeScoring()\"></td>");
  for (i = 0; i <= 2; i++) {
    $('#selectESHSA').append(`<option value="${i}">${i}</option>`);
  }
  $('#divScoring').append("</tr>");
  $('#divScoring').append("<tr style=\"font-size:2vh\">");
  $('#divScoring').append("<td style=\"font-size:2vh\">Existing Ship:</td>");
  $('#divScoring').append("<td><select style=\"font-size:2vh\" id=\"selectEShip\" onchange=\"computeScoring()\"></td>");
  for (i = 0; i <= 5; i++) {
    $('#selectEShip').append(`<option value="${i}">${i}</option>`);
  }
  $('#divScoring').append("</tr>");
  $('#divScoring').append("</table></p>");

  $('#divScoring').append("<label style=\"font-size:2vh\"><strong>Expected score: </strong></label>");
  $('#divScoring').append("<label style=\"font-size:2vh\" id=\"scoreLabel\">0</label>");
  $('#divScoring').append("<label style=\"font-size:2vh\">VP</label>");

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