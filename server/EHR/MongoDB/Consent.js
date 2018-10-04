const { mongoose } = require("./mongoose");

const { Access } = require("../models/Access");

const { getHospitalName } = require("../MongoDB/getHospital");

let accessReq = data => {
  return new Promise((resolve, reject) => {
    let AdharNo = data.AdharNo;
    let request = new Access({
      _id: AdharNo,
      Hospital_ID: data.Hospital_ID,
      Staff_ID: data.Staff_ID,
      Status: "OPEN"
    });
    request
      .save()
      .then(
        doc => {
          resolve(200);
        },
        err => {
          console.log("uploading access request to MongoDB", err);
          reject(204);
        }
      )
      .catch(errorMessage => {
        reject(204);
      });
  });
};

let accessGRANT = data => {
  return new Promise((resolve, reject) => {
    let AdharNo = data.AdharNo;
    Access.findOneAndUpdate(
      { _id: AdharNo },
      { $set: { Status: "GRANT" } },
      { new: true }
    )
      .then(
        doc => {
          resolve(doc);
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          if (err.code == 11000) {
            reject(409);
          } else {
            reject(err);
          }
        }
      )
      .catch(errorMessage => {
        reject(404);
      });
  });
};

let accessDENY = data => {
  return new Promise((resolve, reject) => {
    let AdharNo = data.AdharNo;
    Access.findOneAndUpdate(
      { _id: AdharNo },
      { $set: { Status: "DENY" } },
      { new: true }
    )
      .then(
        doc => {
          resolve(doc);
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          if (err.code == 11000) {
            reject(409);
          } else {
            reject(err);
          }
        }
      )
      .catch(errorMessage => {
        reject(404);
      });
  });
};

let checkAccess = (AdharNo, Hospital_ID) => {
  return new Promise((resolve, reject) => {
    Access.findById({ _id: AdharNo })
      .then(doc => {
        //console.log(doc);
        if (doc.Status == "GRANT" && doc.Hospital_ID == Hospital_ID) {
          resolve(200);
        } else {
          reject(401);
        }
      })
      .catch(err => {
        reject(404);
      });
  });
};

let emergencyAccessGRANT = data => {
  return new Promise((resolve, reject) => {
    let AdharNo = data.AdharNo;
    Access.findOneAndUpdate(
      { _id: AdharNo },
      { $set: { Status: "GRANT" } },
      { new: true }
    )
      .then(
        doc => {
          resolve(doc);
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          if (err.code == 11000) {
            reject(409);
          } else {
            reject(err);
          }
        }
      )
      .catch(errorMessage => {
        reject(404);
      });
  });
};

let accessOPEN = data => {
  return new Promise((resolve, reject) => {
    let AdharNo = data.AdharNo;
    Access.findOne({ _id: AdharNo })
      .then(
        doc => {
          // resolve(doc);
          console.log(doc);
          let data = {};
          getHospitalName(doc.Hospital_ID).then(result => {
            data.StaffName = result.StaffName;
            data.HospitalName = result.name;
            data.Staff_ID = "DOC12345";
            data.Hospital_ID = "HS12345";
            resolve(data);
          });
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          if (err.code == 11000) {
            reject(409);
          } else {
            reject(err);
          }
        }
      )
      .catch(errorMessage => {
        reject(404);
      });
  });
};
let data = {
  AdharNo: "8421999884"
};

// accessOPEN(data).then(doc => {
//   console.log(doc);
// });

module.exports = {
  checkAccess,
  accessOPEN,
  accessReq,
  accessGRANT,
  accessDENY,
  emergencyAccessGRANT
};
