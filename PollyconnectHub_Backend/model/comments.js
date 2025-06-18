const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      requied: true,
    },
    commented_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      requied: true,
    },
    comment_text: {
      type: String,
      requied: true,
    },
  },
  { timestamps: true }
);

const comments = mongoose.model("comments", commentsSchema);

module.exports = comments;
