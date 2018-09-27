'use strict';
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const {
    encryptUsingFABRIC_KEY
} = require("./EHR/encryption/Fabric-Encrypt");
const {
    encryptUsingPrivateKey
} = require("./EHR/encryption/EHR-Encrypt");
const {
    decryptUsingFABRIC_KEY
} = require("./EHR/decryption/Fabric-Decrypt");
const {
    decryptUsingPrivateKey
} = require("./EHR/decryption/EHR-Decrypt");
const {
    createNewPatient
} = require("./routes/postPatient");
const {
    getPatient,
    getPatientData
} = require("./routes/getPatient");
const {
    createPatientEntry
} = require("./EHR/MongoDB/storeKey");
const {
    createPatientData, // it creates new Asset of PatientData (Patient's Treatment's history) 
    createAccessRecord
} = require("./routes/createAssets");

var app = express();
app.use(bodyParser.json());

app.post('/encrypt', (req, res) => {
    console.log('encrypting using private key');
    encryptUsingPrivateKey(req.body).then((result) => {
        console.log('encrypting using Fabric key');
        encryptUsingFABRIC_KEY(result).then((encryptedObj) => {
            console.log('Object Successfully Encrypted');
            res.send(encryptedObj);
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.get("/decrypt", (req, res) => {
    console.log("decrypt using Fabric Key");
    decryptUsingFABRIC_KEY(req.body).then((result) => {
        console.log("decrypt using Private Key");
        decryptUsingPrivateKey(result).then((decryptedObj) => {
            console.log("Object Successfully Decrypted");
            res.send(decryptedObj);
        });
    })
});

app.get("/getpatient/:id", (req, res) => {
    let AadharNo = req.params.id;
    getPatient(AadharNo).then((result) => {
        console.log("decrypt using Fabric Key");
        decryptUsingFABRIC_KEY(result).then((result1) => {
            console.log("decrypt using Private Key");
            decryptUsingPrivateKey(result1).then((decryptedObj) => {
                console.log("Object Successfully Decrypted");
                res.send(decryptedObj);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.post("/newpatient", (req, res) => {
    console.log(req.body.AdharNo);
    createPatientData(req.body.AdharNo).then((res) => {
        console.log("PatientData Asset Created");
    }, (err) => {
        console.log("Error while Creating PatientData");
    }).catch((err) => {
        console.log("Error while Creating PatientData");
    });

    createAccessRecord(req.body.AdharNo).then((res) => {
        console.log("AccessRecord Asset Created");
    }, (err) => {
        console.log("Error while Creating PatientData");
    }).catch((err) => {
        console.log("Error while Creating PatientData");
    });

    createPatientEntry(req.body.AdharNo).then((doc) => {
        console.log('New Patient Entry in MongoDB Created');
        console.log("encrypting using Private key")
        encryptUsingPrivateKey(req.body).then((result) => {
            console.log('encrypting using Fabric key');
            encryptUsingFABRIC_KEY(result).then((encryptedObj) => {
                console.log('Object Successfully Encrypted');
                createNewPatient(encryptedObj).then((response) => {
                    console.log(response);
                    res.sendStatus(response);
                });
            });
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(4000, () => {
    console.log("Started on port 4000");
});