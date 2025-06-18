const collegeModel = require("../model/College");
const POCModel = require("../model/poc");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const DepartmentModel = require("../model/department");
const HODModel = require("../model/hod");
const AuthModel = require("../model/Auth");
const sendmail = require("../utils/mailUtils");
const HodModel = require("../model/hod");
const cloudinary = require("../utils/imageuploadUtils");
dotenv.config();
const jwtkey = process.env.jwt_key;
const { validationResult, body } = require("express-validator");
const getPoc = async (req, res) => {
  try {
    const POC = await POCModel.find();
    return res.status(200).json({
      data: {
        status: true,
        data: POC,
      },
    });
  } catch (err) {
    return res.status(400).json({
      data: {
        status: false,
        data: err,
      },
    });
  }
};

const getPocById = async (req, res) => {
  try {
    const { id } = req.params; // get id from URL params
    const POC = await POCModel.findById(id);

    if (!POC) {
      return res.status(404).json({
        data: {
          status: false,
          message: "POC not found",
        },
      });
    }

    return res.status(200).json({
      data: {
        status: true,
        data: POC,
      },
    });
  } catch (err) {
    return res.status(400).json({
      data: {
        status: false,
        message: "Invalid POC ID or server error",
        error: err.message,
      },
    });
  }
};


const addCollegeInfo = async (req, res) => {
  const user = req.user;
  if (user.type != "POC") {
    return res.status(403).json({
      data: {
        status: false,
        msg: "No access to do this...",
      },
    });
  }

  try {
    const { college_id, name, about, address } = req.body;
    const college = await collegeModel.findOneAndUpdate(
      { _id: college_id },
      { name: name, about: about, address: address, poc: user._id }
    );
    return res.status(200).json({
      data: {
        status: true,
        msg: "updated suceessfully..",
      },
    });
  } catch (err) {
    return res.status(400).json({
      data: {
        status: false,
        msg: err,
      },
    });
  }
};

const POClogin = async (req, res) => {
  const { username, password } = req.body;
  console.log("Hello", username, password);
  const existpoc = await POCModel.findOne({ username: username });
  if (!existpoc) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "username or password are invalid.",
      },
    });
  }

  const match = await bcrypt.compare(password, existpoc.password);
  if (match) {
    const data = {
      id: existpoc._id,
      name: existpoc.username,
      email: existpoc.email,
      College: existpoc.College,
      type: "poc",
    };
    const token = jwt.sign(data, jwtkey);
    return res.status(200).json({
      data: {
        status: true,
        msg: "POC Logged In Successfully",
        token: token,
        pocDetails: existpoc,
      },
    });
  }
  return res.status(400).json({
    data: {
      status: false,
      msg: "username or password is invalid.",
    },
  });
};

const addDepartmentPoc = async (req, res) => {
  const { name, about, college, userType } = req.body;
  if (userType != "poc") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "No access to do this...",
      },
    });
  }
  const existdpt = await DepartmentModel.findOne({
    name: name,
    college: college,
  });
  if (existdpt) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Department Already Exist....",
      },
    });
  }

  const department = new DepartmentModel({
    name: name,
    about: about,
    college: college,
  });

  const savedDpt = await department.save();

  return res.status(200).json({
    data: {
      status: true,
      msg: "Department Added Successfully.",
    },
  });
};

