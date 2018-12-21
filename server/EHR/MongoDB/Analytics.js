require("dotenv").config();
const {
  mongoose
} = require("../MongoDB/mongoose");
const {
  Treatment
} = require("../models/AnalyticalData");
const {
  encryptObject
} = require("../encryption/encryption-promise");
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
      tests: data.tests,
      HospitalFees: data.HospitalFees,
      ConsultancyFees: data.ConsultancyFees,
      PharmacyFees: data.PharmacyFees,
      AcFees: data.AcFees
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

// let mongoEncrypt = data => {
//   return new Promise((resolve, reject) => {
//     encryptObject(data, CIPHER_KEY)
//       .then(
//         res => {
//           saveTreatment(data).then(doc => {
//             console.log(doc);
//             resolve(doc);
//           });
//         },
//         errorMessage => {
//           console.log("ERROR WHILE ENCRYPTING DATA WHILE STORING IN MONGODB");
//           reject(errorMessage);
//         }
//       )
//       .catch(err => {
//         console.log("ERROR WHILE ENCRYPTING DATA WHILE STORING IN MONGODB");
//         reject(err);
//       });
//   });
// };

let mongoEncrypt = data => {
  return new Promise((resolve, reject) => {
    saveTreatment(data)
      .then(
        doc => {
          console.log(doc);
          resolve(doc);
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

let diseaseCount = (data) => {
  return new Promise((resolve, reject) => {
    // console.log(data);
    let result = {};
    result.count = [];
    data.input.forEach(disease => {
      Treatment.find({
        Disease: disease
      }).then(cnt => {
        let tmp = {
          DiseaseName: disease,
          count: cnt.length
        }

        result.count.push(tmp);
        if ((result.count.length) == data.input.length) {
          resolve(result);
        }
      }).catch(err => {
        console.log(err);
        reject(err);
      })
    })

  });
}

// let data = {
//   input: [
//     "Maleria",
//     "Fever",
//     'Stroke',
//     'Zika'
//   ]
// }

// diseaseCount(data).then(res => {
//   console.log(res);
// }).catch(err => {
//   console.log(err);
// })

module.exports = {
  saveTreatment,
  mongoEncrypt, //It encrypts data which is to be stored in mongoDB
  diseaseCount
};