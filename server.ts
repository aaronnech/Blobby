///<reference path="./def/node.d.ts"/>
///<reference path="./def/express.d.ts"/>


import Blobby = require('./server/Blobby');

var express = require('express');
var app = require('express')();
app.use(express.static(__dirname + '/client'));
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// create game
var game : Blobby = new Blobby(io);

server.listen(3000);

var ONE_FRAME_TIME = 1000 / 60 ;
var loop = function() {
    game.update();
};
setInterval(loop, ONE_FRAME_TIME);