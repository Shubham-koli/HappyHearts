const ursa = require('ursa');
const encrypt = require('../server/EHR/encryption/encryption-promise');
const decrypt = require('../server/EHR/decryption/decryption-promise');
const {
    keyModel
} = require('../server/EHR/models/keyStructure');
const {
    mongoose
} = require("../server/EHR/MongoDB/mongoose");

var key = ursa.generatePrivateKey(512, 65537);
var privkeypem = key.toPrivatePem();

let generatedkey = privkeypem.toString('ascii');
console.log(generatedkey);

let data = {
    "$class": "org.example.basic.Patient",
    "AdharNo": "1234",
    "firstName": "shubham",
    "lastName": "koli",
    "Dob": "31/10/1995",
    "BloodGroup": "B-",
    "Gender": "M",
    "address": "Solapur",
    "pincode": ""
};

let saveToDB = (privatekey) => {
    return new Promise((resolve, reject) => {
        let newKey = new keyModel({
            privateKey: generatedkey
        });
        newKey.save().then(
            doc => {
                resolve(doc);
            },
            err => {
                console.log(err);
                reject(err);
            }
        );
    })
}
saveToDB(generatedkey).then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});



// encrypt.encryptObject(data, privatekey).then((res) => {
//     console.log(res);
//     console.log('/////////////////////////////////////////////////\n');
//     decrypt.decryptObject(res, privatekey).then((res) => {
//         console.log(res);
//     }, (err) => {
//         console.log(err);
//     });
// }, (err) => {
//     console.log(err);
// });



// console.log(privatekey);