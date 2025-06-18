const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authUtil');
const { addComment, removeComment, getComments } = require("../controller/CommentController");

router.post("/addcomment", verifyToken, addComment);
router.post("/removecomment", verifyToken, removeComment);
router.post("/getcomments", verifyToken, getComments)

module.exports = router;