const mongoose = require("../MongoDB/mongoose");
const { Patient } = require("../models/Patient");

let getName = id => {
  return new Promise((resolve, reject) => {
    Patient.findById(id).then(doc => {
      //   console.log(doc.name);
      resolve(doc.name);
    });
  });
};

// getName("1337")
//   .then(doc => {
//     // console.log(doc);
//   })
//   .catch(err => {
//     console.log(err);
//   });

module.exports = {
  getName
};
