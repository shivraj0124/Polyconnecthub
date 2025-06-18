import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { LiaUserEditSolid } from "react-icons/lia";
import { BsBuildings } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import themeHook from "../Context";
import { toast } from "react-hot-toast";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import { Box, TextField, Button } from "@mui/material";

function PocDashboard() {
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const { userDetails, setUserDetails} = themeHook();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNo: "",
  });

  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  // Fetch Dashboard Data
  const getAllCounts = async () => {
    try {
      const result = await axios.post(`${VITE_BACKEND_API}/api/poc/pocDashboardDetails`, {
        poc_id: userDetails._id,
        college_id: userDetails.College,
      });
      setData(result.data);
      setFormData({
        username: result.data?.pocData[0]?.username || "",
        email: result.data?.pocData[0]?.email || "",
        mobileNo: result.data?.pocData[0]?.mobileNo || "",
        password: "",
      });
      
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch data");
    }
  };

  const getSinglePoc = async()=>{
    try{
      const result2 = await axios.post(`${VITE_BACKEND_API}/api/poc/getonepoc`,{poc: userDetails._id});
      setUserDetails(result2?.data?.data?.data[0]);
        // Cookies.set("token", result2.data?.data?.token);
        localStorage.setItem(
          "userDetails",
          JSON.stringify(result2?.data?.data?.data[0])
        );

      console.log(result2.data.data.data[0])
    }catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch data");
    }
  }

  useEffect(() => {
    getAllCounts();
    getSinglePoc()
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update Profile API Call
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${VITE_BACKEND_API}/api/poc/updateP/${userDetails._id}`, formData);
      toast.success("Profile updated successfully!");
      getAllCounts(); // Refresh data
      getSinglePoc()
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="flex flex-col w-full h-[90vh] p-5 dark:bg-slate-900">
      <div className="flex flex-row justify-between">
        <h1 className="text-lg font-semibold text-green-600">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-10 mt-5">
        <div className="border dark:border-none dark:bg-slate-800 dark:text-white bg-white flex flex-row justify-between items-center p-4 rounded-md">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-green-500">
              <CountUp delay={2} end={data?.totalDepartments || 0} />
            </h1>
            <h1 className="text-xl font-bold">Departments</h1>
          </div>
          <BsBuildings className="text-green-500" size={60} />
        </div>

        <div className="border dark:border-none bg-white dark:bg-slate-800 dark:text-white flex flex-row justify-between items-center p-4 rounded-md">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-green-500">
              <CountUp delay={2} end={data?.totalHod || 0} />
            </h1>
            <h1 className="text-xl font-bold">HODs</h1>
          </div>
          <LiaUserEditSolid className="text-green-500" size={60} />
        </div>
      </div>

      {/* Profile Card */}
      <div className="grid gap-10 mt-10 w-max  ">
        <div className="border dark:border-none bg-white dark:bg-slate-800 dark:text-white flex flex-col justify-between items-center p-5 rounded-md">
          <div className="w-[100%] flex justify-end cursor-pointer" onClick={() => setOpen(true)}>
            {/* <EditIcon /> */}
          </div>
          <div>
            <div className="font-semibold text-green-600 text-center">Profile</div>
            <hr className="border-1 p-1 w-[100%]" />
            <section className="flex gap-2 justify-center items-center">
              <FaUserCircle className="text-green-500" size={40} />
            </section>
            <section>
              <h1 className="font-semibold text-2xl text-center">{data?.pocData[0]?.username}</h1>
              <h2 className="mt-3">
                <span className="text-green-600 font-semibold">Mobile no: </span>
                {data?.pocData[0]?.mobileNo}
              </h2>
              <h2>
                <span className="text-green-600 font-semibold">Email: </span>
                {data?.pocData[0]?.email}
              </h2>
              <h2 className="font-semibold">
                <span className="text-green-600 font-semibold">College: </span>
                {data?.pocData[0]?.College?.name}
              </h2>
              
            </section>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal className="border-none" open={open} onClose={() => setOpen(false)}>
        <div className="bg-white p-5 rounded-md border-b border-green-700 w-[400px] mx-auto mt-20 flex flex-col gap-5">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            className="mt-5"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            className="mt-5"
          />
          <TextField
            label="Mobile No"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            fullWidth
            className="mt-5"
          />
          <div className="flex justify-between">
          <Button variant="contained" style={{
                              backgroundColor: "red",
                              height: "max-content",
                              color: "white",
                            }} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" style={{
                              backgroundColor: "green",
                              height: "max-content",
                              color: "white",
                            }} onClick={handleUpdate}>
              Save Changes
            </Button>

            
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PocDashboard;
