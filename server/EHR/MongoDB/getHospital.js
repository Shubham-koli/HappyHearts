const { mongoose } = require("./mongoose");
const { Hospital } = require("../models/Hospital");

let getHospitalName = id => {
  return new Promise((resolve, reject) => {
    Hospital.findById({ _id: id }).then(doc => {
      let data = {};
      data.name = doc.HospitalName;
      data.StaffName = doc.StaffName;
      resolve(data);
    });
  });
};

// getHospitalName("HS12345").then(data => {
//   console.log(data);
// });

// let newHospital = new Hospital({
//   _id: "HS12345",
//   HospitalName: "Civil Hospital Solapur",
//   StaffId: "DOC12345",
//   StaffName: "Dr Koli"
// })
//   .save()
//   .then(doc => {
//     console.log("done");
//   });

module.exports = {
  getHospitalName
};
