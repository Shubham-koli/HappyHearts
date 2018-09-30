const { mongoose } = require("../server/EHR/MongoDB/mongoose");

const { Access } = require("../server/EHR/models/Access");

let tmp = {
  $class: "org.example.basic.Record",
  Hospital_ID: "Civil Hospital",
  Staff_ID: "Doctor Koli",
  AccessType: "GRANT",
  AadharNo: "resource:org.example.basic.AccessRecord#1337"
};

let accessReq = data => {
  return new Promise((resolve, reject) => {
    let AadharNo = data.accessRecord.substr(40);
    let request = new Access({
      _id: AadharNo,
      Hospital_ID: data.Hospital_ID,
      Staff_ID: data.Staff_ID,
      Status: "OPEN"
    });
    request
      .save()
      .then(
        doc => {
          resolve(doc);
        },
        err => {
          console.log("Error while uploading access request to MongoDB", err);
          reject(err);
        }
      )
      .catch(errorMessage => {
        console.log(
          "Error while uploading access request to MongoDB",
          errorMessage
        );
      });
  });
};

let sample = {
  AadharNo: "1337"
};
let accessGRANT = data => {
  return new Promise((resolve, reject) => {
    let AadharNo = sample.AadharNo;
    Access.findOneAndUpdate(
      { _id: AadharNo },
      { $set: { Status: "GRANT" } },
      { new: true }
    )
      .then(
        doc => {
          resolve(doc);
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          reject(err);
        }
      )
      .catch(errorMessage => {
        console.log(
          "Error while updating access request to MongoDB",
          errorMessage
        );
      });
  });
};

accessGRANT(sample).then(res => {
  console.log(res);
});

module.exports = {
  accessGRANT,
  accessReq
};
