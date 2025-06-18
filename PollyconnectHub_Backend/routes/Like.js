const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authUtil');
const { addLike, disLike, test } = require("../controller/LikeController");

router.post("/addlike", verifyToken, addLike);
router.post("/dislike", verifyToken, disLike);
router.post("test", test);

module.exports = router;