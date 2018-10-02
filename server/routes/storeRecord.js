const REST_URL = "http://localhost:3000/api";
const axios = require("axios");

// sample input data
// {
//   "AdharNo": "1337",
//   "Hospital_ID":"HSTL123",
//   "Staff_ID":"Dr Koli"
//  }

let denyRecord = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${REST_URL}/org.example.basic.Record`, {
        $class: "org.example.basic.Record",
        HospitalName: data.Hospital_ID,
        StaffId: data.Staff_ID,
        AccessType: "DENY",
        accessRecord: "resource:org.example.basic.AccessRecord#" + data.AdharNo
      })
      .then(
        function(response) {
          resolve(200);
        },
        error => {
          reject(404);
        }
      )
      .catch(function(error) {
        reject(500);
      });
  });
};

let grantRecord = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${REST_URL}/org.example.basic.Record`, {
        $class: "org.example.basic.Record",
        HospitalName: data.Hospital_ID,
        StaffId: data.Staff_ID,
        AccessType: "GRANT",
        accessRecord: "resource:org.example.basic.AccessRecord#" + data.AdharNo
      })
      .then(
        function(response) {
          resolve(200);
        },
        error => {
          reject(404);
        }
      )
      .catch(function(error) {
        reject(500);
      });
  });
};

let emergency_access = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${REST_URL}/org.example.basic.Record`, {
        $class: "org.example.basic.Record",
        HospitalName: data.Hospital_ID,
        StaffId: data.Staff_ID,
        AccessType: `EMERGENCY GRANT BY GUARDIAN ${data.guardians}`,
        accessRecord: "resource:org.example.basic.AccessRecord#" + data.AdharNo
      })
      .then(
        function(response) {
          resolve(200);
        },
        error => {
          reject(404);
        }
      )
      .catch(function(error) {
        reject(500);
      });
  });
};

module.exports = {
  grantRecord,
  denyRecord,
  emergency_access
};
