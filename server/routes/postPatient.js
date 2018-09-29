require("dotenv").config();
// const REST_URL = process.env.REST_URL;
const REST_URL = "http://localhost:3000/api";
const axios = require("axios");

// let data = {
//     "$class": "org.example.basic.Patient",
//     "AdharNo": "1234567",
//     "firstName": "test",
//     "lastName": "test",
//     "Dob": "31/10/1995",
//     "BloodGroup": "B+",
//     "Gender": "M",
//     "address": "Solapur"
// };

let treatmentData = {
  $class: "org.example.basic.TreatmentDetails",
  HospitalName: "Civil Solapur",
  StaffId: "1234",
  PinCode: "413001",
  patientData: "resource:org.example.basic.PatientData#3893"
};

// axios.post(`${REST_URL}/org.example.basic.Patient`, data)
//     .then(function (response) {

//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });

// it creates new patient entry in blockhain
let createNewPatient = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${REST_URL}/org.example.basic.Patient`, data)
      .then(function(response) {
        if (response.status == 200) resolve(200);
        else reject(response.data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

//Treatment details is a transaction it needs Aadhar No staff id and pincode to successfully execute
let addTreatmentDetails = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${REST_URL}/org.example.basic.TreatmentDetails`, data)
      .then(function(response) {
        if (response.status == 200) resolve(200);
        else reject(response.data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

// addTreatmentDetails(treatmentData).then(
//   res => {
//     console.log(res);
//   },
//   errorMessage => {
//     console.log(errorMessage);
//   }
// );

// createNewPatient(data).then((res) => {
//     if (res == 200) {
//         console.log('Data Posted into Blockchain successfully');
//     }
// }, (errorMessage) => {
//     console.log(errorMessage);
// });

module.exports = {
  createNewPatient, //it creates new patient entry in blockhain
  addTreatmentDetails //Treatment details is a transaction it needs Aadhar No staff id and pincode to successfully execute
};
