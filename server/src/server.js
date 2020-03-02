#!/usr/bin/node

const express = require('express');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = 8080;

app.get('/', (req,res) => {
    res.write("<h1>Chess server</h1>");
    res.end();
});

app.listen(port, () => {
    console.log("Server started, listening on port " + port)
});

