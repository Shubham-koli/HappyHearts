const {
    encryptObject
} = require("./encryption-promise");
const {
    getKey
} = require("../MongoDB/GetKeys");
const Crypto = require("crypto-js");
// const FABRIC_KEY = process.env.FABRIC_KEY;

// let data = {
//     "$class": "org.example.basic.Patient",
//     "AdharNo": "8421999884",
//     "firstName": "shubham",
//     "lastName": "koli",
//     "Dob": "31/10/1995",
//     "BloodGroup": "B+",
//     "Gender": "M",
//     "address": "Solapur",
//     "pincode": ""
// };
// encrypt.encryptObject(data, FABRIC_KEY).then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log(err);
// });
let encryptUsingPrivateKey = (data) => {
    return new Promise((resolve, reject) => {
        getKey(data.AdharNo).then((res) => {
            encryptObject(data, res).then((obj) => {
                // console.log(obj);
                resolve(obj);
            })
        })
    });
}
// encryptUsingPrivateKey(data).then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log('Error occured while encrypring with Private key in Promise "encryptUsingPrivateKey" ');
// });

module.exports = {
    encryptUsingPrivateKey
}