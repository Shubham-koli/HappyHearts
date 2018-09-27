const ursa = require('ursa');
const {
    keyModel
} = require('../models/keyStructure');
const {
    mongoose
} = require("../MongoDB/mongoose");

var key = ursa.generatePrivateKey(512, 65537);
var privkeypem = key.toPrivatePem();

let generatedkey = privkeypem.toString('ascii');
// console.log(generatedkey);

// let data = {
//     "$class": "org.example.basic.Patient",
//     "AdharNo": "1234",
//     "firstName": "shubham",
//     "lastName": "koli",
//     "Dob": "31/10/1995",
//     "BloodGroup": "B-",
//     "Gender": "M",
//     "address": "Solapur",
//     "pincode": ""
// };

//Creates New PrivateKey
let createPrivateKey = () => {
    return new Promise((resolve, reject) => {
        resolve(privkeypem.toString('ascii'));
    })
};
// createPrivateKey().then((res) => {
//     console.log(res);
// })

// Promise to save privateKey to MongoDB
let saveToDB = (privatekey, AadharNo) => {
    return new Promise((resolve, reject) => {
        let newKey = new keyModel({
            privateKey: generatedkey
        });
        newKey._id = AadharNo;
        newKey.save().then(
            doc => {
                resolve(doc);
            },
            err => {
                if (err.code === 11000) {
                    reject('Private key for that record already exists');
                } else {
                    console.log(err);
                    reject(err);
                }
            }
        );
    })
}

let createNewPatient = (AadharNo) => {
    return new Promise((resolve, reject) => {
        if (AadharNo === undefined || AadharNo === null) {
            reject('Invalid Aadhar No while Creating Patient');
        } else {
            createPrivateKey().then((res) => {
                saveToDB(res, AadharNo).then((res) => {
                    console.log('New Record is created.');
                    resolve(res);
                }, (errorMessage) => {
                    console.log('some error happened while creating new private key for the user');
                    reject(err);
                });
            }, (errorMessage) => {
                console.log('some error happened while creating private key');
            });
        }
    })
}
// createNewPatient('123').then((res) => console.log(res));
// saveToDB(generatedkey, '7709296441').then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log(err);
// });

module.exports = {
    saveToDB, //saves privatekey pair and AadharNo in the MongoDB database
    createPrivateKey, // Creates New PrivateKey
    createNewPatient // Input is Aadhar ID. It creates New  record for Patient and Primary key in the MongoDB
};