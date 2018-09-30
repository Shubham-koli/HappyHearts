"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

//importing module to encrypt data using Fabric Key
const {
  encryptUsingFABRIC_KEY,
  encrypt_TreatmentDetails_UsingFABRIC_KEY
} = require("./EHR/encryption/Fabric-Encrypt");
//importing module to encrypt data using user's private key
const {
  encryptUsingPrivateKey,
  encrypt_TreatmentDetails_UsingPrivateKey
} = require("./EHR/encryption/EHR-Encrypt");
//importing module to decrypt data using Fabric Key
const {
  decryptUsingFABRIC_KEY,
  decrypt_TreatmentDetails_UsingFabricKey
} = require("./EHR/decryption/Fabric-Decrypt");
//importing module to decrypt data using private key
const {
  decryptUsingPrivateKey,
  decrypt_TreatmentDetails_UsingPrivateKey
} = require("./EHR/decryption/EHR-Decrypt");
//importing module to create new patient and enter record into blockchain
const {
  createNewPatient,
  addTreatmentDetails
} = require("./routes/postPatient");
//importing module to fetch  patient record and treatment details from blockchain
const { getPatient, getPatientData } = require("./routes/getPatient");
//This module creates a new patient's private key entry in the MongoDB
const { createPatientEntry } = require("./EHR/MongoDB/storeKey");
const { saveTreatment, mongoEncrypt } = require("./EHR/MongoDB/Analytics");
const {
  createPatientData, // it creates new Asset of PatientData (Patient's Treatment's history)
  createAccessRecord //// it creates new Asset of Record (Patient's EHR Access Record)
} = require("./routes/createAssets");

const {
  accessGRANT,
  accessReq,
  accessDENY,
  checkAccess
} = require("./EHR/MongoDB/Consent");
var app = express();
app.use(bodyParser.json());

app.post("/encrypt", (req, res) => {
  console.log("encrypting using private key");
  encryptUsingPrivateKey(req.body)
    .then(result => {
      console.log("encrypting using Fabric key");
      encryptUsingFABRIC_KEY(result).then(encryptedObj => {
        console.log("Object Successfully Encrypted");
        res.send(encryptedObj);
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/decrypt", (req, res) => {
  console.log("decrypt using Fabric Key");
  decryptUsingFABRIC_KEY(req.body).then(result => {
    console.log("decrypt using Private Key");
    decryptUsingPrivateKey(result).then(decryptedObj => {
      console.log("Object Successfully Decrypted");
      res.send(decryptedObj);
    });
  });
});

app.post("/getpatient", (req, res) => {
  let AadharNo = req.body.AdharNo;
  let Hospital_ID = req.body.Hospital_ID;
  console.log(AadharNo);
  checkAccess(AadharNo, Hospital_ID)
    .then(
      code => {
        if (code == "200") {
          getPatient(AadharNo)
            .then(result => {
              console.log("decrypt using Fabric Key");
              decryptUsingFABRIC_KEY(result).then(result1 => {
                console.log("decrypt using Private Key");
                decryptUsingPrivateKey(result1).then(decryptedObj => {
                  console.log("Object Successfully Decrypted");
                  res.send(decryptedObj);
                });
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          res.sendStatus(401);
        }
      },
      code => {
        res.sendStatus(401);
      }
    )
    .catch(err => {
      console.log(err);
    });
});

app.post("/newpatient", (req, res) => {
  console.log(req.body.AdharNo);
  createPatientData(req.body.AdharNo)
    .then(
      res => {
        console.log("PatientData Asset Created");
      },
      err => {
        console.log("Error while Creating PatientData");
      }
    )
    .catch(err => {
      console.log("Error while Creating PatientData");
    });

  createAccessRecord(req.body.AdharNo)
    .then(
      res => {
        console.log("AccessRecord Asset Created");
      },
      err => {
        console.log("Error while Creating PatientData");
      }
    )
    .catch(err => {
      console.log("Error while Creating PatientData");
    });

  createPatientEntry(req.body.AdharNo)
    .then(doc => {
      console.log("New Patient Entry in MongoDB Created");
      console.log("encrypting using Private key");
      encryptUsingPrivateKey(req.body).then(result => {
        console.log("encrypting using Fabric key");
        encryptUsingFABRIC_KEY(result).then(encryptedObj => {
          console.log("Object Successfully Encrypted");
          createNewPatient(encryptedObj).then(response => {
            console.log(response);
            res.sendStatus(response);
          });
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

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

app.post("/grant/", (req, response) => {
  console.log(req.body.AdharNo);
  accessGRANT(req.body)
    .then(
      res => {
        getPatient(req.body.AdharNo)
          .then(result => {
            console.log("decrypt using Fabric Key");
            decryptUsingFABRIC_KEY(result).then(result1 => {
              console.log("decrypt using Private Key");
              decryptUsingPrivateKey(result1).then(decryptedObj => {
                console.log("Object Successfully Decrypted");
                response.send(decryptedObj);
              });
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      errorMessage => {
        console.log(
          "error while inserting access grant in MongoDB",
          errorMessage
        );
      }
    )
    .catch(err => {
      console.log("error while inserting access grant in MongoDB", err);
    });
});

app.post("/request", (req, res) => {
  accessReq(req.body)
    .then(
      res => {
        console.log("Access Request Created");
        res.sendStatus(200);
      },
      errorMessage => {
        console.log(errorMessage);
        res.sendStatus(409);
      }
    )
    .catch(errorMessage => {
      console.log(errorMessage);
      res.sendStatus(409);
    });
});

app.post("/deny", (req, response, next) => {
  accessDENY(req.body)
    .then(
      res => {
        console.log("Access Request DENIED");
        response.sendStatus(200);
      },
      errorMessage => {
        console.log(errorMessage);
        response.sendStatus(409);
      }
    )
    .catch(errorMessage => {
      console.log(errorMessage);
      response.sendStatus(404);
    });
});

app.listen(4000, () => {
  console.log("Started on port 4000");
});
