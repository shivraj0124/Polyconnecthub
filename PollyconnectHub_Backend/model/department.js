const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HOD",
    default: null,
  }
}, { timestamps: true });

const dapartments = mongoose.model("dapartments", departmentSchema);

module.exports = dapartments;
