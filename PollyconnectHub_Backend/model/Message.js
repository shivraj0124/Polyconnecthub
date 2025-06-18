const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
