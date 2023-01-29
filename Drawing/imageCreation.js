const webshot = require('webshot');
const bot = require('../bot.js');
const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;


//Takes a screencapture of the current game data
function captureScreen(incomingMessage) {
	var options = 
	{
		shotSize: {
			width: 1606,
			height: 720
		},
		shotOffset: {
			left: 8,
			top: 8
		}
	}

	webshot("http://localhost:3000/image", "test.png", options, function(err) {
		bot.incomingImage(incomingMessage);
	});
}

//Writes the current DOM to a new html file, required to screencap without the use of a browser
function writeHTML(dom, incomingMessage) {
	fs.writeFile('Drawing/image.html', dom.serialize(), function(err) {
		if(err) throw err;
		console.log("Saved new HTML file!");
		captureScreen(incomingMessage);
	});
}

//Edits the html template for the current game, filling it with data pulled from the Riot API
function editCurrentDOM(incomingMessage, dom, data) {	
	fs.readFile('Drawing/Parse/championIds.json', (err, championIds) => {
		if(err) throw err;
		championIds = JSON.parse(championIds);
		for(var index in data) {
			var currentChampion = championIds[data[index].champion]
			var championSquareDir = "Images/Link/img/champion/tiles/" + currentChampion + "_0.jpg";

			//leftPlayerChampion0, src=
			if(data[index].teamid == 100) {
				var domId = "leftPlayerChampion" + index;
				var domName = "leftPlayer" + index;
				dom.window.document.getElementById(domId).src = championSquareDir;
				dom.window.document.getElementById(domName).innerHTML = data[index].name;
			}else {
				var domId = "rightPlayerChampion" + (index - 5);
				var domName = "rightPlayer" + (index - 5);
				dom.window.document.getElementById(domId).src = championSquareDir;
				dom.window.document.getElementById(domName).innerHTML = data[index].name;
			}
		}

		writeHTML(dom, incomingMessage);
	});
}

//Fetches the image.html file from the local server in which will be loaded virtually and edited
function checkDOM(incomingMessage, data) {
	fetch('http://localhost:3000/')
		.then((response) => {
			if (response.ok) {
				return response;
			} else {
				throw new Error("Error with query!: " + response.status + " " + response.statusText);
			}
		})
		.then((json) => {
			var dom = JSDOM.fromURL("http://localhost:3000/", {runscripts: "dangerously", pretendToBeVisual: true}).then(dom => {
				editCurrentDOM(incomingMessage, dom, data);
			});
		})
		.catch((error) => {
			console.log(error);
		});
}

function next(incomingMessage) {
	bot.incomingImage(incomingMessage);
}

//Currently begins the process of editing DOM.  However currently more data is required for each player
function readCurrentPlayers(currentPlayers, incomingMessage) {
	checkDOM(incomingMessage, currentPlayers);
}

module.exports.readCurrentPlayers = readCurrentPlayers;
module.exports.captureScreen = captureScreen;
module.exports.checkDOM = checkDOM;