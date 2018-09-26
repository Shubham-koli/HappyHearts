'use strict';
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto-js");

var app = express();
app.use(bodyParser.json());


app.listen(3000, () => {
    console.log("Started on port 3000");
});