import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import photo from "./loginImage.png";
import axios from "axios";
import themeHook from "../Context";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

function New_login() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { userDetails, setUserDetails, setToken } = themeHook();
  const navigate = useNavigate();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const hadlesubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${VITE_BACKEND_API}/api/auth/login`, {
        username,
        password,
      });

      if (response.data.data.status) {
        const { existuser, token } = response.data.data;
        setUserDetails(existuser);
        Cookies.set("token", token);
        localStorage.setItem("userDetails", JSON.stringify(existuser));
        setToken(token);

        switch (existuser.userType) {
          case "student":
            navigate("/visit");
            break;
          case "admin":
            navigate("/Admin/Dashboard");
            break;
          case "poc":
            navigate("/Poc/Dashboard");
            break;
          case "HOD":
            navigate("/Hod/Dashboard");
            break;
        }
      } else {
        toast.error(response.data.data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setusername("");
    setpassword("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Image Section */}
      <div className="md:w-[50%] h-[40%] md:h-[100%] w-full p-2 flex justify-center items-center">
        <img
          src={photo}
          alt="Login"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Form Section */}
      <div className="md:w-[35%] w-full h-[60%] md:h-full flex flex-col justify-center items-start p-4 sm:p-6">
        <h1 className="text-xl">
          Welcome To <br />
          <span className="text-green-600 dark:text-green-400 text-3xl font-bold">
            PolyConnectHub
          </span>
        </h1>

        <form onSubmit={hadlesubmit} className="w-full flex flex-col gap-3">
          <label className="font-semibold mt-2">USERNAME</label>
          <input
            type="text"
            className="border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-2 focus:outline-none"
            placeholder="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />

          <label className="font-semibold">PASSWORD</label>
          <input
            type="password"
            className="border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-2 focus:outline-none"
            placeholder="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          <section className="flex flex-col justify-center items-center mt-4 gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2 w-full transition-colors">
              Login
            </button>
            <Link
              to={"/SignUp"}
              className="text-blue-500 hover:underline text-sm"
            >
              Register
            </Link>
          </section>
        </form>
      </div>
    </div>
  );
}

export default New_login;
