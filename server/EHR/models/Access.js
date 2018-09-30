const mongoose = require("mongoose");

const Access = mongoose.model("access_record", {
  _id: {
    type: String,
    required: true,
    trim: 1
  },
  Hospital_ID: {
    type: String,
    required: true,
    trim: 1
  },
  Staff_ID: {
    type: String,
    required: true,
    trim: 1
  },
  Status: {
    type: String,
    required: false,
    trim: 1
  }
});

module.exports = {
  Access
};
