const express = require("express");
const router = express.Router();
const MessageModel = require("../model/Message");


const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new MessageModel({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
}


const chatBet= async (req, res) => {
  try {
    const messages = await MessageModel.find({
      $or: [
        { sender: req.params.user1, receiver: req.params.user2 },
        { sender: req.params.user2, receiver: req.params.user1 }
      ]
    }).sort("createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
}

module.exports= {
    chatBet,
    sendMessage
}
