require("dotenv").config();

const { encryptObject } = require("./encryption-promise");

const FABRIC_KEY = "12345";

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

let encryptUsingFABRIC_KEY = data => {
  return new Promise((resolve, reject) => {
    encryptObject(data, FABRIC_KEY).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};

// added promise to encrypt the treatment details using Fabric key
let encrypt_TreatmentDetails_UsingFABRIC_KEY = data => {
  return new Promise((resolve, reject) => {
    encryptObject(data, FABRIC_KEY).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};

// encryptUsingFABRIC_KEY(data, FABRIC_KEY).then((res) => {
//     console.log(res);
// })

module.exports = {
  encryptUsingFABRIC_KEY, // It encrypts (By Fabric Key) already encrypted (By User's Private key) data
  encrypt_TreatmentDetails_UsingFABRIC_KEY
};
