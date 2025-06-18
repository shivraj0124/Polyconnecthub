const CommentModel = require("../model/comments");
const ProjectModel = require("../model/projects");

const addComment = async (req, res) => {
    const { project, comment_by, text } = req.body;
    const comment = new CommentModel({
        project_id: project,
        commented_by: comment_by,
        comment_text: text
    })
    const commentdone = await comment.save()

    if (commentdone) {
        const update = await ProjectModel.findOneAndUpdate({ _id: project }, { $inc: { commentcount: 1 } })
    }
    return res.status(200).json({
        data: {
            status: true,
            msg: "comment added.."
        }
    })
}

const removeComment = async (req, res) => {
    const { project, comment_id } = req.body;

    const deletedLike = await CommentModel.findOneAndDelete({
        _id: comment_id
    });

    if (deletedLike) {
        const update = await ProjectModel.findOneAndUpdate({ _id: project }, { $inc: { likecount: -1 } })
    }
    return res.status(200).json({
        data: {
            status: true,
            msg: "comment removed."
        }
    })
}

const getComments = async (req, res) => {
    const { project_id } = req.body;

    const data = await CommentModel.find({ project_id: project_id });

    return res.status(200).json({
        data: {
            status: true,
            data: data
        }
    })
}


module.exports = { addComment, removeComment, getComments }