'use strict';
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const {
    encryptUsingFABRIC_KEY
} = require("./EHR/encryption/Fabric-Encrypt");
const {
    encryptUsingPrivateKey
} = require("./EHR/encryption/EHR-Encrypt");
const {
    decryptUsingFABRIC_KEY
} = require("./EHR/decryption/Fabric-Decrypt");
const {
    decryptUsingPrivateKey
} = require("./EHR/decryption/EHR-Decrypt");

var app = express();
app.use(bodyParser.json());

app.post('/encrypt', (req, res) => {
    console.log('encrypting using private key');
    encryptUsingPrivateKey(req.body).then((result) => {
        console.log('encrypting using Fabric key');
        encryptUsingFABRIC_KEY(result).then((encryptedObj) => {
            console.log('Object Successfully Encrypted');
            res.send(encryptedObj);
        });
    });
});

app.get("/decrypt", (req, res) => {
    console.log("decrypt using Fabric Key");
    decryptUsingFABRIC_KEY(req.body).then((result) => {
        console.log("decrypt using Private Key");
        decryptUsingPrivateKey(result).then((decryptedObj) => {
            console.log("Object Successfully Decrypted");
            res.send(decryptedObj);
        });
    })
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});