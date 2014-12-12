///<reference path="./def/node.d.ts"/>
///<reference path="./def/express.d.ts"/>

import express = require('express');

var app = express();

app.use(express.static(__dirname + '/client'));

app.listen(3000);