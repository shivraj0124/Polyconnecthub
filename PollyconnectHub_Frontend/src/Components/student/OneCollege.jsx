import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bannerimg from "./CollegeBanner.jpg";
import { LuSchool } from "react-icons/lu";
import photo from "./not_found.png";

function OneCollege() {
  const [collegedata, setcollegedata] = useState([]);
  const [dpt, setdpt] = useState([]);
  const [project, setproject] = useState([]);
  const { id } = useParams();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const toggleReadMore = () => setExpanded(!expanded);
  const [expandedIndexes, setExpandedIndexes] = useState([]);

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const getdata = async () => {
    const res = await axios.post(`${VITE_BACKEND_API}/api/college/onecollge`, {
      college: id,
    });
    setcollegedata(res.data.data);
    console.log(res.data.data.about);
  };

  const getdptdata = async () => {
    const data = await axios.post(
      `${VITE_BACKEND_API}/api/auth/getDepartment`,
      { college_id: id }
    );
    setdpt(data.data.data.data);
  };

  const getprojectdata = async () => {
    const data = await axios.post(
      `${VITE_BACKEND_API}/api/project/getAllProjectsByCollege`,
      { college_id: id }
    );
    setproject(data.data.data.data);
  };

  useEffect(() => {
    getdata();
    getdptdata();
    getprojectdata();
  }, []);

  return (
    <div className="w-full flex flex-col h-[90vh] px-8 py-4 overflow-y-auto gap-4  dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="relative rounded-lg">
          <img
            src={bannerimg}
            alt="banner"
            className="h-40 w-full object-cover rounded-t-lg"
          />
          <section className="w-32 h-32 absolute rounded-lg top-20 left-7 shadow-md border-2 border-white dark:border-slate-700">
            <img
              className="rounded-lg h-full w-full object-cover"
              src={
                collegedata?.photo
                  ? collegedata.photo
                  : "https://www.festivalsfromindia.com/wp-content/uploads/2022/04/VJTI-Mumbai.-Photo-VJTI-Mumbai-1_11zon.jpg"
              }
              alt="college"
            />
          </section>
        </div>
        <div className="pt-14 px-6 py-3">
          <h1 className="font-semibold text-xl text-green-700 dark:text-green-400">
            {collegedata.name}
          </h1>
          <p
            className={`text-slate-600 dark:text-slate-300 text-sm ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {collegedata.about}
          </p>
          <button
            className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium hover:underline focus:outline-none"
            onClick={toggleReadMore}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-green-700">Address:</span>{" "}
            {collegedata.address}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departments */}
        <div className="flex flex-col gap-2 md:h-[50vh] overflow-y-auto">
          <h1 className="text-green-700 dark:text-green-400 text-lg font-semibold">
            Department
          </h1>
          <div className="flex flex-col gap-3">
            {dpt.length === 0 ? (
              <div className="flex justify-center items-center border rounded-xl px-3 py-6 bg-white dark:bg-slate-800 shadow">
                <img src={photo} className="w-36 h-36" />
                <h1 className="font-semibold text-slate-600 dark:text-slate-300">
                  No Department added yet.
                </h1>
              </div>
            ) : (
              dpt.map((item, index) => {
                const isExpanded = expandedIndexes.includes(index);
                return (
                  <div
                    key={index}
                    className="flex items-start bg-white dark:bg-slate-800 rounded-lg p-4 gap-4 shadow"
                  >
                    <LuSchool
                      size={35}
                      className="text-green-600 dark:text-green-400 mt-1"
                    />
                    <section className="w-[90%]">
                      <h1 className="font-semibold">{item.name}</h1>
                      <p
                        className={`text-slate-600 dark:text-slate-300 text-sm ${
                          isExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        <span className="font-semibold">About:</span>{" "}
                        {item.about}
                      </p>
                      <button
                        onClick={() => toggleExpand(index)}
                        className="mt-1 text-green-600 dark:text-green-400 text-sm font-medium hover:underline focus:outline-none"
                      >
                        {isExpanded ? "Read less" : "Read more"}
                      </button>
                    </section>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-2 md:h-[50vh] overflow-y-auto">
          <h1 className="text-green-700 dark:text-green-400 text-lg font-semibold">
            Projects
          </h1>
          <div className="flex flex-col gap-3">
            {project.length === 0 ? (
              <div className="flex justify-center items-center border rounded-xl px-3 py-6 bg-white dark:bg-slate-800 shadow">
                <img src={photo} className="w-36 h-36" />
                <h1 className="font-semibold text-slate-600 dark:text-slate-300">
                  No project found
                </h1>
              </div>
            ) : (
              project.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-4 gap-4 shadow"
                >
                  <LuSchool
                    size={35}
                    className="text-green-600 dark:text-green-400"
                  />
                  <section
                    className="w-[90%] cursor-pointer"
                    onClick={() => {
                      navigate(`/project/${item?._id}`);
                    }}
                  >
                    <h1 className="cursor-pointer font-semibold">
                      {item.title}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">
                      <span className="font-semibold">Description:</span>{" "}
                      {item.description}
                    </p>
                  </section>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneCollege;
