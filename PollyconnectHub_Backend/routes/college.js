const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authUtil');
const { getAllColleges, getOneCollege, search, getcount,subscribeToCollege,unsubscribeFromCollege,getAllColleges2,search2} = require("../controller/CollegeController");
// const { getAllColleges, getOneCollege,addCollege } = require("../controller/CollegeController");

router.get("/getAllColleges", getAllColleges)
router.get("/getAllColleges2/:studentId", getAllColleges2)
router.post("/onecollge", getOneCollege)
router.post("/serach", search);
router.post("/search2", search2);
router.post("/getcount", getcount)
// router.post("/addCollege", addCollege)
router.post("/subscribe",subscribeToCollege)
router.post("/unsubscribe",unsubscribeFromCollege)
module.exports = router;
