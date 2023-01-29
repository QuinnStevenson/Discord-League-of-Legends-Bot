# Overview

This is a Discord bot that can be polled using dicord's chat function to get a quick showcase on all the players in your current League of Legends game.  It will output a title card showing their stats as to you give the user an overview on what to expect with who they are up against.  

It rests on a local NodeJS server that will wait and listen for commands to be sent through text.  A user will type in a command such as: "!user insertPlayerName" which then uses the name to communicate with Riot's public APIs.  So long as the user itself is in a current match or loading in to a match.  Riot's APIs are able to return information on all players in your current match.  From there each player is polled and data is returned to the local server.  It then parses the data in to a visual title card showcasing the data.

## Side Note
In these files you'll find an auth token.  (VERY UNSAFE TO LEAVE ON A PUBLIC SITE).  However it is expired and simply exists to demonstrate how the program itself works.  