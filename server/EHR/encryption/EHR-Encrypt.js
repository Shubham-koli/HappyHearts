require("dotenv").config();
const encrypt = require("./encryption-promise");
const Crypto = require("crypto-js");
const FABRIC_KEY = process.env.FABRIC_KEY;

let plainText = 'shubham';
let text = encrypt.encrypt_promise(plainText, FABRIC_KEY);
console.log(text);