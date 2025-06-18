import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { FiUserCheck } from "react-icons/fi";
import { LuSchool2 } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import themeHook from "../Context";

function Sidebar() {
  const {
    sidebarvalue,
    setsidebarvalue,
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

  const isDark = theme === "dark";

  const baseItemClass =
    "cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg";
  const hoverClass = isDark ? "hover:bg-slate-700" : "hover:bg-slate-100";
  const selectedClass = isDark
    ? "bg-slate-700 text-green-400"
    : "bg-slate-100 text-green-600";

  return (
    <div className={`flex flex-col w-full h-[90vh] p-4  justify-between ${isDark ? "bg-slate-950 text-white" : "bg-white text-black"}`}>
      <ul className="flex flex-col w-full gap-2">
        <Link
          to="/Admin/Dashboard"
          className={`${baseItemClass} ${
            sidebarValue2 === "Dashboard" ? selectedClass : ""
          } ${hoverClass}`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <RxDashboard size={22} />
          </div>
          <div>Dashboard</div>
        </Link>

        <Link
          to="/Admin/CollegeDetails"
          className={`${baseItemClass} ${
            sidebarValue2 === "College Details" ? selectedClass : ""
          } ${hoverClass}`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <LuSchool2 size={22} />
          </div>
          <div>College Details</div>
        </Link>

        <Link
          to="/Admin/PocDetails"
          className={`${baseItemClass} ${
            sidebarValue2 === "Poc Details" ? selectedClass : ""
          } ${hoverClass}`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <FiUserCheck size={22} />
          </div>
          <div>Poc Details</div>
        </Link>
      </ul>

      <div className={`flex flex-col gap-2 rounded-lg p-3 mt-8 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
        <section className="flex gap-2 justify-center items-center">
          <FaUserCircle className="text-green-500" size={40} />
          <section>
            <p className="font-semibold text-lg">Admin</p>
          </section>
        </section>
        <button
          onClick={handleLogOut}
          className="dark:bg-green-900 dark:text-green-400 text-green-800  px-4 py-[5px] font-semibold rounded-full mt-4 hover:bg-green-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
