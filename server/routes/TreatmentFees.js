const axios = require("axios");
const {
  mongoose
} = require("../EHR/MongoDB/mongoose");
const _ = require("lodash");

const {
  decryptUsingFABRIC_KEY
} = require("../EHR/decryption/Fabric-Decrypt");

const {
  getHospitalName
} = require("../EHR/MongoDB/getHospital");
// const { getPatientHistory } = require("../EHR/MongoDB/Consent");

let AdharNo = "8421999884";
let transaction =
  "977a5bf50b15a709020ca66e679acced498a87903e6084f7b092cdf7d855b828";

let getPatientHistory = AdharNo => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:3000/api/org.example.basic.PatientData/${AdharNo}`)
      .then(response => {
        resolve(response.data.TreatmentDetails);
      })
      .catch(function (error) {
        reject(402);
      });
  });
};

async function getFees(AdharNo, transactionId) {
  let TreatmentDetails = await getPatientHistory(AdharNo);
  let res = _.find(TreatmentDetails, {
    transactionId: transactionId
  });
  let result = {};
  //console.log(res);
  try {
    if (res.hasOwnProperty("HospitalFees")) {
      result.Hospital_Fees = res.HospitalFees;
    }
    if (res.hasOwnProperty("ConsultancyFees")) {
      result.Consultancy_Fees = res.ConsultancyFees;
    }
    if (res.hasOwnProperty("PharmacyFees")) {
      result.Pharmacy_Fees = res.PharmacyFees;
    }
    if (res.hasOwnProperty("AcFees")) {
      result.AC_Fees = res.AcFees;
    }
    if (res.hasOwnProperty("Disease")) {
      result.Disease = res.Disease;
    }
  } catch (err) {
    console.log(err);
  }
  return new Promise((resolve, reject) => {
    decryptUsingFABRIC_KEY(result).then(decryptedData => {
      resolve(decryptedData);
    })
  }).catch(err => {
    console.log(err);
    reject(err);
  })

}

// getFees(AdharNo, transaction).then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log(err);
// })

module.exports = {
  getFees
};