const { Treatment } = require("../server/EHR/models/AnalyticalData");
const { mongoose } = require("../server/EHR/MongoDB/mongoose");
console.log("test");
Treatment.find().then(data => {
  // console.log(data.length);
  data.forEach(function(obj) {
    for (let record in obj) {
      if (obj.hasOwnProperty(record)) {
        console.log({ record });
      }
    }
  });
}),
  errorMessage => {
    console.log(errorMessage);
  };

// for (let record in data) {
//     if (data.hasOwnProperty(record)) {
//       for (let doc of record) {
//         if (record.hasOwnProperty(doc)) {
//           console.log(doc);
//         }
//       }
//     }
//   }
