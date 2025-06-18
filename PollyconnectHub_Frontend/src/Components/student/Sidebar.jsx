import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { BiHome, BiUserCircle } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";
import { GoProjectSymlink } from "react-icons/go";
import themeHook from "../Context";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function Sidebar({ data }) {
  const {
    sidebarvalue,
    setsidebarvalue,
    userDetails,
    token,
    setToken,
    setUserDetails,
    loadingMain,
    setLoadingMain,
  } = themeHook();

  const navigate = useNavigate();

  const handleItemClick = (e) => {
    const value = e.target.textContent.trim();
    setsidebarvalue(value);
  };

  const handleLogOut = async () => {
    setLoadingMain(true);
    try {
      setUserDetails(null);
      localStorage.removeItem("userDetails");
      localStorage.removeItem("userType");
      if (token) {
        Cookies.remove("token");
        setToken("");
      }
      toast.success("Logout Successfully");
      window.location.reload();
    } catch (err) {
      toast.error("Something went wrong!");
    }
    setLoadingMain(false);
  };

  const linkClasses = (label) =>
    `hover:bg-green-100 dark:hover:bg-green-800 cursor-pointer grid grid-cols-[auto_1fr] gap-4 px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${
      sidebarvalue === label
        ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-white"
        : "text-black dark:text-white"
    }`;

  return (
    <div className="flex flex-col  h-[93vh] w-full p-4 justify-between  dark:bg-slate-950">
      <ul className="flex flex-col max-md:flex-row w-full gap-2">
        <Link to="/visit" className={linkClasses("My Home")} onClick={handleItemClick}>
          <div className="flex items-center">
            <BiHome size={22} />
          </div>
          <div>My Home</div>
        </Link>

        <Link to="/college" className={linkClasses("College")} onClick={handleItemClick}>
          <div className="flex items-center">
            <IoSchoolOutline size={22} />
          </div>
          <div>College</div>
        </Link>

        {userDetails?.userType === "student" && (
          <Link
            to="/StudentProjects"
            className={linkClasses("Projects")}
            onClick={handleItemClick}
          >
            <div className="flex items-center">
              <GoProjectSymlink size={22} />
            </div>
            <div>Projects</div>
          </Link>
        )}

        {userDetails?.userType === "student" && (
          <Link to="/profile" className={linkClasses("Profile")} onClick={handleItemClick}>
            <div className="flex items-center">
              <BiUserCircle size={22} />
            </div>
            <div>Profile</div>
          </Link>
        )}
      </ul>

      {userDetails && (
        <div className="flex flex-col gap-1 bg-green-100 dark:bg-slate-800 rounded-lg p-3 mb-10">
          <section className="flex gap-2 justify-center items-center">
            <FaUserCircle className="text-green-700 dark:text-green-300" size={40} />
            <section>
              <p
                className="font-semibold text-lg cursor-pointer text-green-900 dark:text-white"
                onClick={() => navigate("/Profile")}
              >
                {userDetails?.username}
              </p>
            </section>
          </section>
          <p className="text-center text-xs text-green-700 dark:text-gray-400">{userDetails.email}</p>
          <button
            onClick={handleLogOut}
            className="bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300 w-full px-4 py-[5px] font-semibold rounded-full"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
