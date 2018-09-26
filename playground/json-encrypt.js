require("dotenv").config();
const Crypto = require("crypto-js");


const encrypt = require("../server/EHR/encryption/encryption-promise");

const FABRIC_KEY = process.env.FABRIC_KEY;


//console.log(FABRIC_KEY);

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

// let tmp = new Object();

// tmp['$class'] = data.$class;
// tmp['AdharNo'] = data.address;

// console.log(tmp);

// // delete data.$class;
// // delete data.AdharNo;
let encryptObject = (data, FABRIC_KEY) => {
    return new Promise((resolve, reject) => {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {

                if (key == '$class' || key == 'AdharNo') {

                } else {
                    let val = data[key];
                    encrypt.encrypt_promise(val, FABRIC_KEY).then((res) => {
                        ReplaceWithCipher(data, key, res).then((res) => {

                        }, (errorMessage) => {

                            console.log(errorMessage);
                            reject(errorMessage);
                        });
                    }, (errorMessage) => {

                        console.log(errorMessage);
                        reject(errorMessage);
                    });
                }
            }
        }
        resolve(data);
    });
}

let ReplaceWithCipher = (data, key, res) => {
    return new Promise((resolve, reject) => {
        if (data == undefined || data == null || key == undefined || key == null || res == undefined || res == null)
            reject('Invalid Input');
        else {
            data[key] = res;
            resolve(data);
        }
    });

}

cipher(data, FABRIC_KEY).then((res) => {
    console.log(res);
}, (errorMessage) => {
    console.log(errorMessage);
});