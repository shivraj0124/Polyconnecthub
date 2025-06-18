import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import themeHook from "../Context";
import { Link, useNavigate } from "react-router-dom";
import { GoProject } from "react-icons/go";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function HodSidebar({ data }) {
  const {
    sidebarvalue,
    setsidebarvalue,
    userDetails,
    setUserDetails,
    token,
    setToken,
    theme,
  } = themeHook();

  const [sidebarValue2, setSidebarValue2] = useState("Dashboard");
  const navigate = useNavigate();

  const handleItemClick = (e) => {
    const value = e.target.textContent.trim();
    setSidebarValue2(value);
  };

  const handleLogOut = async () => {
    setUserDetails(null);
    localStorage.removeItem("userDetails");
    if (token) {
      Cookies.remove("token");
      setToken("");
    }
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col border dark:border-none w-full p-4 h-full justify-between bg-white text-black dark:bg-slate-950 dark:text-white">
      <ul className="flex flex-col w-full gap-2">
        <Link
          to={"/Hod/Dashboard"}
          className={`${
            sidebarValue2 === "Dashboard"
              ? "bg-slate-200 dark:bg-slate-800 text-green-500"
              : ""
          } hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <RxDashboard size={22} />
          </div>
          <div>Dashboard</div>
        </Link>

        <Link
          to={"/Hod/Projects"}
          className={`${
            sidebarValue2 === "Projects"
              ? "bg-slate-200 dark:bg-slate-800 text-green-500"
              : ""
          } hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <GoProject size={22} />
          </div>
          <div>Projects</div>
        </Link>
      </ul>

      <div className="flex flex-col gap-1 bg-bgwhite dark:bg-slate-800 rounded-lg p-3 mb-10">
        <section className="flex gap-2 justify-center items-center">
          <FaUserCircle className="text-green-700 dark:text-green-400" size={40} />
          <section>
            <p className="font-semibold text-lg">{userDetails?.username}</p>
          </section>
        </section>
        <span>
          <p className="text-[10px] text-center text-gray-600 dark:text-gray-400">
            {userDetails?.email}
          </p>
        </span>
        <button
          onClick={handleLogOut}
          className="bg-green-100 dark:bg-green-900 w-full text-green-700 dark:text-green-400 px-4 py-[5px] font-semibold rounded-full mt-3"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default HodSidebar;
