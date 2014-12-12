///<reference path="./def/node.d.ts"/>
///<reference path="./def/express.d.ts"/>

import express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.send('hi');
});

app.listen(3000);