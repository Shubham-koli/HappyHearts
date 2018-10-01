let lastRecord = data => {
  return new Promise((resolve, reject) => {
    let lastRecord = {};
    lastRecord.Disease =
      data.TreatmentDetails[data.TreatmentDetails.length - 1].Disease;
    lastRecord.ChronicDisease =
      data.TreatmentDetails[data.TreatmentDetails.length - 1].ChronicDisease;
    lastRecord.timestamp = new Date(
      data.TreatmentDetails[data.TreatmentDetails.length - 1].timestamp
    ).toLocaleString();
    lastRecord.symptom =
      data.TreatmentDetails[data.TreatmentDetails.length - 1].symptom;
    resolve(lastRecord);
  });
};

module.exports = {
  lastRecord
};
