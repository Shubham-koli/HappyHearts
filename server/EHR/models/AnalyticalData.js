const mongoose = require("mongoose");

let Treatment = mongoose.model("Analytics", {
  HospitalName: {
    type: String,
    required: true,
    trim: 1
  },
  Staff_ID: {
    type: String,
    required: false,
    trim: 1
  },
  flag: {
    type: String,
    required: false,
    trim: 1
  },
  PinCode: {
    type: String,
    required: true,
    trim: 1
  },
  ChronicDisease: {
    type: String,
    required: false,
    trim: 1
  },
  Disease: {
    type: String,
    required: false,
    trim: 1
  },
  DiseaseType: {
    type: String,
    required: false,
    trim: 1
  },
  DiseaseCategory: {
    type: String,
    required: false,
    trim: 1
  },
  DiseaseSubCategory: {
    type: String,
    required: false,
    trim: 1
  },
  symptom: {
    type: String,
    required: false,
    trim: 1
  },
  allergies: {
    type: String,
    required: false,
    trim: 1
  },
  AlcoholConsumption: {
    type: String,
    required: false,
    trim: 1
  },
  SmokingHabits: {
    type: String,
    required: false,
    trim: 1
  },
  medicines: {
    type: String,
    required: false,
    trim: 1
  },
  tests: {
    type: String,
    required: false,
    trim: 1
  }
});

module.exports = {
  Treatment //This is a structure of Treatment Data
};
