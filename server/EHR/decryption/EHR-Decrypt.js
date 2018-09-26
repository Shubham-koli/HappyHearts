require("dotenv").config();
const decrypt = require("./decryption-promise");
const Crypto = require("crypto-js");
const FABRIC_KEY = process.env.FABRIC_KEY;

let cryptoText = 'U2FsdGVkX1+lTU9gLK9C+pOvRfdFkge/05FfhfIkl+Q=';
let text = decrypt.decrypt_promise(cryptoText, FABRIC_KEY);
console.log(text);