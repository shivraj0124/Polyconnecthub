import React, { useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import signUpImage from "./signupImage.png";
import axios from "axios";
import toast from "react-hot-toast";
import themeHook from "./Context";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function SignUp() {
  const { findForm, setFindForm } = themeHook();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [showdept, setshowdept] = useState(false);
  const [dept, setdepts] = useState([]);
  const [selecteddep, setselecteddep] = useState("");
  const navigate = useNavigate();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const validateFullName = (name) => /^[a-zA-Z\s]*$/.test(name);
  const validateMobile = (number) => /^\d{10}$/.test(number);
  const validatePassword = (pass) => pass.length >= 8;

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateFullName(fullName)) return toast.error("Enter a valid full name");
    if (!validateMobile(mobile)) return toast.error("Enter a valid mobile number");
    if (!validatePassword(password)) return toast.error("Password must be at least 8 characters");

    try {
      const result = await axios.post(`${VITE_BACKEND_API}/api/auth/signup`, {
        username: userName,
        password,
        fullName,
        email,
        userType: "student",
        mobileNo: mobile,
        allocated_college: selectedCollege,
        allocated_department: selecteddep,
      });

      if (result.data.data.status === 200) {
        toast.success(result.data.data.msg);
        navigate("/Login");
      } else {
        toast(result.data.data.msg, {
          icon: "⚠",
          iconTheme: { primary: "#facc15", secondary: "#fff" },
        });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getAllColleges = async () => {
    try {
      const result = await axios.get(`${VITE_BACKEND_API}/api/college/getAllColleges`);
      setCollegeList(result.data.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getdept = async (id) => {
    try {
      const result = await axios.post(`${VITE_BACKEND_API}/api/auth/getDepartment`, {
        college_id: id,
      });
      setdepts(result.data.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllColleges();
  }, [findForm]);

  return (
    <div className="h-screen flex justify-center items-center bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-y-auto">
      <div className="flex flex-row fixed bg-white dark:bg-slate-800 shadow-xl rounded-md max-md:w-[90%] justify-center items-center w-max h-max py-4 px-5">
        <div className="max-md:hidden w-[40%]">
          <img className="h-max w-[500px]" src={signUpImage} />
        </div>

        <div className="flex flex-col justify-center items-center px-4 w-full sm:w-[60%] my-auto overflow-y-auto h-[85vh]">
          <h1 className="font-semibold text-xl underline underline-offset-4 text-center">
            Student Registration
          </h1>
          <form className="flex flex-col w-full py-3" onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col w-[50%]">
                  <label className="mt-2">Full Name</label>
                  <input
                    type="text"
                    className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                    placeholder="Enter Your Full Name"
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col w-[50%]">
                  <label className="mt-2">Mobile No.</label>
                  <input
                    type="tel"
                    className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                    placeholder="Enter Your Mobile No."
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mt-2">Email</label>
              <input
                type="email"
                className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mt-2">College Name</label>
              <select
                className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                value={selectedCollege}
                onChange={(e) => {
                  setSelectedCollege(e.target.value);
                  setshowdept(true);
                  getdept(e.target.value);
                }}
              >
                <option value="">Select Your College</option>
                {collegeList.map((item, idx) => (
                  <option key={idx + 1} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {showdept && (
              <div className="flex flex-col">
                <label className="mt-2">Select Department</label>
                <select
                  className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                  value={selecteddep}
                  onChange={(e) => setselecteddep(e.target.value)}
                >
                  <option value="">Select Your Department</option>
                  {dept.map((item, idx) => (
                    <option key={idx + 1} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col">
              <label className="mt-2">Username</label>
              <input
                type="text"
                className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                placeholder="Enter Your Username"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col relative">
              <label className="mt-2">Password</label>
              <input
                type="password"
                className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none placeholder:text-sm"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Optional: Password toggle (uncomment if needed)
              <div className="absolute top-7 right-3">
                {eye ? (
                  <FaEyeSlash size={20} onClick={() => setEye(false)} />
                ) : (
                  <FaEye size={20} onClick={() => setEye(true)} />
                )}
              </div>
              */}
            </div>

            <Button
              variant="contained"
              type="submit"
              style={{ backgroundColor: "#22c55e", marginTop: "16px" }}
            >
              Submit
            </Button>

            <h2 className="text-center mt-5">
              Already have an account?{" "}
              <Link
                className="text-blue-500 hover:underline"
                onClick={() => setFindForm("Student")}
                to="/Login"
              >
                Login
              </Link>
            </h2>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