const editDepartmentPoc = async (req, res) => {
  try {
    const { id, name, about, userType } = req.body;
    console.log(id, name, about, userType);
    if (userType !== "poc") {
      return res.status(200).json({
        data: {
          status: false,
          msg: "You do not have permission to perform this action.",
        },
      });
    }
    const existingDep = await DepartmentModel.findById(id);
    if (!existingDep) {
      return res.status(200).json({ error: "Department not found" });
    }
    if (existingDep.name === name && existingDep.about === about) {
      return res.status(200).json({
        data: {
          status: true,
          msg: "No Changes In Department Details.",
        },
      });
    }

    existingDep.name = name;
    existingDep.about = about;

    const updatedDep = await existingDep.save();
    return res.status(200).json({
      data: {
        status: true,
        msg: "Department Updated Successfully",
        updatedDep,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: { status: false, msg: "Error occurred while updating POC." },
    });
  }
};

// const addHOD = async (req, res) => {
//     const { username, password, email, mobileNo, userType } = req.body;

//   if (userType != "poc") {
//     return res.status(200).json({
//       data: {
//         status: false,
//         msg: "No access to do this...",
//       },
//     });
//   }

//   const existhod = await HODModel.findOne({ username: username });
//   if (existhod) {
//     return res.status(200).json({
//       data: {
//         status: false,
//         msg: "use same other username...",
//       },
//     });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const hod = new HODModel({
//     username: username,
//     password: hashedPassword,
//     email: email,
//     mobileNo: mobileNo,
//     allocated_college: allocated_college,
//     userType: "HOD",
//     allocated_department: null,
//   });
//   await hod.save();

//   sendmail(email, username, password, "HOD");

//   return res.status(200).json({
//     data: {
//       status: 200,
//       data: "created sucessfully...",
//     },
//   });
// };
const addHOD = async (req, res) => {
  const { email, mobileNo, allocated_college, allocated_department, userType } =
    req.body;
  console.log(
    email,
    mobileNo,
    allocated_college,
    allocated_department,
    userType
  );
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
  // Generate a random username with a maximum length of 7 characters
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

  function generateRandomPassword() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    const passwordLength = 8
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
    const existingUser = await HODModel.findOne({ password: password });
    const existingUser2 = await POCModel.findOne({ password: password });
    return !existingUser && !existingUser2;
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

  if (userType !== "poc") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Not have permission to do this task.",
      },
    });
  }
  const exitHod = await HODModel.findOne({ username: username });
  if (exitHod) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "use same other username...",
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const hod = new HODModel({
    username: username,
    password: hashedPassword,
    email: email,
    mobileNo: mobileNo,
    allocated_college: allocated_college,
    userType: "HOD",
    allocated_department: allocated_department,
  });

  await hod.save();
  const hodId = hod._id;
  let hodTEst = await DepartmentModel.findOneAndUpdate(
    { _id: allocated_department }, // Assuming department name is used for identification
    { $set: { hod: hodId } },
    { new: true }
  );
  console.log(hodTEst);
  sendmail(email, username, password, "HOD");
  return res.status(200).json({
    data: {
      status: 200,
      msg: "Hod Created Successfully.",
    },
  });
};

const getOnePOC = async (req, res) => {
  const { poc } = req.body;
  const data = await POCModel.find({ _id: poc });
  return res.status(200).json({
    data: {
      status: true,
      data: data,
    },
  });
};

const deleteDPT = async (req, res) => {
  const { dpt_id, userType } = req.body;
  if (userType != "poc") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Not have permission to do this task.",
      },
    });
  }

  const dept = await DepartmentModel.findByIdAndDelete(dpt_id);

  if (!dept) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Department not found.",
      },
    });
  }

  return res.status(200).json({
    data: {
      status: true,
      msg: "Department Deleted Successfully",
    },
  });
};

