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
const {
  processData,
  getPatient,
  getPatientData,
  getPatientHistory
} = require("./routes/getPatient");
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
  checkAccess,
  accessOPEN,
  emergencyAccessGRANT
} = require("./EHR/MongoDB/Consent");

const { getGrantPatients } = require("./EHR/MongoDB/getPatient");
const { getName } = require("./EHR/MongoDB/patientName");

// Modules to store Access log into blockchain
const {
  grantRecord,
  denyRecord,
  emergency_access
} = require("./routes/storeRecord");
const { lastRecord } = require("../server/routes/getLastRecord");
const { getHospitalName } = require("./EHR/MongoDB/getHospital");

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
  addNewPatient(req.body.AdharNo, req.body.firstName, req.body.lastName)
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

app.post("/analytics", (req, res) => {
  console.log("analytics request received");
  if (req.body != null) {
    res.send({
      malaria: 64,
      Dengue: 24,
      ZikaVirus: 12
    });
  }
});

app.post("/newtreatment", (req, response) => {
  response.send({
    status: "200"
  });
  req.body.$class = "org.example.basic.TreatmentDetails";
  console.log(Date.now());
  console.log(req.body);
  let AadharNo = req.body.patientData.substr(39);
  let Hospital_ID = req.body.HospitalName;
  checkAccess(AadharNo, Hospital_ID)
    .then(code => {
      console.log(code);
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
        encrypt_TreatmentDetails_UsingFABRIC_KEY(req.body).then(result => {
          console.log("encrypting using Fabric key");
          addTreatmentDetails(result)
            .then(
              res => {
                // console.log(res);
                // console.log(result);
                // response.send({
                //   status: "200"
                // });
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
      } else {
        response.sendStatus(401);
      }
    })
    .catch(err => {
      response.sendStatus(401);
    });
});

app.post("/treatment", (req, response) => {
  console.log(req.body);
  let AadharNo = req.body[0].AdharNo;
  let Hospital_ID = req.body[0].Hospital_ID;
  checkAccess(AadharNo, Hospital_ID)
    .then(code => {
      if (code == "200") {
        getPatientData(AadharNo)
          .then(
            result => {
              console.log("Fetching Data from Blockchain");
              decrypt_TreatmentDetails_UsingFabricKey(result).then(result1 => {
                console.log("decrypted using Fabric Key");
                async function getData(result1) {
                  let data = [];
                  result1.TreatmentDetails.forEach(record => {
                    processData(record, req.body[0].Hospital_ID)
                      .then(details => {
                        data.push(details);
                        if (result1.TreatmentDetails.length == data.length) {
                          response.send(data);
                        }
                      })
                      .catch(err => {
                        console.log(err);
                        response.send(err);
                      });
                  });
                }
                getData(result1);
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
        response.send({
          response: "200"
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
        response.send({
          response: "200"
        });
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
  // console.log(req.body);
  console.log(`Getting Patient's List for Hospital ${req.body[0].Hospital_ID}`);
  console.log(req.body);
  -[];
  async function getPatientDetails(data, response) {
    let patientDetails = [];
    let aadharID = await getGrantPatients(data);
    aadharID.forEach(id => {
      getName(id.uid).then(name => {
        let person = {};
        person.uid = id.uid;
        person.pname = name;
        patientDetails.push(person);
        console.log(patientDetails);
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
                lastRecord(result1).then(doc => {
                  doc.status = "200";
                  response.send(doc);
                  console.log(doc);
                });
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

app.post("/emergencyportal", (req, res) => {
  let AadharNo = req.body.AdharNo;
  let guardian = req.body.guardians;
  console.log(AadharNo);
  emergency_access(req.body)
    .then(
      result => {
        console.log("Emergency Access Recorded into Blockchain");
      },
      err => {
        console.log("error while logging emergency access to the blockchain");
        res.sendStatus(402);
      }
    )
    .catch(err => {
      console.log("error while connecting blockchain");
    });
  emergencyAccessGRANT(req.body)
    .then(
      doc => {
        console.log("Emergency Access Grant record Created in MongoDB");
      },
      err => {
        console.log(
          "FAILED TO CREATE Emergency Access Grant record in MongoDB"
        );
        res.sendStatus(402);
      }
    )
    .catch(doc => {
      console.log("FAILED TO CREATE Emergency Access Grant record in MongoDB");
      res.sendStatus(500);
    });

  getPatient(AadharNo, guardian)
    .then(result => {
      console.log("decrypt using Fabric Key");
      decryptUsingFABRIC_KEY(result).then(result1 => {
        console.log("decrypt using Private Key");
        decryptUsingPrivateKey(result1).then(decryptedObj => {
          console.log("Object Successfully Decrypted");
          decryptedObj.status = "200";
          if (decryptedObj.guardians == guardian) {
            res.send(decryptedObj);
          } else {
            res.sendStatus(401);
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/openaccess", (req, res) => {
  accessOPEN(req.body[0])
    .then(
      doc => {
        let data = [];
        data.push(doc);
        res.send(data);
      },
      err => {
        res.send([]);
      }
    )
    .catch(err => {
      res.send([]);
    });
});

app.post("/patienthistory", (req, response) => {
  console.log("request to view patient treatment history recieved");
  console.log(req.body);
  let AdharNo = req.body[0].AdharNo;
  getPatientHistory(AdharNo)
    .then(
      doc => {
        doc.status = "200";
        response.send(doc);
      },
      err => {
        response.send({
          status: "402"
        });
      }
    )
    .catch(error => {
      response.send({
        status: "500"
      });
    });
});

app.listen(4000, () => {
  console.log("Started on port 4000");
});
