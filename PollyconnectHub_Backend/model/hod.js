const mongoose = require('mongoose');

const HodSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default:"HOD"
    },
    mobileNo: {
        type: Number,
    },
    allocated_college: {
        type: mongoose.Schema.Types.ObjectId, ref: 'College'
    },
    allocated_department: {
        type: mongoose.Schema.Types.ObjectId, ref: 'dapartments'
    }

}, { timestamps: true })

const HodModel = mongoose.model("HOD", HodSchema);

module.exports = HodModel;