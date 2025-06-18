const express = require('express');
const router = express.Router();
const {  chatBet,
    sendMessage } = require('../controller/ChatController')
const verifyToken = require("../utils/authUtil")

router.post('/', sendMessage);
router.get('/:user1/:user2', chatBet)

module.exports = router;