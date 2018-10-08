const axios = require("axios");
const _ = require("lodash");

const { getHospitalName } = require("../server/EHR/MongoDB/getHospital");

let AdharNo = "8421999884";
let transaction =
  "bc5db1de7935c78082d3b778a222c286bc3e0b2007c83854e3c5ed78260e2d69";

let getPatientHistory = AdharNo => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:3000/api/org.example.basic.PatientData/${AdharNo}`)
      .then(response => {
        resolve(response.data.TreatmentDetails);
      })
      .catch(function(error) {
        reject(402);
      });
  });
};

// let getFees = TreatmentDetails => {
//   return new Promise((resolve, reject) => {});
// };

async function getFees(AdharNo, transactionId) {
  let TreatmentDetails = await getPatientHistory(AdharNo);
  let q = _.find(TreatmentDetails, { transactionId: transactionId });
  console.log(q);
}
getFees(AdharNo, transaction);
// getPatientHistory("8421999884")
//   .then(
//     res => {
//       console.log(res);
//     },
//     err => {
//       console.log(err);
//     }
//   )
//   .catch(err => {
//     console.log(err);
//   });
