let treatmentData = {
    $class: "org.example.basic.TreatmentDetails",
    HospitalName: "Civil Solapur",
    StaffId: "1234",
    PinCode: "413001",
    patientData: "resource:org.example.basic.PatientData#3893"
};

let str = treatmentData.patientData.substr(39);
console.log(str);