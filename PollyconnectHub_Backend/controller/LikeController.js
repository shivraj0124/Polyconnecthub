const LikeModel = require("../model/likes");
const ProjectModel = require("../model/projects");

const addLike = async (req, res) => {
    const { project, liked_by } = req.body;
    const liked = new LikeModel({
        project_id: project,
        liked_by: liked_by
    })
    const likedone = await liked.save()
    if (likedone) {
        const update = await ProjectModel.findOneAndUpdate({ _id: project }, { $inc: { likecount: 1 } })
    }
    return res.status(200).json({
        data: {
            status: true,
            msg: "like added.."
        }
    })
}

const disLike = async (req, res) => {
    const { project, liked_by } = req.body;
    const deletedLike = await LikeModel.findOneAndDelete({
        project_id: project,
        liked_by: liked_by
    });
    if (deletedLike) {
        const update = await ProjectModel.findOneAndUpdate({ _id: project }, { $inc: { likecount: -1 } })
    }
    return res.status(200).json({
        data: {
            status: true,
            msg: "like removed."
        }
    })
}

const test = async (req, res) => {
    const { image } = req.body;

}
module.exports = { addLike, disLike, test };