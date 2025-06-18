const collegeModel = require("../model/College");
const POCModel = require("../model/poc");
const authModel = require("../model/Auth");
const hodModel = require("../model/hod");
const bcrypt = require("bcrypt");
const sendmail = require("../utils/mailUtils");
const HodModel = require("../model/hod");
const AuthModel = require("../model/Auth");
const addCollege = async (req, res) => {
  try {
    // const user = req.user;
    console.log(req.body);
    const { name, about, address, userType } = req.body;
    if (userType !== "admin") {
      return res.status(200).json({
        data: {
          status: false,
          msg: "Not have permission to do this task.",
        },
      });
    }
    const existcollege = await collegeModel.findOne({ name: name });
    if (existcollege) {
      return res.status(200).json({
        data: {
          status: false,
          msg: "College exist already.",
        },
      });
    }

    const college = new collegeModel({
      name: name,
      about: about,
      address: address,
      photo: ""
    });
    const savedCollege = await college.save();
    //console.log(savedCollege._id);
    // const upoc = await POCModel.findOneAndUpdate({ _id: poc }, { allocated_college: savedCollege._id });
    return res.status(200).json({
      data: {
        status: true,
        msg: "College added sucessfully...",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: {
        status: false,
        msg: err,
      },
    });
  }
};

const addPOC = async (req, res) => {
  const { email, mobileNo, college, userType } = req.body;
  // Generate a random username with a maximum length of 7 characters
  console.log("email", email);
 
    const existingUser = await POCModel.findOne({ email: email });
    const existingUser2 = await HodModel.findOne({ email: email });
    const existingUser3 = await AuthModel.findOne({ email: email });
    if(existingUser || existingUser2 || existingUser3){
      return res.send({
        data: {
          status: false,
          msg: "Email already exist...",
        },
      });
    }

  function generateRandomUsername() {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let username = "";
    const usernameLength = 7
    for (let i = 0; i < usernameLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      username += characters[randomIndex];
    }
    return username;
  }

  // Generate a random password with a maximum length of 8 characters
  function generateRandomPassword() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    const passwordLength = 8 // Random length between 1 and 8
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  // Check if the generated username is unique
  async function isUsernameUnique(username) {
    const existingUser = await POCModel.findOne({ username: username });
    const existingUser2 = await HodModel.findOne({ username: username });
    const existingUser3 = await AuthModel.findOne({ username: username });
    return !existingUser && !existingUser2 && !existingUser3;
  }

  

  // Check if the generated password is unique
  async function isPasswordUnique(password) {
    const existingUser = await POCModel.findOne({ password: password });
    return !existingUser;
  }

  // Generate a unique username
  async function generateUniqueUsername() {
    let username = generateRandomUsername();
    while (!(await isUsernameUnique(username))) {
      username = generateRandomUsername();
    }
    return username;
  }

  // Generate a unique password
  async function generateUniquePassword() {
    let password = generateRandomPassword();
    while (!(await isPasswordUnique(password))) {
      password = generateRandomPassword();
    }
    return password;
  }
  const username = await generateUniqueUsername();
  const password = await generateUniquePassword();

  console.log("college", college);
  if (userType !== "admin") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Not have permission to do this task.",
      },
    });
  }
  const existpoc = await POCModel.findOne({ username: username });
  if (existpoc) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "use same other username...",
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const poc = new POCModel({
    username: username,
    password: hashedPassword,
    email: email,
    mobileNo: mobileNo,
    College: college,
  });
  await poc.save();

  sendmail(email, username, password, "POC");
  return res.status(200).json({
    data: {
      status: 200,
      msg: "Poc Created Successfully.",
    },
  });
};

const getAllCollegesAdmin = async (req, res) => {
  const { page, rows } = req.body;
  const currentPage = page + 1;
  console.log(page, rows);
  const offset = Math.ceil((currentPage - 1) * rows);
  const Hods = await collegeModel.find().sort({ time: -1 }).skip(offset).limit(rows);
  const totalColleges = await collegeModel.countDocuments();
  return res.status(200).json({
    data: {
      status: true,
      data: Hods,
      totalColleges: totalColleges,
    },
  });
};

