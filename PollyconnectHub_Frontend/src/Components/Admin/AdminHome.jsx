import React, { useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import themeHook from "../Context";
import { Outlet, useNavigate } from "react-router-dom";

function AdminHome() {
  const { sidebarvalue, userDetails, theme } = themeHook();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails?.userType !== "admin") {
      navigate("/");
    }
  }, [userDetails]);

  return (
    <div className={`${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-100 text-black"} w-full min-h-screen`}>
      <Navbar />
      <div className="grid grid-col-1 min-[900px]:grid-cols-[20%_auto]">
        <div className={`${theme === "dark" ? "bg-slate-950" : "bg-white"} hidden min-[900px]:block h-[94vh]`}>
          <Sidebar />
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
