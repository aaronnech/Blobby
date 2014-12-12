///<reference path='def/node.d.ts' />
///<reference path='def/express.d.ts' />

import http = require("http")
import path = require("path")
import express = require("express")

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.static(path.join(__dirname, 'client')));
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});