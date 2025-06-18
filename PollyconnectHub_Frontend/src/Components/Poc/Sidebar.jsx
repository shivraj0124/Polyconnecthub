import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import themeHook from "../Context";
import { Link, useNavigate } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import { LuSchool2 } from "react-icons/lu";
import { LiaUserEditSolid } from "react-icons/lia";
import { BsBuildings } from "react-icons/bs";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function Sidebar({ data }) {
  const { sidebarvalue, setsidebarvalue, userDetails, setUserDetails, token, setToken, theme } = themeHook();
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
    <div className={`flex flex-col border dark:border-none w-full p-4 h-full justify-between ${theme === 'dark' ? 'dark:bg-slate-950 text-white' : 'bg-white text-black'}`}>
      <ul className="flex flex-col w-full gap-2">
        <Link
          to={"/POC/Dashboard"}
          className={`${
            sidebarValue2 === "Dashboard" ? "dark:bg-slate-600 text-green-500" : ""
          } hover:bg-slate-200 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg dark:hover:bg-slate-700 `}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <RxDashboard size={22} />
          </div>
          <div>Dashboard</div>
        </Link>

        <Link
          to={"/POC/DepartmentDetails"}
          className={`${
            sidebarValue2 === "Departments Details" ? "dark:bg-slate-600 text-green-500" : ""
          } hover:bg-slate-200 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg dark:hover:bg-slate-700 `}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <BsBuildings size={22} />
          </div>
          <div>Departments Details</div>
        </Link>

        <Link
          to={"/POC/HodDetails"}
          className={`${
            sidebarValue2 === "Hod Details" ? "dark:bg-slate-600 text-green-500" : ""
          } hover:bg-slate-200 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg dark:hover:bg-slate-700 `}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <LiaUserEditSolid size={22} />
          </div>
          <div>Hod Details</div>
        </Link>

        <Link
          to={"/POC/CollegeInfo"}
          className={`${
            sidebarValue2 === "College Details" ? "dark:bg-slate-600 text-green-500" : ""
          } hover:bg-slate-200 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg dark:hover:bg-slate-700 `}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <LuSchool2 size={22} />
          </div>
          <div>College Details</div>
        </Link>
      </ul>

      <div className="flex flex-col gap-1 bg-bgwhite rounded-lg p-3 mb-10 dark:bg-slate-800">
        <section className="flex gap-2 justify-center items-center">
          <FaUserCircle className="text-darkgreen" size={40} />
          <section>
            <p className="font-semibold text-lg">{userDetails?.username}</p>
          </section>
        </section>
        <p className="text-[12px] text-gray-400 text-center">{userDetails?.email}</p>
        <button
          onClick={handleLogOut}
          className="bg-buttongreen bg-opacity-30 w-full text-green-600 px-4 py-[5px] font-semibold rounded-full mt-5 dark:bg-slate-700 dark:text-green-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
