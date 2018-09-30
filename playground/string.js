let treatmentData = {
  $class: "org.example.basic.TreatmentDetails",
  HospitalName: "Civil Solapur",
  StaffId: "1234",
  PinCode: "413001",
  accessRecord: "resource:org.example.basic.PatientData#1337"
};

let str = treatmentData.accessRecord.substr(39);
console.log(str);
