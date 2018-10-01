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

// Modules needed for consent mechanism. they store data into MongoDB
const {
  accessGRANT,
  accessReq,
  accessDENY,
  checkAccess
} = require("./EHR/MongoDB/Consent");

const { getGrantPatients } = require("./EHR/MongoDB/getPatient");
const { getName } = require("./EHR/MongoDB/patientName");

// Modules to store Access log into blockchain
const { grantRecord, denyRecord } = require("./routes/storeRecord");
const { lastRecord } = require("../server/routes/getLastRecord");

const { addNewPatient } = require("./EHR/MongoDB/createUser");
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
                  decryptedObj.status = "200";
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
  addNewPatient(req.body.AdharNo, req.body.firstName)
    .then(doc => {
      console.log("User Added to MongoDB");
    })
    .catch(err => {
      console.log(err);
    });
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
  //console.log(req.body);
  grantRecord(req.body)
    .then(
      res => {
        console.log("Access GRANT Logged");
      },
      err => {
        console.log("error while Logging access details into blockchain");
      }
    )
    .catch(err => {
      console.log("Fatal error in the Access logging into blockchain");
    });
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
  console.log(req.body);
  accessReq(req.body)
    .then(
      res1 => {
        console.log("Access Request Created");
        res.send({
          CODE: "200"
        });
      },
      errorMessage => {
        console.log(errorMessage);
        res.send({
          CODE: "400"
        });
      }
    )
    .catch(errorMessage => {
      console.log(errorMessage);
      res.send({
        CODE: `${errorMessage}`
      });
    });
});

app.post("/deny", (req, response, next) => {
  denyRecord(req.body)
    .then(
      res => {
        console.log("Access DENY Logged");
      },
      err => {
        console.log("error while Logging access details into blockchain");
      }
    )
    .catch(err => {
      console.log("Fatal error in the Access logging into blockchain");
    });
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

app.post("/test", (req, res) => {
  res.send(
    {
      HospitalName: "Civil",
      HospitalId: "id",
      StaffId: "Deserunt qui.",
      StaffName: "Dr.Bare",
      Address: "address",
      ChronicDisease: "Minim aute esse minim laborum.",
      Disease: "Nulla duis.",
      DiseaseType: "Consectetur aute.",
      DiseaseCategory: "Exercitation sunt.",
      DiseaseSubCategory: "Ex exercitation deserunt aliqua.",
      allergies: "Esse commodo.",
      AlcoholConsumption: "Occaecat nulla.",
      SmokingHabits: "Elit esse excepteur.",
      medicines: "Deserunt amet.",
      tests: "Officia id ex nisi.",
      Date: "2018-09-28"
    },
    {
      HospitalName: "Civil",
      HospitalId: "id",
      StaffId: "Deserunt qui.",
      StaffName: "Dr.Bare",
      Address: "address",
      ChronicDisease: "Minim aute esse minim laborum.",
      Disease: "Nulla duis.",
      DiseaseType: "Consectetur aute.",
      DiseaseCategory: "Exercitation sunt.",
      DiseaseSubCategory: "Ex exercitation deserunt aliqua.",
      allergies: "Esse commodo.",
      AlcoholConsumption: "Occaecat nulla.",
      SmokingHabits: "Elit esse excepteur.",
      medicines: "Deserunt amet.",
      tests: "Officia id ex nisi.",
      Date: "2018-09-28"
    }
  );
});

app.post("/patientlist", (req, response) => {
  console.log(`Getting Patient's List for Hospital ${req.body[0].Hospital_ID}`);
  console.log(req.body);
  async function getPatientDetails(data, response) {
    let patientDetails = [];
    let aadharID = await getGrantPatients(data);
    aadharID.forEach(id => {
      getName(id.uid).then(name => {
        let person = {};
        person.uid = id.uid;
        person.pname = name;
        patientDetails.push(person);
        // console.log(patientDetails);
        if (patientDetails.length === aadharID.length) {
          response.send(patientDetails);
        }
      });
    });
  }
  getPatientDetails(req.body[0], response);
});

app.post("/lastrecord", (req, response) => {
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
                    console.log(decryptedObj);
                    lastRecord(decryptedObj).then(doc => {
                      doc.status = "200";
                      response.send(doc);
                      console.log(doc);
                    });
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

app.listen(4000, () => {
  console.log("Started on port 4000");
});
