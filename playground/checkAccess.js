const { mongoose } = require("../server/EHR/MongoDB/mongoose");
const { Access } = require("../server/EHR/models/Access");

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

checkAccess("1337", "HSTL123")
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
