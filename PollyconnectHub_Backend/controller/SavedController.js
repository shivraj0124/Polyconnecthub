const SavedModel = require("../model/saved");
const ProjectModel = require("../model/projects");
const sendmail = require("../utils/mailUtils");

const save = async (req, res) => {
    const { project_id, user_id } = req.body;

    const saved = new SavedModel({
        project_id: project_id,
        saved_by: user_id
    })

    await saved.save();
    return res.status(200).json({
        data: {
            status: true,
            msg: "saved suceesfuuly.."
        }
    })
}

const remove = async (req, res) => {
    const { save_id } = req.body;

    const deletedsaved = await SavedModel.findOneAndDelete({
        _id: save_id
    });

    return res.status(200).json({
        data: {
            status: true,
            msg: "removed sucessfully...."
        }
    })
}

const getSaved = async (req, res) => {
    const { user_id } = req.body;

    const data = await SavedModel.find({ saved_by: user_id });

    return res.status(200).json({
        data: {
            status: true,
            data: data
        }
    })
}


module.exports = { save, remove, getSaved }