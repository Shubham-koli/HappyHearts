const { mongoose } = require("./mongoose");

const { Access } = require("../models/Access");

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

module.exports = {
  checkAccess,
  accessReq,
  accessGRANT,
  accessDENY
};
