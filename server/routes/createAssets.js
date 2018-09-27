require("dotenv").config();
// const REST_URL = process.env.REST_URL;
const REST_URL = 'http://localhost:3000/api';
const axios = require("axios");

let createAccessRecord = (AadharNo) => {

    return new Promise((resolve, reject) => {
        axios.post(`${REST_URL}/org.example.basic.AccessRecord`, {
                $class: "org.example.basic.AccessRecord",
                AdharNo: AadharNo
            })
            .then(function (response) {
                if (response.status == 200)
                    resolve(200);
                else
                    reject(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

let createPatientData = (AadharNo) => {

    return new Promise((resolve, reject) => {
        axios.post(`${REST_URL}/org.example.basic.PatientData`, {
                $class: "org.example.basic.PatientData",
                EHR_ID: AadharNo
            })
            .then(function (response) {
                if (response.status == 200)
                    resolve(200);
                else
                    reject(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

// let AadharNo = '123';

// createAccessRecord(AadharNo).then((res) => {
//     console.log(res);
// });

module.exports = {
    createPatientData, // it creates new Asset of PatientData (Patient's Treatment's history) 
    createAccessRecord
}