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
        }).catch((err) => {
            console.log('error while getting private key of that user (EHR-Encrypt.js)');
        })
    });
}

let encrypt_TreatmentDetails_UsingPrivateKey = (data) => {
    return new Promise((resolve, reject) => {
        let AadharNo = data.patientData.substr(39);
        getKey(AadharNo).then((res) => {
            encryptObject(data, res).then((obj) => {
                // console.log(obj);
                resolve(obj);
            })
        }).catch((err) => {
            console.log('error while getting private key of that user (EHR-Encrypt.js)');
        })
    });
}
// encryptUsingPrivateKey(data).then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log('Error occurred while encrypting with Private key in Promise "encryptUsingPrivateKey" ');
// });

module.exports = {
    encryptUsingPrivateKey,
    encrypt_TreatmentDetails_UsingPrivateKey //This module is specifically designed for the Treatment details transaction because it doesn't have aadhar no field
}