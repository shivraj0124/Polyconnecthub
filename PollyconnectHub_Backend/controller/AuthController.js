const AuthModel = require("../model/Auth");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const DepartmentModel = require("../model/department");
const ProjectModel = require("../model/projects");
const HodModel = require("../model/hod");
const pocModel = require("../model/poc");
const Subscribers = require('../model/Subscribe');

dotenv.config();
const jwtkey = process.env.jwt_key;
console.log(jwtkey);

const test = async (req, res) => {
  const user = req.user;
  console.log(user);
  res.send("done");
};

const authLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existuser = await AuthModel.findOne({ username: username });
    if (!existuser) {
      const existpoc = await pocModel.findOne({ username: username });
      if (!existpoc) {
        const Hod = await HodModel.findOne({ username: username });
        if (!Hod) {
          return res.status(200).json({
            data: {
              status: false,
              msg: "username or password is invalid...",
            },
          });
        }

        const match = await bcrypt.compare(password, Hod.password);
        if (match) {
          const data = {
            id: Hod._id,
            name: Hod.username,
            email: Hod.email,
            type: "HOD",
          };
          const token = jwt.sign(data, jwtkey);
          return res.status(200).json({
            data: {
              status: true,
              msg: "HOD login sucessful...",
              token: token,
              existuser: Hod,
            },
          });
        }
      } else {
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
              existuser: existpoc,
            },
          });
        }
      }

      return res.status(200).json({
        data: {
          status: false,
          msg: "username or password is invalid",
        },
      });
    }

    const match = await bcrypt.compare(password, existuser.password);
    if (match) {
      const data = {
        id: existuser._id,
        name: existuser.username,
        email: existuser.email,
        type: existuser.userType,
      };
      const token = jwt.sign(data, jwtkey);
      return res.status(200).json({
        data: {
          status: true,
          msg: "login sucessful...",
          token: token,
          existuser: existuser,
        },
      });
    }

    return res.status(200).json({
      data: {
        status: false,
        msg: "username or password is invalid",
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

const authSignup = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      userType,
      mobileNo,
      fullName,
      allocated_college,
      allocated_department,
    } = req.body;

    const userexist = await AuthModel.findOne({ username: username });
    if (userexist) {
      return res.status(200).json({
        data: {
          status: false,
          msg: "Username Already Exists",
        },
      });
    }
    const emailExist = await AuthModel.findOne({ email: email });
    if (emailExist) {
      return res.status(200).json({
        data: {
          status: false,
          msg: "Email Already Exists",
        },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AuthModel({
      username: username,
      password: hashedPassword,
      fullName: fullName,
      email: email,
      userType: userType,
      mobileNo: mobileNo,
      allocated_college: allocated_college,
      allocated_department: allocated_department,
    });
    await user.save();

    return res.status(200).json({
      data: {
        status: 200,
        msg: "Account Created Successfully",
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

const getDepartment = async (req, res) => {
  const { college_id } = req.body;
  console.log(college_id);
  const Dept = await DepartmentModel.find({ college: college_id });
  return res.status(200).json({
    data: {
      status: true,
      data: Dept,
    },
  });
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({
      isActive: "true",
      userType: "Student",
    }).sort({ time: -1 })
      .populate("allocated_college")
      .populate("allocated_department")
      .populate("created_By");

    return res.status(200).json({
      data: {
        status: true,
        data: projects,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      data: {
        status: false,
        msg: "Internal server error",
      },
    });
  }
};

const getuserproject = async (req, res) => {

  try {
    const { user } = req.body
    const data = await ProjectModel.find({ created_By: user }).sort({ time: -1 });
    return res.status(200).json({
      data
    });
  } catch (error) {
    console.log(error)
  }
}

const getSingleUser = async (req, res) => {
  try {
    const { user } = req.body;
    console.log(user)
    const data = await AuthModel.findById(user)
      .populate("allocated_college")
      .populate("allocated_department");
      
    console.log(data);
    return res.status(200).json({ data });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const viewProjects = async (req, res) => {

  try {
    const { user } = req.body
    const data = await ProjectModel.find({ created_By: user,isActive:true }).sort({ time: -1 });
    return res.status(200).json({
      data
    });
  } catch (error) {
    console.log(error)
  }
}

const allUsers=async (req, res) => {
  try {
    const users = await AuthModel.find({userType:"student"}).select("_id fullName username");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
}



const subscribeToCollege = async (req, res) => {
  const { studentId, collegeId } = req.body;

  try {
    let subscriberDoc = await Subscribers.findOne({ collegeId });

    if (!subscriberDoc) {
      subscriberDoc = new Subscribers({
        collegeId,
        subscribers: [{ studentId, subscribedDate: new Date() }]
      });
    } else {
      const alreadySubscribed = subscriberDoc.subscribers.some(
        (s) => s.studentId.toString() === studentId
      );

      if (alreadySubscribed) {
        return res.status(400).json({ message: "Already subscribed to this college." });
      }

      subscriberDoc.subscribers.push({ studentId, subscribedDate: new Date() });
    }

    await subscriberDoc.save();
    res.status(200).json({ message: "Successfully subscribed!" });

  } catch (err) {
    res.status(500).json({ message: "Subscription failed", error: err.message });
  }
};

module.exports = {
  authLogin,
  authSignup,
  test,
  getDepartment,
  getAllProjects,
  getuserproject,
  getSingleUser,
  viewProjects,
  allUsers,
  subscribeToCollege
};
