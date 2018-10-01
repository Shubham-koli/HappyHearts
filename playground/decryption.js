const {
  ReplaceWithCipher,
  decrypt_promise
} = require("../server/EHR/decryption/decryption-promise");

const CryptoJS = require("crypto-js");

let data = {
  $class: "org.example.basic.PatientData",
  EHR_ID: "3893",
  TreatmentDetails: [
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName: "U2FsdGVkX1+lDnAKonFN14r64OGyBSGxx1NEot8aqr0=",
      StaffId: "U2FsdGVkX1+1xBV3RQAQkat4LGu7AwJ2UdsNvl96B1g=",
      PinCode: "U2FsdGVkX1+YGGvSSi59/xqcep0nIEraiXS6kG02HgY=",
      ChronicDisease: "U2FsdGVkX180WqCkPKEATZesgmtbHZU2dzBZcWAN20k=",
      Disease: "U2FsdGVkX1+7cKu9vR8AAKbQRM9kLxs4UOUuYa/Jj2Q=",
      DiseaseType:
        "U2FsdGVkX1+dXvn7o+jDlC4iDnCJ+YKcnYdOI54XvSbslH2u4ib8xZg7TEIDooUy",
      DiseaseCategory: "U2FsdGVkX1+1z5eDyPRpBVtRz5tKBerQVT2MOlcJPCc=",
      DiseaseSubCategory: "U2FsdGVkX19McPcOL3RHIF8FpNEMHVdDOgVNwjGytVY=",
      symptom:
        "U2FsdGVkX19hTmmQRaq7ryg/AoKdbJztMrEXVAJ+yOhoUuT/X5sAO8v2UMyfyRF7",
      allergies: "U2FsdGVkX1+zUb+eVFQejZNddfn91AtnbkR00ofNM9s=",
      AlcoholConsumption: "U2FsdGVkX1/GkOXSMd2fGqSuEgQJ7ANsH4Y4FjaLYVY=",
      SmokingHabits: "U2FsdGVkX1+p5EQQRGI74EDs6KvIAedROPyE1NNd4XA=",
      medicines: "U2FsdGVkX19DA+vHKyrjdGyF1HYOfHcYgfBZgaQOrHo=",
      tests: "U2FsdGVkX187sXxnaE9Jy2x94Rw5T48lLKpSLig4lnI=",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "8bae36a0f185904aaf894922360672698e20b6523ad9b8a51aa3eb5f77e7966d",
      timestamp: "2018-10-01T16:59:30.765Z"
    },
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName: "U2FsdGVkX1+lDnAKonFN14r64OGyBSGxx1NEot8aqr0=",
      StaffId: "U2FsdGVkX1+1xBV3RQAQkat4LGu7AwJ2UdsNvl96B1g=",
      PinCode: "U2FsdGVkX1+YGGvSSi59/xqcep0nIEraiXS6kG02HgY=",
      ChronicDisease: "U2FsdGVkX180WqCkPKEATZesgmtbHZU2dzBZcWAN20k=",
      Disease: "U2FsdGVkX1+7cKu9vR8AAKbQRM9kLxs4UOUuYa/Jj2Q=",
      DiseaseType:
        "U2FsdGVkX1+dXvn7o+jDlC4iDnCJ+YKcnYdOI54XvSbslH2u4ib8xZg7TEIDooUy",
      DiseaseCategory: "U2FsdGVkX1+1z5eDyPRpBVtRz5tKBerQVT2MOlcJPCc=",
      DiseaseSubCategory: "U2FsdGVkX19McPcOL3RHIF8FpNEMHVdDOgVNwjGytVY=",
      symptom:
        "U2FsdGVkX19hTmmQRaq7ryg/AoKdbJztMrEXVAJ+yOhoUuT/X5sAO8v2UMyfyRF7",
      allergies: "U2FsdGVkX1+zUb+eVFQejZNddfn91AtnbkR00ofNM9s=",
      AlcoholConsumption: "U2FsdGVkX1/GkOXSMd2fGqSuEgQJ7ANsH4Y4FjaLYVY=",
      SmokingHabits: "U2FsdGVkX1+p5EQQRGI74EDs6KvIAedROPyE1NNd4XA=",
      medicines: "U2FsdGVkX19DA+vHKyrjdGyF1HYOfHcYgfBZgaQOrHo=",
      tests: "U2FsdGVkX187sXxnaE9Jy2x94Rw5T48lLKpSLig4lnI=",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "8bae36a0f185904aaf894922360672698e20b6523ad9b8a51aa3eb5f77e7966d",
      timestamp: "2018-10-01T16:59:30.765Z"
    }
  ]
};

