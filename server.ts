///<reference path="./def/node.d.ts"/>
///<reference path="./def/express.d.ts"/>

import express = require('express');
import sockets = require('socket.io');
import http = require('http');

import Blobby = require('./server/Blobby');

// Create app and server static
var app = express();
app.use(express.static(__dirname + '/client'));

var server = new http.createServer(app).listen(3000);

// create game
var game = new Blobby(sockets.listen(server));