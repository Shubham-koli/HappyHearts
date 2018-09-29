require("dotenv").config();
const { mongoose } = require("../MongoDB/mongoose");
const { Treatment } = require("../models/AnalyticalData");
const { encryptObject } = require("../encryption/encryption-promise");
const CIPHER_KEY = process.env.MONGODB_KEY;

//This Module takes Treatment Details data as input and removes personal identification things and stores it into MongoDB
let saveTreatment = data => {
  return new Promise((resolve, reject) => {
    let newTreatment = new Treatment({
      HospitalName: data.HospitalName,
      StaffId: data.StaffId,
      PinCode: data.PinCode,
      ChronicDisease: data.ChronicDisease,
      Disease: data.Disease,
      DiseaseType: data.DiseaseType,
      DiseaseCategory: data.DiseaseCategory,
      DiseaseSubCategory: data.DiseaseSubCategory,
      symptom: data.symptom,
      allergies: data.allergies,
      AlcoholConsumption: data.AlcoholConsumption,
      SmokingHabits: data.SmokingHabits,
      medicines: data.medicines,
      tests: data.tests
    });
    // console.log(typeof newTreatment);
    newTreatment.save().then(
      doc => {
        resolve(doc);
      },
      err => {
        if (err.code === 11000) {
          reject("Private key for that record already exists");
        } else {
          console.log(err);
          reject(err);
        }
      }
    );
  });
};

// let data = {
//   $class: "org.example.basic.TreatmentDetails",
//   HospitalName: "Exercitation ullamco.",
//   StaffId: "Deserunt qui.",
//   PinCode: "Culpa adipisicing.",
//   ChronicDisease: "Minim aute esse minim laborum.",
//   Disease: "Nulla duis.",
//   DiseaseType: "Consectetur aute.",
//   DiseaseCategory: "Exercitation sunt.",
//   DiseaseSubCategory: "Ex exercitation deserunt aliqua.",
//   // symptom: "Ea.",
//   allergies: "Esse commodo.",
//   AlcoholConsumption: "Occaecat nulla.",
//   SmokingHabits: "Elit esse excepteur.",
//   medicines: "Deserunt amet.",
//   tests: "Officia id ex nisi.",
//   patientData: "resource:org.example.basic.PatientData#8373"
// };

let mongoEncrypt = data => {
  return new Promise((resolve, reject) => {
    encryptObject(data, CIPHER_KEY)
      .then(
        res => {
          saveTreatment(res).then(doc => {
            resolve(doc);
          });
        },
        errorMessage => {
          console.log("ERROR WHILE ENCRYPTING DATA WHILE STORING IN MONGODB");
          reject(errorMessage);
        }
      )
      .catch(err => {
        console.log("ERROR WHILE ENCRYPTING DATA WHILE STORING IN MONGODB");
        reject(err);
      });
  });
};

// mongoEncrypt(data, "54321")
//   .then(
//     res => {
//       saveTreatment(res)
//         .then(
//           doc => {
//             console.log(doc);
//           },
//           errorMessage => {
//             console.log(errorMessage);
//           }
//         )
//         .catch(err => {
//           console.log(err);
//         });
//     },
//     errorMessage => {
//       console.log(errorMessage);
//     }
//   )
//   .catch(err => {
//     console.log(err);
//   });

// saveTreatment(data)
//   .then(
//     doc => {
//       console.log(doc);
//     },
//     errorMessage => {
//       console.log(errorMessage);
//     }
//   )
//   .catch(err => {
//     console.log(err);
//   });

module.exports = {
  saveTreatment,
  mongoEncrypt //It encrypts data which is to be stored in mongoDB
};
