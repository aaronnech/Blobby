///<reference path="./def/node.d.ts"/>
///<reference path="./def/express.d.ts"/>

import express = require('express');
import sockets = require('socket.io');
import http = require('http');

import Blobby = require('./server/Blobby');

// Create app and server static
var app = express();
app.use(express.static(__dirname + '/client'));

var server = http.createServer(app).listen(3000);

// create game
var game : Blobby = new Blobby(sockets.listen(server));

var ONE_FRAME_TIME = 1000 / 60 ;
var loop = function() {
    game.update();
};
setInterval(loop, ONE_FRAME_TIME);