let decryptObject = (data, CIPHER_KEY) => {
  return new Promise((resolve, reject) => {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (
          key == "$class" ||
          key == "AdharNo" ||
          key == "EHR_ID" ||
          key == "patientData"
        ) {
        } else if (key == "TreatmentDetails") {
          data[key].forEach(subKey => {
            //console.log(subKey);
            for (let field in subKey) {
              if (subKey.hasOwnProperty(field)) {
                let value = subKey[field];
                if (
                  field == "$class" ||
                  field == "transactionId" ||
                  field == "timestamp" ||
                  field == "patientData"
                ) {
                  //console.log(value);
                } else {
                  decrypt_promise(value, CIPHER_KEY)
                    .then(
                      res => {
                        ReplaceWithCipher(subKey, field, res)
                          .then(res1 => {
                            // console.log(res1);
                          })
                          .catch(errorMessage => {
                            console.log(errorMessage);
                          });
                      },
                      errorMessage => {
                        console.log(errorMessage);
                        reject(errorMessage);
                      }
                    )
                    .catch(errorMessage => {
                      console.log(errorMessage);
                    });
                }
              }
            }
          });
        } else {
          let val = data[key];
          decrypt_promise(val, CIPHER_KEY)
            .then(
              res => {
                ReplaceWithCipher(data, key, res)
                  .then(
                    res1 => {
                      resolve(res1);
                    },
                    errorMessage => {
                      console.log(errorMessage);
                      reject(errorMessage);
                    }
                  )
                  .catch(errorMessage => {
                    console.log(errorMessage);
                  });
              },
              errorMessage => {
                console.log(errorMessage);
                reject(errorMessage);
              }
            )
            .catch(errorMessage => {
              console.log(errorMessage);
            });
        }
      }
    }
    resolve(data);
  });
};

// let decrypt_promise = (str, key) => {
//   return new Promise((resolve, reject) => {
//     if (str === null || str === undefined) {
//       reject("String is not acceptable");
//     } else if (key === null || key === undefined) {
//       reject("key is not acceptable");
//     } else {
//       if (typeof key === "string") {
//         let text = CryptoJS.AES.decrypt(str, key, {
//           iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")
//         }).toString(CryptoJS.enc.Utf8);
//         resolve(text);
//       } else {
//         reject("key is not in string format");
//       }
//     }
//   });
// };

let key = "12345";
decryptObject(data, key)
  .then(
    res => {
      console.log(JSON.stringify(res));
    },
    errorMessage => {
      console.log(errorMessage);
    }
  )
  .catch(err => {
    console.log(err);
  });

let Patientdata = {
  $class: "org.example.basic.PatientData",
  EHR_ID: "3893",
  TreatmentDetails: [
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName:
        "U2FsdGVkX1/M+HFGj9DDuNZ5pDLgOiKHHntRuO66AS0/tyRnGiN4Zzi9kEoSETleiNi+m1qdGmcVvC6EtBIgkw==",
      StaffId:
        "U2FsdGVkX1+brUgVoAaUyjg4TpIK65MpY/kVDj+h080C1wNyoTcW2jW6dwq/YTln4E5H9zonGisfjDRSF8ETtg==",
      PinCode:
        "U2FsdGVkX1+4SNBdR5Hkf5imOQ8PVfK0CWMueC461LuZK8flnDesBdp2FDoGiyF9imDjITeaDjyAI00T2lItUA==",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "0a11745340c1d177778dca57d9c47f36a8bf72e99a19ddb02f738b3787b69a92",
      timestamp: "2018-09-29T00:14:03.283Z"
    }
  ]
};