const deleteHOD = async (req, res) => {
  const { hod_id, userType } = req.body;
  const user = req.user;
  if (userType != "poc") {
    return res.status(200).json({
      data: {
        status: false,
        msg: "Not have permission to do this task.",
      },
    });
  }

  const collge = await HODModel.findByIdAndDelete(hod_id);

  if (!collge) {
    return res.status(200).json({
      data: {
        status: false,
        msg: "HOD not found.",
      },
    });
  }

  return res.status(200).json({
    data: {
      status: true,
      msg: "delete sucessfully...",
    },
  });
};
const getAllHod = async (req, res) => {
  const { page, rows, college } = req.body;
  const currentPage = page + 1;
  console.log(page, rows);
  const offset = Math.ceil((currentPage - 1) * rows);
  const Hod = await HodModel.find({ allocated_college: college }).sort({ time: -1 })
    .populate("allocated_college")
    .populate("allocated_department")
    .skip(offset)
    .limit(rows);
  const totalHods = await HodModel.countDocuments({
    allocated_college: college,
  });
  return res.status(200).json({
    data: {
      status: true,
      data: Hod,
      totalHods,
    },
  });
};
const editHodPoc = async (req, res) => {
  try {
    const { id, email, mobileNo, userType } = req.body;
    console.log(id, email, mobileNo, userType);
    if (userType !== "poc") {
      return res.status(200).json({
        data: {
          status: false,
          msg: "You do not have permission to perform this action.",
        },
      });
    }
    const existingDep = await HodModel.findById(id);
    if (!existingDep) {
      return res.status(200).json({ error: "Hod not found" });
    }
    if (existingDep.email === email && existingDep.mobileNo === mobileNo) {
      return res.status(200).json({
        data: {
          status: true,
          msg: "No Changes In Hod Details.",
        },
      });
    }

    (existingDep.email = email), (existingDep.mobileNo = mobileNo);

    const updatedDep = await existingDep.save();
    return res.status(200).json({
      data: {
        status: true,
        msg: "Hod Updated Successfully",
        updatedDep,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: { status: false, msg: "Error occurred while updating POC." },
    });
  }
};

const editCollegeInfo = async (req, res) => {
  try {
    const { id, name, about, address, photo, userType } = req.body;
    if (userType !== "poc") {
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
    if (photo !== null && photo !== undefined && photo !== "") {
      const imageUrl = await cloudinary.uploader.upload(photo);
      existingCollege.photo = imageUrl.secure_url;
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

const getOneCollege = async (req, res) => {
  const { college_id } = req.body;
  const data = await collegeModel.find({ _id: college_id });
  return res.status(200).json({
    data: {
      status: true,
      data: data,
    },
  });
};

const pocDashboardDetails = async (req, res) => {
  try {
    const { poc_id, college_id } = req.body;
    const totalDepartments = await DepartmentModel.countDocuments({
      college: college_id,
    });
    const totalHod = await HodModel.countDocuments({
      allocated_college: college_id,
    });
    const data = await POCModel.find({
      _id: poc_id,
      College: college_id,
    }).populate("College");
    res.send({ totalHod, totalDepartments, pocData: data });
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

const searchDepartment = async (req, res) => {
  try {
    const { college, search } = req.body;
    // const { search } = req.query; // Get the search query from the query parameters
    console.log(college, search);

    const department = await DepartmentModel.find({
      college: college,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { about: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    res.status(200).send({ success: true, department });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
const searchHod = async (req, res) => {
  try {
    const { allocated_college, search } = req.body;
    // const { search } = req.query; // Get the search query from the query parameters
    console.log(allocated_college, search);

    const hod = await HodModel.find({
      allocated_college: allocated_college,
      $or: [
        { username: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    res.status(200).send({ success: true, hod });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};



const updateP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username,  email, mobileNo } = req.body;
  const pocId = req.params.id;

  try {
    let poc = await POCModel.findById(pocId);
    if (!poc) {
      return res.status(404).json({ error: "POC not found" });
    }

    let updateData = {};

    // Check if the username is changed and validate uniqueness
    if (username && username.trim() !== poc.username) {
      let existingUser = await POCModel.findOne({ username: username.trim() });
      if (existingUser && existingUser._id.toString() !== pocId) {
        return res.status(400).json({ error: "Username already exists" });
      }
      updateData.username = username.trim();
    }

    // Check if the email is changed and validate uniqueness
    if (email && email.trim() !== poc.email) {
      let existingEmail = await POCModel.findOne({ email: email.trim() });
      if (existingEmail && existingEmail._id.toString() !== pocId) {
        return res.status(400).json({ error: "Email already exists" });
      }
      updateData.email = email.trim();
    }

    // Update mobile number if changed
    if (mobileNo && mobileNo !== poc.mobileNo) {
      updateData.mobileNo = mobileNo;
    }

    

    // If no changes, return without updating
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No changes detected" });
    }

    // Update POC details
    const updatedPoc = await POCModel.findByIdAndUpdate(pocId, { $set: updateData }, { new: true });

    res.json({ message: "POC updated successfully", updatedPoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getPoc,
  getPocById,
  addCollegeInfo,
  POClogin,
  addDepartmentPoc,
  editDepartmentPoc,
  addHOD,
  getOnePOC,
  deleteDPT,
  deleteHOD,
  getAllHod,
  editHodPoc,
  editCollegeInfo,
  getOneCollege,
  pocDashboardDetails,
  searchDepartment,
  searchHod,
  updateP
};
