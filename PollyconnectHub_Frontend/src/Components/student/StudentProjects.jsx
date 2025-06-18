import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Close, TokenOutlined } from "@mui/icons-material";
import axios from "axios";
import themeHook from "../Context";
import { toast } from "react-hot-toast";
import ProjectCard2 from "./ProjectCard2";
import photo from "./not_found.png";
import AsyncSelect from "react-select/async";
function StudentProjects() {
  const projectTypes = [
    { id: 1, value: "Software" },
    { id: 2, value: "Hardware" },
    { id: 3, value: "AI/Ml" },
    { id: 4, value: "IOT" },
  ];
  const { userDetails } = themeHook();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [multimedia, setMultimedia] = useState([]);
  const [contributors, setContributors] = useState("");
  const [liveDemo, setLiveDemo] = useState("");
  const [codeLink, setCodeLink] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState("");
  const [search, setSearch] = useState("");
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;
  const setbase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setMultimedia(reader.result);
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setbase(file);
    console.log(file);
  };

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // fetch matching users from backend
  const handleSearchC = async (e) => {
    const value = e.target.value;
    console.log(value);
    setSearchText(value);

    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `${VITE_BACKEND_API}/api/project/searchContributor/${value}`
      );
      setSuggestions(res.data.users);
      console.log(res.data.users, value);
    } catch (error) {
      console.log("Error searching contributors:", error);
      setSuggestions([]);
    }
  };

  // add selected user to array
  const handleSelectUser = (user) => {
    if (user._id === userDetails._id) return;

    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }

    setSearchText("");
    setSuggestions([]);
    console.log(selectedUsers);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    console.log(selectedUsers);
    try {
      const result = await axios.post(
        `${VITE_BACKEND_API}/api/project/addProjectByStudent`,
        {
          title: title,
          description: description,
          multimedia: multimedia,
          contributors: selectedUsers,
          liveDemo: liveDemo,
          codeLink: codeLink,
          type: selectedType,
          allocated_college: userDetails.allocated_college,
          created_By: userDetails._id,
          allocated_department: userDetails.allocated_department,
        }
      );
      console.log(result);
      if (result?.data?.data?.status) {
        toast.success(
          "Project added and will get activated after HOD approval"
        );
        console.log(result?.data?.data?.msg);
      } else {
        toast.error(result?.data?.data?.err);
      }
      setIsModelOpen(false);
    } catch (err) {
      toast.error(err.message); // Use err.message to get the error message
    }
  };
  const getAllProjects = async () => {
    console.log(userDetails.allocated_college, "js");
    try {
      const result = await axios.get(
        `${VITE_BACKEND_API}/api/auth/getAllProjects`
      );
      setProjectList(result.data.data.data);
      console.log(result.data);
    } catch (err) {
      toast.error(err.message); // Use err.message to get the error message
    }
    setLoading(false);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${VITE_BACKEND_API}/api/project/searchStudentsProj`,
      { title: search }
    );
    console.log(res.data.data.projects);
    setProjectList(res.data.data.projects);
  };
  useEffect(() => {
    getAllProjects();
  }, [userDetails, search == ""]);
  return (
    <div className="w-full flex h-[90vh] dark:bg-slate-900 dark:text-slate-100">
      <div className="flex flex-col p-2 w-full h-[90vh] overflow-y-auto">
        <div className="flex flex-row w-full items-center">
          <form
            onSubmit={handleSearch}
            className="p-4 flex justify-center w-full"
          >
            <input
              type="search"
              className="w-4/5 rounded-xl py-2 px-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none"
              placeholder="Search project"
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button
            onClick={() => setIsModelOpen(true)}
            className="w-40 bg-green-700 rounded-md py-2"
          >
            Add Project
          </button>
        </div>
        <h1 className="text-green-600 dark:text-green-400 font-semibold text-xl mx-2">
          Projects Uploaded By Students
        </h1>
        <div className="grid grid-cols-1 gap-4 p-2">
          {projectList.length === 0 ? (
            <div className="flex justify-center items-center">
              <img src={photo} className="w-36 h-36" />
              <h1 className="font-semibold text-slate-600 dark:text-slate-300">
                Not found
              </h1>
            </div>
          ) : (
            projectList?.map((item, index) => (
              <ProjectCard2 key={index} data={item} />
            ))
          )}
        </div>
      </div>

      {isModelOpen && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-slate-800 bg-opacity-60 backdrop-blur-md">
          <div className="relative w-[90%] md:w-[50%]">
            <div className="rounded-lg shadow-lg flex flex-col w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-y-auto h-[500px]">
              <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0">
                <h3 className="text-xl font-semibold">Add Project</h3>
                <button
                  className="p-1 ml-auto text-3xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => {
                    setIsModelOpen(false);
                    setSuggestions([]);
                    setSelectedUsers([]);
                  }}
                >
                  <Close />
                </button>
              </div>

              <form onSubmit={handleAddProject}>
                <div className="p-4">
                  <div className="flex flex-col mt-2">
                    <label>Project Title</label>
                    <input
                      type="text"
                      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm rounded-md px-2 py-1 focus:outline-none placeholder:text-slate-400"
                      placeholder="Enter Project Title"
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col mt-4">
                    <label>Project Type</label>
                    <select
                      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md px-2 py-1 focus:outline-none"
                      onChange={(event) => setSelectedType(event.target.value)}
                    >
                      <option value="">Select Project Type</option>
                      {projectTypes.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col mt-4">
                    <label>Project Description</label>
                    <textarea
                      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md px-2 py-1 focus:outline-none placeholder:text-slate-400"
                      placeholder="Enter Project Description"
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col mt-4">
                    <label>Multimedia</label>
                    <input
                      type="file"
                      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md px-2 py-1 focus:outline-none"
                      onChange={handleImageUpload}
                      required
                    />
                  </div>

                  <div className="flex flex-col mt-4">
                    <label>Project Contributors</label>
                    <input
                      type="text"
                      value={searchText}
                      onChange={handleSearchC}
                      placeholder="Search username"
                      className="focus:outline-none border-b border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 rounded-md"
                    />
                    {suggestions.length > 0 && (
                      <ul className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 mt-2 max-h-[150px] overflow-y-auto rounded-md">
                        {suggestions.map((user,idx) => (
                          <li
                            key={user._id}
                            onClick={() => handleSelectUser(user)}
                            className={`px-4 py-2 hover:bg-slate-500 dark:hover:bg-slate-700  cursor-pointer border-b border-1 border-gray-700 `}
                          >
                            {user.username}
                          </li>
                        ))}
                      </ul>
                    )}
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <li
                          key={user._id}
                          className="px-3 py-1 rounded-xl bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-sm"
                        >
                          {user.username}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col mt-4">
                    <label>Project Live Demo</label>
                    <input
                      type="url"
                      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md px-2 py-1 focus:outline-none"
                      placeholder="Live Project Link"
                      onChange={(e) => setLiveDemo(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col mt-4">
                    <label>Project Code Link</label>
                    <input
                      type="url"
                      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md px-2 py-1 focus:outline-none"
                      placeholder="Code Repository Link"
                      onChange={(e) => setCodeLink(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ backgroundColor: "#16a34a" }}
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        setIsModelOpen(false);
                        setSuggestions([]);
                        setSelectedUsers([]);
                      }}
                      variant="contained"
                      style={{
                        backgroundColor: "#dcfce7",
                        color: "#16a34a",
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProjects;
