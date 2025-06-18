import React, { useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import themeHook from "../Context";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function PocHome() {
  const { sidebarvalue, userDetails } = themeHook()
  const navigate = useNavigate();
  useEffect(() => {
    if (userDetails?.userType !== "poc") {
      navigate("/");
    }
  }, [userDetails]);
  return (
    <div className=" w-full max-h-screen">
      <Navbar />
      <div className=" grid grid-col-1 min-[900px]:grid-cols-[20%_auto]">
        <div className=" bg-white dark:bg-slate-950 hidden min-[900px]:block">
          <Sidebar />
        </div>
        <div className="dark:bg-slate-900 h-[92vh]">
          <Outlet />
        </div>
        {/* <div className=' hidden min-[900px]:block'>
                    <Outlet />
                </div> */}
      </div>
    </div>
  );
}

export default PocHome;
