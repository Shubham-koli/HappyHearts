require("dotenv").config();
const encrypt = require("./encryption-promise");
const Crypto = require("crypto-js");
const FABRIC_KEY = process.env.FABRIC_KEY;

let data = {
    "$class": "org.example.basic.Patient",
    "AdharNo": "1234",
    "firstName": "shubham",
    "lastName": "koli",
    "Dob": "31/10/1995",
    "BloodGroup": "B+",
    "Gender": "M",
    "address": "Solapur",
    "pincode": ""
};
encrypt.encryptObject(data, FABRIC_KEY).then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});