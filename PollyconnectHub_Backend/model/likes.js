const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'projects',
        requied: true
    },
    liked_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Auth',
        requied: true
    }
}, { timestamps: true })

const likes = mongoose.model("likes", likeSchema);

module.exports = likes;