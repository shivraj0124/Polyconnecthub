const express = require('express');
const router = express.Router();
const { authLogin, authSignup,allUsers, getSingleUser,viewProjects,test,getDepartment,getAllProjects, getuserproject } = require('../controller/AuthController')
const verifyToken = require("../utils/authUtil")

router.post('/login', authLogin);
router.post('/signup', authSignup);
router.get('/test', verifyToken, test)
router.post('/getDepartment', getDepartment)
router.get('/getAllProjects', getAllProjects)
router.post('/getuprojects', getuserproject)
router.post('/getSingleUser', getSingleUser)
router.post('/viewProjects', viewProjects)
router.get('/allUsers', allUsers)
module.exports = router;