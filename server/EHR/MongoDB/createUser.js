const {
  mongoose
} = require("./mongoose");
const {
  Patient
} = require("../models/Patient");

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

module.exports = {
  addNewPatient
};