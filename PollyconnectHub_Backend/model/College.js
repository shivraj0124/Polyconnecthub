const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  about: {
    type: String,
  },
  address: {
    type: String,
  },
  photo: {
    type: String,
  }
}, { timestamps: true });

const college = mongoose.model("College", collegeSchema);

module.exports = college;

// JWkFG9Aax1qPO1Ya
