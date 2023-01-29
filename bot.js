const Discord = require('discord.js');
const auth = require('./auth.json');
const query = require('./query.js');
const server = require('./Drawing/server.js');
const image = require('./Drawing/imageCreation.js');

const bot = new Discord.Client();

//Skeleton object for summoner data.  This needs to be populated from the riot api, then pushed to fill html elements
var summoner =
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

for(var i=0; i<10; i++) {
	data.push(summoner);
}

bot.on('ready', () => {
	console.log("Connected as " + bot.user.tag);
});

bot.login('NjM4ODMyMjU0NTIwNTI0ODAw.Xbidyg.poJxG78rsM8dX-iFy-g8qvHnC-o');

bot.on('message', (incomingMessage) => {
	//Listens for messages starting with !
	if(incomingMessage.author == bot.user) {
		return;
	}

	var command = incomingMessage.content.replace(/ .*/, '');

	switch(command) {
		case "!HOPE":
			console.log("Received HOPE!");
			hopeCommand(incomingMessage);
			break;
		case "!user":
			console.log("Searching for Summoner");
			userCommand(incomingMessage);
			break;
		case "!matt":
			console.log("Received Matt!");
			mattCommand(incomingMessage);
			break;
		case "!current":
			console.log("Received Current Game Command!");
			currentCommand(incomingMessage, data);
			break;
	}
});

function incomingImage(incomingMessage)
{
	console.log("Image is now prepared to send to Discord!");
	incomingMessage.channel.send("Here's your current game!", {files: ["./test.png"]});
}

function currentCommand(incomingMessage) {
	var message = incomingMessage.content.replace(/!current /g, '');
	query.currentMatch(message, incomingMessage);
}

function mattCommand(incomingMessage) {
	incomingMessage.channel.send("is GAY!");
}

function hopeCommand(incomingMessage) {
	incomingMessage.channel.send("RIDES ALONE!");
}

function sendUser(incomingMessage) {
	var readable = JSON.stringify(summoner, null, 1);
	console.log(readable);
	incomingMessage.channel.send(readable);
}

function userCommand(incomingMessage) {
	var message = incomingMessage.content.replace(/!user /g, '');
	console.log(message);
	//query.beginSearch(message, incomingMessage);

 	//let promise = new Promise((resolve, reject) => {
  	//	setTimeout(() => resolve("done!"), 2000)
 	//});

	//let result = await promise;

	//summoner = query.returnSummonerJSON();
	//sendUser(incomingMessage);
}

module.exports.incomingImage = incomingImage;