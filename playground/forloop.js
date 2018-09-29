let data = {
  $class: "org.example.basic.PatientData",
  EHR_ID: "3893",
  TreatmentDetails: [
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName:
        "U2FsdGVkX19ZVqlsLm0d3XzYejZB1YQk/1hpUZRgGNmRgXiW2aoS1LqxlzADWobKmuZIma3DKE41WMaMZTT0/Q==",
      StaffId:
        "U2FsdGVkX1/GwgPhqphDIl1UJD3s/j2ALTAJxG7WBarJcI0Pu8nzx21VejyMYnEy+Fthk3rY48CkQXPRNfPWYQ==",
      PinCode:
        "U2FsdGVkX1+Pn9Cny/vvyJpgXF6lN9pNdXYCEZJYVKlHAoDT618s7RI8GvxTEfCmICrvf3SvKKzdogogY8tS5A==",
      patientData: "resource:org.example.basic.PatientData#3893",
      transactionId:
        "9b5d3d50f88a9f3ba535adb733068b44eb7168b2b290a904b00710983c20db71",
      timestamp: "2018-09-28T13:39:30.758Z"
    },
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName:
        "U2FsdGVkX19ZVqlsLm0d3XzYejZB1YQk/1hpUZRgGNmRgXiW2aoS1LqxlzADWobKmuZIma3DKE41WMaMZTT0/Q==",
      StaffId:
        "U2FsdGVkX1/GwgPhqphDIl1UJD3s/j2ALTAJxG7WBarJcI0Pu8nzx21VejyMYnEy+Fthk3rY48CkQXPRNfPWYQ==",
      PinCode:
        "U2FsdGVkX1+Pn9Cny/vvyJpgXF6lN9pNdXYCEZJYVKlHAoDT618s7RI8GvxTEfCmICrvf3SvKKzdogogY8tS5A==",
      patientData: "resource:org.example.basic.PatientData#3893",
      transactionId:
        "9b5d3d50f88a9f3ba535adb733068b44eb7168b2b290a904b00710983c20db71",
      timestamp: "2018-09-28T13:39:30.758Z"
    }
  ]
};

for (let key in data) {
  if (data.hasOwnProperty(key)) {
    let val = data[key];
    // console.log({
    //     key,
    //     val
    // });
    if (key == "TreatmentDetails") {
      data[key].forEach(subKey => {
        console.log(subKey);
        for (let field in subKey) {
          if (subKey.hasOwnProperty(field)) {
            let value = subKey[field];
            console.log("///////////////////////////////////////////////");
            console.log({
              subKey,
              field
            });
          }
        }
      });
    }
  }
}
