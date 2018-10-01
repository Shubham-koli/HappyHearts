const { mongoose } = require("../server/EHR/MongoDB/mongoose");
const { Patient } = require("../server/EHR/models/Patient");

let addNewPatient = (AdharNo, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    let user = new Patient({
      _id: AdharNo,
      name: firstName + " " + lastName
    });
    user.save().then(
      doc => {
        console.log(doc);
        resolve(200);
      },
      err => {
        console.log(err);
        resolve(500);
      }
    );
  });
};
// let data = {
//   AdharNo: "1234",
//   firstName: "anil",
//   lastName: "kadam",
//   Dob: "18/04/1997",
//   BloodGroup: "ab+",
//   Gender: "M",
//   address: "sangli",
//   $class: "org.example.basic.Patient"
// };

// addNewPatient(data.AdharNo, data.firstName).then(doc => {
//   console.log(doc);
// });

module.exports = {
  addNewPatient
};
