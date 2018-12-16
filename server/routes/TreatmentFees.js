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
  "ffb28b78354cd1168b2c383c179c231ebb726ec618ac0cdf121c669cf82a8bf4";

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
      result.HospitalFees = res.HospitalFees;
    }
    if (res.hasOwnProperty("ConsultancyFees")) {
      result.ConsultancyFees = res.ConsultancyFees;
    }
    if (res.hasOwnProperty("PharmacyFees")) {
      result.PharmacyFees = res.PharmacyFees;
    }
    if (res.hasOwnProperty("AcFees")) {
      result.AcFees = res.AcFees;
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