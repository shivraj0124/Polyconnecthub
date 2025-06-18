import React, { useEffect, useState } from "react";
import themeHook from "../Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import not_found from "./not_found.png";
import photo from "./profilebanner.jpg";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FaRegCircleUser } from "react-icons/fa6";

function Profile() {
  const { userDetails, loadingMain, setLoadingMain, setUserDetails, setToken } =
    themeHook();
  const [pr, setpr] = useState([]);
  const [data2, setData2] = useState();
  const navigate = useNavigate();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const getuserproject = async () => {
    try {
      const { data } = await axios.post(
        `${VITE_BACKEND_API}/api/auth/getuprojects`,
        { user: userDetails._id }
      );
      const response = await axios.post(
        `${VITE_BACKEND_API}/api/auth/getSingleUser`,
        { user: userDetails._id }
      );
      setData2({
        collegeName: response?.data?.data?.allocated_college?.name,
        departmentName: response?.data?.data?.allocated_department?.name,
      });
      setpr(data.data);
    } catch (error) {}
  };

  const handleLogOut = async () => {
    setLoadingMain(true);
    try {
      setUserDetails(null);
      localStorage.removeItem("userDetails");
      localStorage.removeItem("userType");
      const token = Cookies.get("token");
      if (token) {
        Cookies.remove("token");
        setToken("");
      }
      toast.success("Logout Successfully");
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
    setLoadingMain(false);
  };

  useEffect(() => {
    getuserproject();
  }, []);

  return (
    <div className="md:h-[90vh] bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-100 relative">
      <img className="h-32 w-full object-cover" src={photo} />
      <div className="grid grid-cols-1 md:grid-cols-[35%_1fr] gap-4 p-4 absolute top-20 w-full md:h-[85%] dark:bg-slate-900">
        {/* Left Profile Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col gap-4 items-center shadow-md">
          <FaRegCircleUser size={55} className="text-green-700 dark:text-green-400" />
          <h1 className="font-semibold">{userDetails?.username}</h1>
          <div className="w-full h-px bg-gray-300 dark:bg-slate-600" />

          {/* Profile Info Sections */}
          <div className="flex flex-col justify-center items-center gap-4 w-full max-w-xs">
            {[
              { label: "Name", value: userDetails?.fullName },
              { label: "Email", value: userDetails?.email },
              { label: "Mobile", value: userDetails?.mobileNo },
              { label: "College", value: data2?.collegeName },
              { label: "Department", value: data2?.departmentName },
            ].map((info, idx) => (
              <section
                key={idx}
                className="w-full px-5 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 border dark:border-slate-600"
              >
                <h1 className="text-xs font-semibold text-gray-500 dark:text-slate-300">
                  {info.label}
                </h1>
                <p className="text-base font-medium break-words">{info.value}</p>
              </section>
            ))}

            <button
              onClick={handleLogOut}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl shadow transition"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Right Projects Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg h-full overflow-y-auto p-5 shadow-md">
          <h1 className="font-semibold text-green-700 dark:text-green-400 mb-3">
            Your Projects
          </h1>

          <div className="flex flex-col gap-4">
            {pr.length === 0 ? (
              <div className="flex flex-col justify-center items-center font-semibold">
                <img src={not_found} className="w-40 h-40" />
                <section>No Project Found</section>
              </div>
            ) : (
              pr.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 min-[580px]:grid-cols-[auto_1fr] bg-gray-100 dark:bg-slate-700 rounded-lg p-3 gap-4"
                >
                  <img
                    src={item.multimedia[0]}
                    className="w-[200px] h-[150px] max-md:w-full rounded-xl object-cover"
                  />
                  <div className="flex flex-col gap-2 justify-between">
                    <p className="font-semibold text-lg">
                      {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                    </p>

                    <p className="line-clamp-2 text-sm">
                      {item.description.charAt(0).toUpperCase() +
                        item.description.slice(1)}
                    </p>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Published on:</span>{" "}
                      {new Date(item.createdAt).toISOString().split("T")[0]}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1">
                      {item?.isActive === "true" ? (
                        <div className="text-xs bg-green-300 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold px-3 py-1 rounded-full">
                          Verified
                        </div>
                      ) : (
                        <div className="text-xs bg-red-300 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold px-3 py-1 rounded-full">
                          Not Verified
                        </div>
                      )}
                      <div className="text-xs border border-green-400 px-3 py-1 rounded-full">
                        {item.type}
                      </div>
                      <div
                        onClick={() => navigate(`/project/${item._id}`)}
                        className="text-xs bg-green-700 text-white hover:bg-green-800 cursor-pointer px-3 py-1 rounded-full transition"
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
