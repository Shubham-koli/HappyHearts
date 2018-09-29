const { ReplaceWithCipher, decrypt_promise } = require("./decryption-promise");

let decrypt_patientData = (data, CIPHER_KEY) => {
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

module.exports = {
  decrypt_patientData //it works
};
