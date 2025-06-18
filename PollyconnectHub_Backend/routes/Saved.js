const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authUtil');
const { save, remove, getSaved, } = require('../controller/SavedController');

router.post("/add", verifyToken, save);
router.post("/remove", verifyToken, remove);
router.post("/getsaved", verifyToken, getSaved);


module.exports = router;