const searchCollege = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the query parameters

    const faculties = await collegeModel.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { about: { $regex: ".*" + search + ".*", $options: "i" } },
        { address: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    res.status(200).send({ success: true, faculties });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getPocAdmin = async (req, res) => {
  const { page, rows } = req.body;
  const currentPage = page + 1;
  console.log(page, rows);
  // const skip = (currentPage - 1) * rows;
  const offset = Math.ceil((currentPage - 1) * rows);
  const pocS = await POCModel.find().sort({ time: -1 }).populate("College").skip(offset).limit(rows)
  const totalColleges = await POCModel.countDocuments();
  return res.status(200).json({
    data: {
      status: true,
      data: pocS,
      totalColleges: totalColleges,
    },
  });
};

const deleteCollege = async (req, res) => {
  const { college_id, userType } = req.body;
  console.log(college_id);
  if (userType !== "admin") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Not have permission to do this task.",
      },
    });
  }

  const college = await collegeModel.findByIdAndDelete(college_id);

  if (!college) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "College not found.",
      },
    });
  }

  return res.status(200).json({
    data: {
      status: true,
      msg: "College Deleted Successfully !",
    },
  });
};

const deletePOC = async (req, res) => {
  const { poc_id, userType } = req.body;
  if (userType !== "admin") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Not Have Permission to Delete POC.",
      },
    });
  }

  const collge = await POCModel.findByIdAndDelete(poc_id);

  if (!collge) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "POC not found.",
      },
    });
  }

  return res.status(200).json({
    data: {
      status: true,
      msg: "POC Deleted Successfully...",
    },
  });
};

const editCollege = async (req, res) => {
  try {
    const { id, name, about, address, userType } = req.body;
    if (userType !== "admin") {
      return res.status(200).json({
        data: {
          status: false,
          msg: "You do not have permission to perform this action.",
        },
      });
    }

    const existingCollege = await collegeModel.findById(id);
    if (!existingCollege) {
      return res.status(200).json({
        data: {
          status: false,
          msg: "College not found.",
        },
      });
    }
    if (
      existingCollege.name === name &&
      existingCollege.about === about &&
      existingCollege.address === address
    ) {
      return res.status(200).json({
        data: {
          status: true,
          msg: "No Changes In College Details.",
        },
      });
    }
    existingCollege.name = name;
    existingCollege.about = about;
    existingCollege.address = address;

    const updatedCollege = await existingCollege.save();

    return res.status(200).json({
      data: {
        status: true,
        msg: "College Updated Successfully.",
        updatedCollege: updatedCollege,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      data: {
        status: false,
        msg: "Error occurred while updating college.",
      },
    });
  }
};

const editPoc = async (req, res) => {
  try {
    const { id, email, phone, college, userType } = req.body;
    console.log(id, email, phone, college, userType);
    if (userType !== "admin") {
      return res.status(200).json({
        data: {
          status: false,
          msg: "You do not have permission to perform this action.",
        },
      });
    }
    const existingPoc = await POCModel.findById(id);
    if (!existingPoc) {
      return res.status(200).json({ error: "POC not found" });
    }
    if (
      existingPoc.email === email &&
      existingPoc.mobileNo === phone &&
      existingPoc.College === `new ObjectId('${college}')`
    ) {
      return res.status(200).json({
        data: {
          status: true,
          msg: "No Changes In POC Details.",
        },
      });
    }

    existingPoc.email = email;
    existingPoc.mobileNo = phone;
    existingPoc.College = college;

    const updatedPoc = await existingPoc.save();
    return res.status(200).json({
      data: { status: true, msg: "POC Updated Successfully", updatedPoc },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: { status: false, msg: "Error occurred while updating POC." },
    });
  }
};

const searchPoc = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the query parameters
    console.log(search);
    const poc = await POCModel.find({
      $or: [
        { username: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });
    console.log("poc", poc);

    res.status(200).send({ success: true, poc });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getTotalCount = async (req, res) => {
  try {
    const totalCountCollege = await collegeModel.countDocuments();
    const totalCountStudents = await authModel.countDocuments();
    const totalCountPoc = await POCModel.countDocuments();
    const totalCountHod = await hodModel.countDocuments();
    res.send({ totalCountCollege, totalCountStudents, totalCountPoc, totalCountHod });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getcolleges = async (req, res) => {
  try {
    const data = await collegeModel.find({})
    res.send({
      data,
      status: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};



module.exports = {
  addCollege,
  addPOC,
  getAllCollegesAdmin,
  searchCollege,
  getPocAdmin,
  deleteCollege,
  deletePOC,
  editCollege,
  editPoc,
  searchPoc,
  getTotalCount,
  getcolleges
};
