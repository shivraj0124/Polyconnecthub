import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import themeHook from "../Context";

function CollegeCard({ data, call }) {
  const navigate = useNavigate();
  const { userDetails } = themeHook();
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;
  const [showModal, setShowModal] = useState(false);

  const subscribeToCollege = async () => {
    try {
      const response = await axios.post(`${VITE_BACKEND_API}/api/college/subscribe`, {
        studentId: userDetails?._id,
        collegeId: data._id,
      });
      toast.success("Subscribed successfully");
      call();
    } catch (error) {
      console.error("Subscription failed:", error.response?.data || error.message);
    }
  };

  const unsubscribeFromCollege = async () => {
    try {
      const response = await axios.post(`${VITE_BACKEND_API}/api/college/unsubscribe`, {
        studentId: userDetails?._id,
        collegeId: data._id,
      });
      toast.success(response.data.message);
      setShowModal(false);
      call();
    } catch (error) {
      console.error("Unsubscription failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="cursor-pointer flex flex-col rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <img
        src={
          data.photo
            ? data.photo
            : "https://www.festivalsfromindia.com/wp-content/uploads/2022/04/VJTI-Mumbai.-Photo-VJTI-Mumbai-1_11zon.jpg"
        }
        alt="college"
        className="w-full h-40 object-cover rounded-t-lg"
        onClick={() => navigate(`/collage/${data._id}`)}
      />
      <div className="flex justify-between">
        <div
          className="p-4 text-slate-800 dark:text-slate-100"
          onClick={() => navigate(`/collage/${data._id}`)}
        >
          <h1 className="font-semibold text-green-700 dark:text-green-400">{data.name}</h1>
          <h1 className="line-clamp-3 text-sm">{data.about}</h1>
          <h1 className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold ">Address:</span> {data.address}
          </h1>
        </div>
       {userDetails?.userType === 'student' ? <div className="px-2 flex justify-end items-end mb-2">
          {!data?.isSubscribed ? (
            <button
              className="p-1 px-2 border rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              onClick={subscribeToCollege}
            >
              Subscribe
            </button>
          ) : (
            <button
              className="p-1 px-2 border rounded-md bg-slate-500 text-white hover:bg-slate-600 transition"
              onClick={() => setShowModal(true)}
            >
              Unsubscribe
            </button>
          )}
        </div>:''}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to unsubscribe from <span className="text-green-600 dark:text-green-400">{data?.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={unsubscribeFromCollege}
              >
                Yes, Unsubscribe
              </button>
              <button
                className="bg-gray-300 dark:bg-slate-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-slate-500"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeCard;
