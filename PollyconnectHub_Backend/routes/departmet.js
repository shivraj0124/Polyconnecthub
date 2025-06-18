const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authUtil');
const { getAllDpt, getOneDpt,getAllDptAddHod } = require("../controller/DepartmentController");

router.post("/getAllDpt", getAllDpt);
router.post("/onedpt", getOneDpt);
router.post("/getAllDptAddHod", getAllDptAddHod);


module.exports = router;
