import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

function ProjectCard2({ data }) {
  const navigate = useNavigate();
  const [collegeName, setCollegeName] = useState("");
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const fetchCollegeName = async () => {
      try {
        const response = await axios.post(`${VITE_BACKEND_API}/api/college/onecollge`, {
          college: data?.allocated_college,
        });
        setCollegeName(response.data?.data);
      } catch (error) {
        console.error("Error fetching college name:", error);
      }
    };

    if (data?.allocated_college) {
      fetchCollegeName();
    }
  }, [data?.allocated_college, VITE_BACKEND_API]);

  return (
    <div
      className="flex flex-col bg-white dark:bg-slate-800 dark:text-slate-100 gap-4 rounded-lg w-full px-6 py-6 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/project/${data?._id}`)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6">
        <img
          src={
            data?.imageUrl ||
            "https://i0.wp.com/technologysalon.org/wp-content/uploads/2019/04/artificial-intelligence.jpg?resize=640%2C429"
          }
          alt="Project"
          className="w-full sm:w-44 h-44 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
        />
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">{data?.title}</p>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Published By: </span>
            {data?.created_By?.fullName || "Unknown"}
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">College Name: </span>
            {collegeName?.name || data?.allocated_college?.name || "N/A"}
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Type: </span>
            {data?.type || "N/A"}
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Description: </span>
            {data?.description || "No description provided."}
          </p>

          <div className="flex flex-col sm:flex-row justify-between text-sm mt-2 sm:items-end">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Published on: {moment(data?.time).format("YYYY-MM-DD")}
            </span>
            <button
              className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-semibold px-4 py-2 rounded-full mt-2 sm:mt-0 hover:bg-green-200 dark:hover:bg-green-700 transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/project/${data?._id}`);
              }}
            >
              Go to Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard2;
