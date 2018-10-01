require("dotenv").config();
// const REST_URL = process.env.REST_URL;
const REST_URL = "http://localhost:3000/api";
const axios = require("axios");

//get patient from blockchain
let getPatient = AadharNo => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${REST_URL}/org.example.basic.Patient/${AadharNo}`)
      .then(function(response) {
        resolve(response.data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

let getPatientData = AadharNo => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${REST_URL}/org.example.basic.PatientData/${AadharNo}`)
      .then(function(response) {
        if (response.status == 200) resolve(response.data);
        else reject(response.status);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};
// getPatientData('8421999884').then((res) => {
//     console.log(res);
// }, (errorMessage) => {
//     console.log('There was some problem with connecting the Blockchain\n', errorMessage);
// });

let processData = data => {
  return new Promise((resolve, reject) => {
    let address = data.PinCode;
    let HospitalName = "Civil";
    let HospitalId = "HS12345";
    let newDate = new Date(data.timestamp).toLocaleString();
    delete data.PinCode;
    delete data.$class;
    delete data.timestamp;
    delete data.transactionId;
    data.address = address;
    data.HospitalName = HospitalName;
    data.HospitalId = HospitalId;
    data.date = newDate.toString();
    resolve(data);
  });
};
module.exports = {
  getPatient, //This module takes Aadhar No and finds record for that Aadhar No in the blockchain.
  getPatientData,
  processData
};
