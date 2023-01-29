const fetch = require("node-fetch");
const image = require('./Drawing/imageCreation.js');

//Key needs to be replaced every day
var apiKey = '?api_key=RGAPI-066d407f-b237-48a5-86de-9dfa0a067d4f'
var summonerLookup = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
var encrypted = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'
var spectator = 'https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/'
//Global object to eventually be output by the bot
var summoner = {
	name: "temp",
	level: "temp",
	icon: "temp",
	queue: "temp",
	rank: "temp",
	wins: "temp",
	losses: "temp",
	winrate: "temp",
	veteran: "temp",
	inactive: "temp",
}

var summoner1 =
{
	side: "",
	name: "",
	level: "",
	champion: "",
	rank: "",
	division: "",
	position: "",
	wins: "",
	losses: "",
	winrate: "",
	hotsreak: false,
	kda: "",
	gamesPlayed: "",
	summonerID: ""
}

//Carrier for summoners
var data = [];

function returnSummonerJSON() {
	return summoner;
}

function buildQuery(username) {
	var query = summonerLookup + username + apiKey;
	return query;
}

function buildEncrypted(summonerID) {
	var query = encrypted + summonerID + apiKey;
	return query;
}

function buildSpectator(summonerID) {
	var query = spectator + summonerID + apiKey;
	return query;
}

//Picks apart solo stats!
function assessSummoner(summonerJSON, incomingMessage) {
	var index = summonerJSON.findIndex(function(item, i) {
		return item.queueType == 'RANKED_SOLO_5x5';
	})

	summoner.queue = 'Ranked Solo 5v5';
	summoner.rank = summonerJSON[index].tier + " " + summonerJSON[index].rank;
	summoner.wins = summonerJSON[index].wins;
	summoner.losses = summonerJSON[index].losses;
	var winrate = ((summoner.wins / (summoner.wins + summoner.losses)) * 100).toFixed(3);
	summoner.winrate = winrate + "%";
	summoner.veteran = summonerJSON[index].veteran;
	summoner.inactive = summonerJSON[index].inactive;
}

function sendQuery(query, incomingMessage) {
	fetch(query)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Error with query!: " + response.status + " " + response.statusText);
			}
		})
		.then((json) => {
			if(json.hasOwnProperty('id')){
				summoner.name = json.name;
				summoner.icon = json.profileIconId;
				summoner.level = json.summonerLevel;
				sendQuery(buildEncrypted(json.id), incomingMessage);
			}else {
				assessSummoner(json, incomingMessage);	
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

function beginSearch(summonerName, incomingMessage) {
	summonerName = encodeURIComponent(summonerName.trim());
	sendQuery(buildQuery(summonerName), incomingMessage);
}

function currentMatch(summonerName, incomingMessage) {
	summonerName = encodeURIComponent(summonerName.trim());
	getEncryptedID(buildQuery(summonerName), incomingMessage);
}

function getEncryptedID(query, incomingMessage)
{
	fetch(query)
		.then((response) => {
			if(response.ok) return response.json();
			else throw new Error("Error finding current players!: " + response.status + " " + response.statusText);
		})
		.then((json) => {
			findPlayers(buildSpectator(json.id), incomingMessage);
		})
}

function findPlayers(query, incomingMessage) {
	fetch(query)
		.then((response) => {
			if(response.ok) return response.json();
			else throw new Error("Error finding current players!: " + response.status + " " + response.statusText);
		})
		.then((json) => {
			var currentPlayers = [];

			for(var i = 0; i < 10; i++) {
				var player = 
				{
					name: json.participants[i].summonerName,
					champion: json.participants[i].championId,
					teamid: json.participants[i].teamId,
					summonerId: json.participants[i].summonerId
				}

				currentPlayers.push(player);
			}

			return currentPlayers;
		})
		.then((players) => {
			printSummoners(players, incomingMessage);
		})
}

function printSummoners(currentPlayers, incomingMessage)
{
	image.readCurrentPlayers(currentPlayers, incomingMessage);
}

module.exports.currentMatch = currentMatch;
module.exports.beginSearch = beginSearch;
module.exports.assessSummoner = assessSummoner;
module.exports.buildEncrypted = buildEncrypted;
module.exports.buildQuery = buildQuery;
module.exports.sendQuery = sendQuery;
module.exports.returnSummonerJSON = returnSummonerJSON;