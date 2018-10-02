const mongoose = require("mongoose");

let Hospital = mongoose.model("Hospital", {
  _id: {
    type: String,
    required: true,
    trim: 1
  },
  HospitalName: {
    type: String,
    required: true,
    trim: 1
  },
  StaffId: {
    type: String,
    required: true,
    trim: 1
  },
  StaffName: {
    type: String,
    required: true,
    trim: 1
  }
});

module.exports = {
  Hospital
};
