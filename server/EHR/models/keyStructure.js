const mongoose = require("mongoose");

const keyModel = mongoose.model("Keys", {
  privateKey: {
    type: String,
    required: true,
    trim: 1
  },
  _id: {
    required: true,
    type: String,
    trim: 1
  }
});

module.exports = {
  keyModel
};