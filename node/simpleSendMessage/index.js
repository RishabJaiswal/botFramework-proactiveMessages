"use strict";

var restify = require('restify');
var builder = require('botbuilder');
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);


function sendProactiveMessage(addr) {
  var msg = new builder.Message().address(addr);
  msg.text('Hello, this is a notification');
  msg.textLocale('en-US');
  bot.send(msg);
}

var savedAddress;
server.post('/api/messages', connector.listen());
server.get('/api/CustomWebApi', () => {
    sendProactiveMessage(savedAddress);
  }
);

bot.dialog('/', function(session, args) {

  savedAddress = session.message.address;

  var message = 'Hello! In a few seconds I\'ll send you a message proactively to demonstrate how bots can initiate messages.';
  session.send(message);
  
  connector.url
  message = 'You can also make me send a message by accessing: ';
  message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
  session.send(message);

  setTimeout(() => {
    sendProactiveMessage(savedAddress);
  }, 5000)
});