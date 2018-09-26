require("dotenv").config();
const decrypt = require("./decryption-promise");
const Crypto = require("crypto-js");
const FABRIC_KEY = process.env.FABRIC_KEY;

let data = {
    '$class': 'org.example.basic.Patient',
    'AdharNo': '1234',
    'firstName': 'U2FsdGVkX1+rQcgvWmV5wilqrx3ZfQtuk8SyvmJQdcc=',
    'lastName': 'U2FsdGVkX19iQWorz9T+ML0l4ylyTL3ZEXZrOWMBO3Q=',
    'Dob': 'U2FsdGVkX19tmA4kNYEoDY3xUeXM2wjKoQWYl7ek3Vc=',
    'BloodGroup': 'U2FsdGVkX1+g2ZarNQS4gUFNbl0X8AbLmqDY6kUCtoY=',
    'Gender': 'U2FsdGVkX1/GDjvdkmryI+A1uiSL0BWZhqX0m/Pyf9Q=',
    'address': 'U2FsdGVkX1+jxJGwo0IRYinalOOs88AqbBiCkkNcgDI=',
    'pincode': 'U2FsdGVkX1+b8NS6b8F1iED5PtBLrUHZlHS1koNDlOs='
}
decrypt.decryptObject(data, FABRIC_KEY).then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});