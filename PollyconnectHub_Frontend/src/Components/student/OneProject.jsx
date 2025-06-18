import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import themeHook from "../Context";
import toast from "react-hot-toast";

function OneProject() {
  const [projectdata, setProjectdata] = useState([]);
  const { token, userDetails } = themeHook();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;
  const { id } = useParams();

  const getProjectdata = async () => {
    const res = await axios.post(
      `${VITE_BACKEND_API}/api/project/getoneproject`,
      { project_id: id }
    );
    setProjectdata(res?.data?.data?.data[0]);
  };

  const save = async () => {
    const { data } = await axios.post(
      `${VITE_BACKEND_API}/api/save/add`,
      {
        project_id: id,
        user_id: userDetails._id,
      },
      {
        headers: {
          authentication: `Bearer ${token}`,
        },
      }
    );
    if (data.data.status) {
      toast.success("Saved successfully");
    }
  };

  useEffect(() => {
    getProjectdata();
  }, []);

  return (
    <div className="sm:h-[90vh] flex justify-center  dark:bg-slate-900">
      <div className="p-6 mt-5 w-[90%] max-w-3xl bg-white dark:bg-slate-800 flex flex-col rounded-xl border dark:border-slate-700 shadow-md overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200">
        <img
          src={projectdata?.multimedia}
          alt="Project"
          className="w-full h-[400px] rounded-xl object-cover border dark:border-slate-600"
        />

        <div className="flex justify-between flex-wrap">
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 capitalize">
            {projectdata?.title}
          </h1>
          <h1 className="text-md font-bold text-slate-700 dark:text-slate-400 capitalize">
            <span>Created By: </span>
            <a
              className="text-blue-500"
              href={
                userDetails?._id === projectdata?.created_By?._id
                  ? "/profile"
                  : `/profile/${projectdata?.created_By?._id}`
              }
            >
              {userDetails?._id === projectdata?.created_By?._id
                ? "You"
                : projectdata?.created_By?.username}
            </a>
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          {projectdata?.isActive == "true" ? (
            <div className="text-xs border w-28 bg-green-300 dark:bg-green-900 flex justify-center items-center rounded-full bg-opacity-25 px-2 py-1 text-green-600 dark:text-green-300 font-semibold">
              Verified
            </div>
          ) : (
            <div className="text-xs border w-24 bg-red-300 dark:bg-red-900 flex justify-center items-center rounded-full bg-opacity-25 px-2 py-1 text-red-600 font-semibold">
              Not Verified
            </div>
          )}
          <div className="text-xs border flex justify-center items-center border-green-400 w-28 rounded-full px-2 py-1 text-slate-800 dark:text-slate-400 font-semibold">
            {projectdata.type}
          </div>
          <div className="px-3 py-1 rounded-full border text-white bg-green-700 dark:bg-green-600">
            <span className="font-semibold">Posted At:</span>{" "}
            {projectdata?.createdAt
              ? new Date(projectdata.createdAt).toISOString().split("T")[0]
              : "N/A"}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Description:</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {projectdata?.description}
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Contributors:</h2>
          {projectdata?.contributers?.map((item, index) => (
            <a
              key={index}
              href={`/profile/${item?._id}`}
              className="text-blue-600 dark:text-blue-400 mr-2"
            >
              @{item?.username}
            </a>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-1">College Name:</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {projectdata?.allocated_college?.name}
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Department Name:</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {projectdata?.allocated_department?.name}
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Live Demo:</h2>
          <a
            href={projectdata?.live_demo}
            target="_blank"
            className="text-blue-500 underline dark:text-blue-400"
          >
            click here
          </a>
        </div>

        {projectdata?.codeLink && (
          <div>
            <h2 className="font-semibold mb-1">Code:</h2>
            <a
              href={projectdata?.codeLink}
              target="_blank"
              className="text-blue-500 underline dark:text-blue-400"
            >
              click here
            </a>
          </div>
        )}

        {/* Uncomment to use save functionality */}
        {/* 
        <button
          onClick={save}
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-semibold py-2 rounded-xl w-full shadow"
        >
          Save Project
        </button> 
        */}
      </div>
    </div>
  );
}

export default OneProject;
