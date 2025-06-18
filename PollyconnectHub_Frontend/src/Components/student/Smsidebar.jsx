import React from "react";
import { BiHome } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";
import { BiUserCircle } from "react-icons/bi";
import { GoProjectSymlink } from "react-icons/go";
import themeHook from "../Context";
import { Link } from "react-router-dom";

function Smsidebar() {
  const { sidebarvalue, setsidebarvalue, userDetails } = themeHook();

  const handleItemClick = (e) => {
    const value = e.target.textContent.trim();
    setsidebarvalue(value);
    console.log("state", sidebarvalue);
  };

  return (
    <div className="flex flex-row w-full overflow-x-auto justify-between bg-white dark:bg-[#121212] text-black dark:text-white dark:border-none border-t border-gray-300  py-2 px-1">
      <ul className="flex flex-row w-full gap-2">
        <Link
          to={"/visit"}
          className={`${
            sidebarvalue === "Home"
              ? "bg-gray-200 dark:bg-gray-700 text-green-600"
              : ""
          } hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer grid grid-cols-[auto_1fr] gap-2 px-4 py-2 font-semibold rounded-lg`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <BiHome size={22} />
          </div>
          <div>Home</div>
        </Link>

        <Link
          to={"/college"}
          className={`${
            sidebarvalue === "College"
              ? "bg-gray-200 dark:bg-gray-700 text-green-600"
              : ""
          } hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer grid grid-cols-[auto_1fr] gap-2 px-4 py-2 font-semibold rounded-lg`}
          onClick={handleItemClick}
        >
          <div className="flex items-center">
            <IoSchoolOutline size={22} />
          </div>
          <div>College</div>
        </Link>

        {userDetails?.userType === "student" && (
          <Link
            to={"/StudentProjects"}
            className={`${
              sidebarvalue === "Students Projects"
                ? "bg-gray-200 dark:bg-gray-700 text-green-600"
                : ""
            } hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer grid grid-cols-[auto_1fr] gap-2 px-4 py-2 font-semibold rounded-lg`}
            onClick={handleItemClick}
          >
            <div className="flex items-center">
              <GoProjectSymlink size={22} />
            </div>
            <div>Projects</div>
          </Link>
        )}

        {userDetails?.userType === "student" && (
          <Link
            to={"/profile"}
            className={`${
              sidebarvalue === "Profile"
                ? "bg-gray-200 dark:bg-gray-700 text-green-600"
                : ""
            } hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer grid grid-cols-[auto_1fr] gap-2 px-4 py-2 font-semibold rounded-lg`}
            onClick={handleItemClick}
          >
            <div className="flex items-center">
              <BiUserCircle size={22} />
            </div>
            <div>Profile</div>
          </Link>
        )}
      </ul>
    </div>
  );
}

export default Smsidebar;
