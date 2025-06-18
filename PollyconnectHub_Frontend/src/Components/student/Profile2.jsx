import React, { useEffect, useState } from "react";
import themeHook from "../Context";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import not_found from "./not_found.png";
import photo from "./profilebanner.jpg";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FaRegCircleUser } from "react-icons/fa6";

function Profile() {
  const { userDetails, loadingMain, setLoadingMain, setUserDetails, setToken } = themeHook();
  const [pr, setpr] = useState([]);
  const [data2, setData2] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const getuserproject = async () => {
    try {
      const { data } = await axios.post(`${VITE_BACKEND_API}/api/auth/viewProjects`, { user: id });
      const response = await axios.post(`${VITE_BACKEND_API}/api/auth/getSingleUser`, { user: id });
      setData2({
        collegeName: response?.data?.data?.allocated_college?.name,
        departmentName: response?.data?.data?.allocated_department?.name,
        userDetails: response?.data?.data,
      });
      setpr(data.data);
    } catch (error) {
      toast.error("Failed to fetch user projects.");
    }
  };

  useEffect(() => {
    getuserproject();
  }, []);

  return (
    <div className="md:h-[90vh] bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 relative">
      <img className="h-40 w-full object-cover" src={photo} />
      <div className="grid grid-cols-1 md:grid-cols-[35%_1fr] gap-4 p-4 absolute top-20 w-full md:h-[85%] dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 flex gap-2 flex-col items-center border border-slate-300 dark:border-slate-700">
          <section>
            <FaRegCircleUser size={55} className="text-green-600" />
          </section>
          <h1 className="font-semibold">{data2?.userDetails?.username}</h1>

          <div className="border w-full border-slate-300 dark:border-slate-600" />

          <div className="flex flex-col justify-center items-center gap-5 rounded-2xl w-72 mx-auto">
            {['fullName', 'email', 'mobileNo'].map((field, i) => (
              <section key={i} className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                <h1 className="text-xs font-semibold text-slate-500 dark:text-slate-300 capitalize">{field}</h1>
                <p className="text-base font-medium text-slate-800 dark:text-slate-100">
                  {data2?.userDetails?.[field]}
                </p>
              </section>
            ))}

            <section className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
              <h1 className="text-xs font-semibold text-slate-500 dark:text-slate-300">College</h1>
              <p className="text-base font-medium text-slate-800 dark:text-slate-100">{data2?.collegeName}</p>
            </section>

            <section className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
              <h1 className="text-xs font-semibold text-slate-500 dark:text-slate-300">Department</h1>
              <p className="text-base font-medium text-slate-800 dark:text-slate-100">{data2?.departmentName}</p>
            </section>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg h-full overflow-y-auto p-5">
          <h1 className="font-semibold text-green-600 dark:text-green-400">Projects</h1>
          <div className="md:p-3 flex flex-col gap-2">
            {pr.length === 0 ? (
              <div className="flex flex-col justify-center items-center font-semibold">
                <img src={not_found} className="w-40 h-40" />
                <section>No Project Found</section>
              </div>
            ) : (
              pr.map((item, index) => (
                <div key={index} className="grid grid-cols-1 min-[580px]:grid-cols-[auto_1fr] rounded-lg gap-4 justify-center bg-slate-100 dark:bg-slate-700 p-3">
                  <img
                    src={item.multimedia[0]}
                    className="w-[200px] h-[150px] max-md:w-full rounded-xl object-cover"
                  />
                  <div className="flex gap-2 flex-col justify-between">
                    <div>
                      <p className="font-semibold text-xl">
                        {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                      </p>
                    </div>
                    <div className="line-clamp-2 text-sm">
                      {item.description.charAt(0).toUpperCase() + item.description.slice(1)}
                    </div>
                    <div className="flex justify-start max-md:justify-between items-center gap-2">
                      <div className="text-xs">
                        <span className="font-semibold">Published on : </span>
                        {new Date(item.createdAt).toISOString().split("T")[0]}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-xs border border-green-400 w-28 rounded-full bg-opacity-25 px-2 py-1 text-black text-center font-semibold dark:text-white">
                        {item.type}
                      </div>
                      <div
                        onClick={() => navigate(`/project/${item._id}`)}
                        className="text-xs bg-green-700 text-white w-28 rounded-full cursor-pointer hover:bg-opacity-80 px-2 py-1 text-center font-semibold"
                      >
                        Go to Project
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;