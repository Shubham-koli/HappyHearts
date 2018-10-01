const { Access } = require("../models/Access");
const { mongoose } = require("../MongoDB/mongoose");
const { getName } = require("../MongoDB/patientName");

let data = {
  Hospital_ID: "HSTL123"
};

let getGrantPatients = data => {
  return new Promise((resolve, reject) => {
    aadharID = [];
    Access.find(
      { Hospital_ID: `${data.Hospital_ID}`, Status: "GRANT" },
      { _id: 1 }
    ).then(doc => {
      doc.forEach(id => {
        let person = {};
        person.uid = id._id;
        aadharID.push(person);
        // console.log(id._id);
      });
      resolve(aadharID);
      // console.log(doc._id);
    });
  });
};

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
        return patientDetails.toString();
      }
    });
  });
  // console.log(patientDetails);
}
// getPatientDetails(data, "").then(doc => {
//   console.log(doc);
// });

// getGrantPatients(data)
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => console.log(err));

module.exports = {
  getGrantPatients
};
