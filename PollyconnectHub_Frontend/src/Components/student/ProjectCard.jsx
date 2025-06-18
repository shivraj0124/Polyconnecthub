import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ data }) {
  const navigate = useNavigate();
  const [college_name, setcollege_name] = useState('');
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const getcollege = async () => {
    const col = await axios.post(`${VITE_BACKEND_API}/api/college/onecollge`, {
      college: data.allocated_college,
    });
    setcollege_name(col.data.data);
  };

  useEffect(() => {
    getcollege();
  }, []);

  return (
    <div
      className="flex flex-col gap-4 rounded-lg w-full px-6 py-6 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => navigate(`/project/${data?._id}`)}
    >
      <div className="grid grid-cols-1 min-[580px]:grid-cols-[auto_1fr] gap-6 justify-center">
        <img
          src={
            "https://i0.wp.com/technologysalon.org/wp-content/uploads/2019/04/artificial-intelligence.jpg?resize=640%2C429"
          }
          className="w-full min-[580px]:w-40 h-40 rounded-xl object-cover"
          alt="Project"
        />

        <div className="flex gap-2 flex-col justify-start text-slate-800 dark:text-slate-200">
          <div>
            <p className="font-semibold text-xl text-green-700 dark:text-green-400">
              {data?.title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Published By: </span>
              {college_name?.name}
            </p>
          </div>

          <div className="line-clamp-3 text-sm text-slate-700 dark:text-slate-300">
            {data?.description}
          </div>

          <div className="flex flex-col min-[500px]:flex-row justify-between text-xs mt-2 items-start min-[500px]:items-end gap-1">
            <div className="text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Published on:</span>{" "}
              {moment(data?.time).format("YYYY-MM-DD")}
            </div>
            <div
              className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full px-3 py-2 font-semibold hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
              onClick={() => navigate(`/project/${data?._id}`)}
            >
              Go to Project
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
