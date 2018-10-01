app.post("/newtreatment", (req, response) => {
  let AadharNo = req.body.patientData.substr(39);
  let Hospital_ID = req.body.HospitalName;
  checkAccess(AadharNo, Hospital_ID)
    .then(code => {
      if (code == "200") {
        mongoEncrypt(req.body)
          .then(
            res => {
              console.log("Treatment saved in the MongoDB");
            },
            errorMessage => {
              console.log(
                "error while saving Treatment Details to MongoDB\n",
                errorMessage
              );
            }
          )
          .catch(err => {
            console.log(err);
          });
        console.log("entering treatment details");
        console.log(req.body);
        encrypt_TreatmentDetails_UsingPrivateKey(req.body).then(result1 => {
          console.log("encrypting using Private key");
          encrypt_TreatmentDetails_UsingFABRIC_KEY(result1).then(result => {
            console.log("encrypting using Fabric key");
            addTreatmentDetails(result)
              .then(
                res => {
                  console.log(res);
                  response.sendStatus(200);
                },
                errorMessage => {
                  console.log(errorMessage);
                  response.sendStatus(500);
                }
              )
              .catch(errorMessage => {
                console.log(errorMessage);
              });
          });
        });
      } else {
        response.sendStatus(401);
      }
    })
    .catch(err => {
      response.sendStatus(401);
    });
});

app.post("/treatment", (req, response) => {
  let AadharNo = req.body.AdharNo;
  let Hospital_ID = req.body.Hospital_ID;
  checkAccess(AadharNo, Hospital_ID)
    .then(code => {
      if (code == "200") {
        getPatientData(AadharNo)
          .then(
            result => {
              console.log("Fetching Data from Blockchain");
              decrypt_TreatmentDetails_UsingFabricKey(result).then(result1 => {
                console.log("decrypted using Fabric Key");
                decrypt_TreatmentDetails_UsingPrivateKey(result1).then(
                  decryptedObj => {
                    console.log("decrypt using Private Key");
                    response.send(decryptedObj);
                  }
                );
              });
            },
            errorMessage => {
              console.log(errorMessage);
              response.sendStatus(404);
            }
          )
          .catch(errorMessage => {
            console.log(errorMessage);
            response.sendStatus(404);
          });
      } else {
        response.sendStatus(401);
      }
    })
    .catch(err => {
      response.sendStatus(401);
    });
});
