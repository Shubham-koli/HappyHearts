require("dotenv").config();
const { getHospitalName } = require("../EHR/MongoDB/getHospital");
// const REST_URL = process.env.REST_URL;
const REST_URL = "http://localhost:3000/api";
const axios = require("axios");

app.post("/emergencyportal", (req, res) => {
  let AadharNo = req.body.AdharNo;
  let guardian = req.body.guardian;
  console.log(AadharNo);

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
