const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    multimedia: {
        type: [String]
    },
    contributers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    }],
    live_demo: {
        type: String,
    },
    likecount: {
        type: Number,
        default: 0
    },
    commentcount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true
    },
    allocated_college: {
        type: mongoose.Schema.Types.ObjectId, ref: 'College'
    },
    allocated_department: {
        type: mongoose.Schema.Types.ObjectId, ref: 'dapartments'
    },
    created_By: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Auth'
    },
    userType:{
        type:String,
    },
    isActive:{
      type: String,
      default:false
    },
    codeLink:{
      type:String,
      default:""
    }
},{ timestamps: true })

const projects = mongoose.model("projects", projectSchema);

module.exports = projects;