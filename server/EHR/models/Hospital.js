const mongoose = require("mongoose");

let Treatment = mongoose.model("Analytics", {
  HospitalName: {
    type: String,
    required: true,
    trim: 1
  },
  StaffId: {
    type: String,
    required: true,
    trim: 1
  }
});
