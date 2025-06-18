const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authUtil');
const { getAllHod, getOneHod, addProject, HodLogin, deleteproject,getProjects,editProject ,searchProject,hodDashboardDetails,handleStatus,handleStatus2} = require("../controller/HodController")

router.get('/addhod', getAllHod)
router.post('/getProjects', getProjects)
router.post("/onehod", getOneHod)
router.post("/Hodlogin", HodLogin);

router.post("/addProject", verifyToken, addProject);
router.post("/deleteProject", verifyToken, deleteproject);
router.post("/editProject", verifyToken, editProject);
router.post("/searchProject", searchProject);
router.post("/hodDashboardDetails", hodDashboardDetails);
router.post("/handleStatus", handleStatus2);

module.exports = router;