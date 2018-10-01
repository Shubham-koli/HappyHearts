const mongoose = require("mongoose");

const Patient = mongoose.model("Patient", {
  _id: {
    type: String,
    required: true,
    trim: 1
  },
  name: {
    type: String,
    required: true,
    trim: 1
  },
  password: {
    type: String,
    required: false,
    trim: 1
  }
});

module.exports = {
  Patient
};
