import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { LiaUserEditSolid } from "react-icons/lia";
import { BsBuildings } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import themeHook from "../Context";
import { toast } from "react-hot-toast";
import { GoProject } from "react-icons/go";
import axios from "axios";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { GoUnverified } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
function HodDashboard() {
  const { userDetails } = themeHook();
  const [data, setData] = useState();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;
  const getAllCounts = async () => {
    try {
      const result = await axios.post(
        `${VITE_BACKEND_API}/api/hod/hodDashboardDetails`,
        {
          department_id: userDetails?.allocated_department,
          college_id: userDetails?.allocated_college,
          hod_id: userDetails?._id,
        }
      );
      console.log(result.data);
      setData(result?.data);
    } catch (err) {
      toast.error(err.message); // Use err.message to get the error message
    }
  };
  useEffect(() => {
    getAllCounts();
  }, []);
  return (
    <div className="flex flex-col w-full  h-[90vh] p-5">
      <div className="flex flex-row justify-between ">
        <div>
          <h1 className="text-lg font-semibold text-green-600">Dashboard</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 max-md:grid-cols-1 gap-10 mt-5">
        <div className="border dark:border-none dark:bg-slate-800 dark:text-white bg-white bg=[#f5f5f5] flex flex-row justify-between items-center p-4 rounded-md ">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-green-600">
              <CountUp delay={2} end={data?.totalProjects} />
            </h1>
            <h1 className="text-xl font-bold ">Projects</h1>
          </div>
          <div>
            <GoProject className="text-green-600" size={60} />
          </div>
        </div>
        <div className="border dark:border-none dark:bg-slate-800 dark:text-white  bg-white bg=[#f5f5f5] flex flex-row justify-between items-center p-4 rounded-md ">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-green-600">
              <CountUp delay={2} end={data?.activeProjects} />
            </h1>
            <h1 className="text-xl font-bold ">Verified Projects</h1>
          </div>
          <div>
            <MdOutlineVerifiedUser className="text-green-600" size={60} />
          </div>
        </div>
        <div className="border dark:border-none dark:bg-slate-800 dark:text-white  bg-white bg=[#f5f5f5] flex flex-row justify-between items-center p-4 rounded-md ">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-red-500">
              <CountUp delay={2} end={data?.inActiveProjects} />
            </h1>
            <h1 className="text-xl font-bold ">UnVerified Projects</h1>
          </div>
          <div>
            <GoUnverified className="text-red-500" size={60} />
          </div>
        </div>
        <div className="border dark:border-none dark:bg-slate-800 dark:text-white  bg-white bg=[#f5f5f5] flex flex-row justify-between items-center p-4 rounded-md ">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-green-600">
              <CountUp delay={2} end={data?.students} />
            </h1>
            <h1 className="text-xl font-bold ">Students</h1>
          </div>
          <div>
            <FaRegUser className="text-green-600" size={60} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-10  gap-10  w-max ">
        <div className="border dark:border-none dark:bg-slate-800 dark:text-white  bg-white bg=[#f5f5f5] flex flex-col justify-between items-center  text-left p-5 rounded-md  ">
          <div className="font-semibold text-green-600">Profile</div>
          <hr className=" border-1 p-1  w-[100%]" />
          <section className=" flex gap-2 justify-center items-center">
            <FaUserCircle className=" text-green-600" size={40}></FaUserCircle>
          </section>
          <section className="">
            <h1 className=" font-semibold text-2xl text-center">
              {data?.hodData[0]?.username}
            </h1>
            <h2 className="font-semibold text-xl mt-4"><span className="text-xl text-green-600 font-semibold">College : </span>
              {data?.hodData[0]?.allocated_college?.name}
            </h2>
            <h2 className="font-bold"><span className="text-xl text-green-600 font-semibold">Department : </span>
              {data?.hodData[0]?.allocated_department?.name}
            </h2>
            <h2 className="mt-3"><span className=" text-green-600 font-semibold">Mobile No : </span>{data?.hodData[0]?.mobileNo}</h2>
            <h2><span className=" text-green-600 font-semibold">Email : </span>{data?.hodData[0]?.email}</h2>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HodDashboard;
