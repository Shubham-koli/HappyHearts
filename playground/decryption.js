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
      HospitalName: "U2FsdGVkX19KMTgoMKaRGXY/mHjnbKYILBhANq93rNo=",
      StaffId: "U2FsdGVkX1+S6AEgsgKuMJdvy6jhiSQ2LhMQpJnmIhc=",
      PinCode: "U2FsdGVkX1+rpgx0VDzqhBjX/UpLNl86i/rLAKlZBmY=",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "0a11745340c1d177778dca57d9c47f36a8bf72e99a19ddb02f738b3787b69a92",
      timestamp: "2018-09-29T00:14:03.283Z"
    },
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName:
        "U2FsdGVkX19ZVqlsLm0d3XzYejZB1YQk/1hpUZRgGNmRgXiW2aoS1LqxlzADWobKmuZIma3DKE41WMaMZTT0/Q==",
      StaffId:
        "U2FsdGVkX1/GwgPhqphDIl1UJD3s/j2ALTAJxG7WBarJcI0Pu8nzx21VejyMYnEy+Fthk3rY48CkQXPRNfPWYQ==",
      PinCode:
        "U2FsdGVkX1+Pn9Cny/vvyJpgXF6lN9pNdXYCEZJYVKlHAoDT618s7RI8GvxTEfCmICrvf3SvKKzdogogY8tS5A==",
      patientData: "resource:org.example.basic.PatientData#3893",
      transactionId:
        "9b5d3d50f88a9f3ba535adb733068b44eb7168b2b290a904b00710983c20db71",
      timestamp: "2018-09-28T13:39:30.758Z"
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
