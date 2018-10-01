let data = {
  $class: "org.example.basic.PatientData",
  EHR_ID: "1337",
  TreatmentDetails: [
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName: "HS12345",
      StaffId: "DOC1234",
      PinCode: "413001",
      ChronicDisease: "Asthama",
      Disease: "Malaria",
      DiseaseType: "Infectious Disease",
      DiseaseCategory: "Vector Borne",
      DiseaseSubCategory: "Plasmodium",
      symptom: "Feaver and Night sweat",
      allergies: "NA",
      AlcoholConsumption: "YES",
      SmokingHabits: "YES",
      medicines: "Chloroquine",
      tests: "Blood Test",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "701ae50b86b95b66752634df061f6f73310ebabf978afe30fc6b04b7d15e2a78",
      timestamp: "2018-10-01T17:57:27.725Z"
    },
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName: "HS12345",
      StaffId: "DOC1234",
      PinCode: "413001",
      ChronicDisease: "Asthama",
      Disease: "Malaria",
      DiseaseType: "Infectious Disease",
      DiseaseCategory: "Vector Borne",
      DiseaseSubCategory: "Plasmodium",
      symptom: "Feaver and Night sweat",
      allergies: "NA",
      AlcoholConsumption: "YES",
      SmokingHabits: "YES",
      medicines: "Chloroquine",
      tests: "Blood Test",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "9260f465a8c8d1ff63c52ae0fceecad05ae621c86983b151d16247a8838fae6f",
      timestamp: "2018-10-01T18:12:59.096Z"
    }
  ]
};

// let details = data.TreatmentDetails;
// console.log(details);
// data.TreatmentDetails.forEach(ele => {
//   console.log(ele);
//   details.push(ele);
// });

// console.log(data.TreatmentDetails[0].timestamp);

let processData = data => {
  return new Promise((resolve, reject) => {
    let address = data.PinCode;
    let HospitalName = "Civil";
    let HospitalId = "HS12345";
    let newDate = new Date(data.timestamp).toLocaleString();
    delete data.PinCode;
    delete data.timestamp;
    delete data.transactionId;
    data.address = address;
    data.HospitalName = HospitalName;
    data.HospitalId = HospitalId;
    data.date = newDate.toString();
    resolve(data);
  });
};

// processData(data.TreatmentDetails[0]).then(doc => {
//   console.log(doc);
// });

async function getData(result1) {
  let data = [];
  result1.TreatmentDetails.forEach(record => {
    processData(record)
      .then(details => {
        data.push(details);
        if (result1.TreatmentDetails.length == data.length) {
          console.log(data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
}
getData(data);

// async function getArray(data) {
//   let details = [];
//   data.TreatmentDetails.forEach(ele => {
//     console.log(ele);
//     details.push(ele);
//   });
// }

// console.log(details);
