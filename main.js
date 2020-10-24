var selectedfactionName;
var factions = JSON.parse(`{
  "Alchemists": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],
  "Auren": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],
  "Chaos magicians": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "4", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],
  "Cultists": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],  
  "Darklings": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "10", "priest": "0", "limit": "1"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig", "worker": "0", "coin": "0", "priest": "1"}
  ],
  "Dwarves": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Tunneling 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Tunneling 2W", "worker": "2", "coin": "0", "priest": "0"}
  ],
  "Engineers": [
    {"name": "Dwelling", "worker": "1", "coin": "1", "priest": "0"},
    {"name": "Trading Post", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Temple", "worker": "1", "coin": "4", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "3", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "3", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],
  "Fakirs": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "10", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "1"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"},
    {"name": "Carpet flight", "worker": "0", "coin": "0", "priest": "1"}
  ],
  "Giants": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],  
  "Halflings": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "1", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],    
  "Mermaids": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "1", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "4"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],
  "Nomads": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],
  "Swarmlings": [
    {"name": "Dwelling", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Trading Post", "worker": "3", "coin": "4", "priest": "0"},
    {"name": "Temple", "worker": "3", "coin": "6", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "5", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "5", "coin": "8", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ],  
  "Witches": [
    {"name": "Dwelling", "worker": "1", "coin": "2", "priest": "0"},
    {"name": "Trading Post", "worker": "2", "coin": "3", "priest": "0"},
    {"name": "Temple", "worker": "2", "coin": "5", "priest": "0", "limit": "4"},
    {"name": "Stronghold", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Sanctuary", "worker": "4", "coin": "6", "priest": "0", "limit": "1"},
    {"name": "Upgrade Dig", "worker": "2", "coin": "5", "priest": "1", "limit": "2"},
    {"name": "Upgrade Ship", "worker": "0", "coin": "4", "priest": "1", "limit": "3"},
    {"name": "Dig 1W", "worker": "1", "coin": "0", "priest": "0"},
    {"name": "Dig 2W", "worker": "2", "coin": "0", "priest": "0"},
    {"name": "Dig 3W", "worker": "3", "coin": "0", "priest": "0"}
  ]  
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
  $('#divFaction').append("<p style=\"font-size:2vh\">Your plan for this turn:</p>");
  $('#divFaction').append("<table>");
  $.each(actions, function(idx, action){
    var actName = action["name"];
    var max = 15;
    if(action.hasOwnProperty("limit")){
      max = action["limit"];
    }

    $('#divFaction').append("<tr style=\"font-size:2vh\">");
    $('#divFaction').append("<th>" + actName + ":</th>");
    $('#divFaction').append("<th><select style=\"font-size:2vh\" id=\""+idx+"\" onchange=\"computeRessources()\"></th>");
    for (i = 0; i <= max; i++) {
        $('#'+idx).append(`<option value="${i}">${i}</option>`);
    }
    $('#divFaction').append("</tr>");
  });
  $('#divFaction').append("</table>");
  $('#divFaction').append("<p style=\"font-size:2vh\"><strong>Ressources needed:</strong> <label id=\"workerCount\">0</label> workers, <label id=\"coinCount\">0</label> coins, <label id=\"priestCount\">0</label> priests</p>");

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
}