require("dotenv").config();
const { decryptObject } = require("./decryption-promise");

const { decrypt_patientData } = require("./patientData-decrypt");

const FABRIC_KEY = process.env.FABRIC_KEY;

// let data = {
//     '$class': 'org.example.basic.Patient',
//     AdharNo: '8421999884',
//     firstName: 'U2FsdGVkX1/CeKNmqWLdVq+rUkcu5GZzF0/ZO4fjjGpDwP3KneoB30iusbu5GwzDfMidaRCVcDujW9ijbysWhQ==',
//     lastName: 'U2FsdGVkX1836oNAZFz0KrMCrWar+tj0SKv0PHNq/a6c9teXD0uMgONSnn2ZeYub76c3bzHGYCkJT5TdEjNX9A==',
//     Dob: 'U2FsdGVkX1/LWobVYk0IQzOXnt0bNoUAs+8nlYXhixh90OIzRxAkI9O26IsbpS6pvsNp/Tlzc3ya2za1fhL62A==',
//     BloodGroup: 'U2FsdGVkX1/OvhRpyBCC80b7Zko9H6Kn42MiCSoeZj1nwX/GdZP1OSHq0KR2GjZrHu1QjnhpSc9/ZF3eKU6Eag==',
//     Gender: 'U2FsdGVkX1/EHg+tqvLR7nS0K1ZfOi7aZFOmLnFRVBn6lyl39pxIojuQVPA0LUsYDEhylmDrXXbFVfCKtAy/3A==',
//     address: 'U2FsdGVkX1865MkxLO/EQQ9l4EK4u11jMH6YnJOL/z2R/3W96P+dg31vuWArm6oW51m8ZV7OBSi4Jrg1PnRi/w==',
//     pincode: 'U2FsdGVkX19Pza3HNR71RQZjF6SPwEwuPYlrAt72PeyklrvN2EktobWdw4T/I4tKjOAvkRfEY55avaaxjyzzdw=='
// };

let decryptUsingFABRIC_KEY = data => {
  return new Promise((resolve, reject) => {
    decryptObject(data, FABRIC_KEY).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};
//Promise to  decrypt the treatment details
let decrypt_TreatmentDetails_UsingFabricKey = data => {
  return new Promise((resolve, reject) => {
    decrypt_patientData(data, FABRIC_KEY).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};
// decryptUsingFABRIC_KEY(data).then((res) => {
//     console.log(res);
// })

module.exports = {
  decryptUsingFABRIC_KEY, // it decrypts the data present in the fabric/blockchain with FABRIC_KEY
  decrypt_TreatmentDetails_UsingFabricKey //decryption of treatment details using Fabric Key, I reconstructed it because of different jSON Format.
};
