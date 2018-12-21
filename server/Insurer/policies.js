const axios = require("axios");
const REST_URL = 'http://localhost:3000/api';

let getPolicy = (AdharNo, Insurer) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${REST_URL}/org.example.basic.InsurerPolicy/${AdharNo+"+"+Insurer}`)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });

}

let addPolicy = (data) => {
    data.policyId = data.CustomerAdharNo + "+" + data.InsurerName;
    return new Promise((resolve, reject) => {
        axios.post(`${REST_URL}/org.example.basic.InsurerPolicy`, data)
            .then(function (response) {
                if (response.status == 200) {
                    console.log(`Data Added for ${data.InsurerName} & ${data.CustomerAdharNo}`);
                    resolve(200);
                } else
                    reject(response.data);
            })
            .catch(function (error) {
                reject(error);
            });

        console.log(data);
    })
}

let initContract = (data) => {
    let contract = {
        "$class": "org.example.basic.claimDetails",
        "claimId": data.CustomerAdharNo + "+" + data.InsurerName
    };
    return new Promise((resolve, reject) => {
        axios.post(`${REST_URL}/org.example.basic.claimDetails`, contract)
            .then(function (response) {
                if (response.status == 200) {
                    console.log(`insurance contract generated for ${data.InsurerName} & ${data.CustomerAdharNo}`);
                    resolve(200);
                } else
                    reject(response.data);
            })
            .catch(function (error) {
                reject(error);
            });

        // console.log(data);
    })

}

// let data = {
//     "$class": "org.example.basic.InsurerPolicy",
//     "policyId": "123+Bajaj",
//     "InsurerName": "Bajaj",
//     "CustomerAdharNo": "123",
//     "expiry": "2020",
//     "Dob": "31/10/1995",
//     "Gender": "M",
//     "address": "Solapur",
//     "HospitalFees": "2000",
//     "ConsultancyFees": "4000",
//     "PharmacyFees": "3500",
//     "AcFees": "4500"
// };
// addPolicy(data).then(doc => {
//     console.log(doc);
// })

// getPolicy('123', 'Bajaj').then(doc => {
//     console.log(doc);
// })

module.exports = {
    getPolicy,
    addPolicy,
    initContract
}