const mongoose = require('mongoose');

const saveSchema = mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'projects',
        requied: true
    },
    saved_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Auth',
        requied: true
    }
}, { timestamps: true })

const save = mongoose.model("save", saveSchema);

module.exports = save;