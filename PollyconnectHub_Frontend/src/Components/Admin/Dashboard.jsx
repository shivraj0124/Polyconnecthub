import React, { useEffect, useState } from "react";
import { LuSchool2 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { PiStudent } from "react-icons/pi";
import { LiaUserEditSolid } from "react-icons/lia";
import LineChartTest from "./LineChartTest";
import axios from "axios";
import CountUp from "react-countup";
import Bar from "../Charts/Chart";
import Ap from "../Charts/Ap";
import Select from "react-select";
import themeHook from "../Context";
import toast from "react-hot-toast";

function Dashboard() {
  const [data, setData] = useState();
  const [clg, setclg] = useState([]);
  const [bdata, setbdata] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const { theme } = themeHook();

  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-slate-800 text-white" : "bg-white text-black";
  const cardBorder = isDark ? "border-slate-700" : "border-gray-300";

  const getTotalCount = async () => {
    try {
      const result = await axios.get(
        `${VITE_BACKEND_API}/api/admin/getTotalCount`
      );
      setData(result.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getcollege = async () => {
    try {
      const result = await axios.get(
        `${VITE_BACKEND_API}/api/admin/getcolleges`
      );
      setclg(result.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getdata = async (id) => {
    try {
      const { data } = await axios.post(
        `${VITE_BACKEND_API}/api/college/getcount`,
        { college_id: id }
      );
      setbdata(data);
    } catch (error) {}
  };

  const handleCollegeSelect = (selectedOption) => {
    setSelectedCollegeId(selectedOption.value);
    getdata(selectedOption.value);
  };

  useEffect(() => {
    getTotalCount();
    getcollege();
  }, []);

  return (
    <div className={`flex flex-col w-full h-[90vh] p-5 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-black"}`}>
      <div className="flex flex-row justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-10 mt-5">
        {[{
          count: data?.totalCountCollege,
          label: "Colleges",
          icon: <LuSchool2 className="text-green-500" size={60} />,
        }, {
          count: data?.totalCountPoc,
          label: "Poc's",
          icon: <FiUserCheck className="text-green-500" size={60} />,
        }, {
          count: data?.totalCountHod,
          label: "Hod's",
          icon: <LiaUserEditSolid className="text-green-500" size={60} />,
        }, {
          count: data?.totalCountStudents,
          label: "Students",
          icon: <PiStudent className="text-green-500" size={60} />,
        }].map((item, idx) => (
          <div key={idx} className={`border ${cardBorder} ${cardBg} flex flex-row justify-between items-center p-4 rounded-md`}>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-green-500">
                <CountUp delay={2} end={item.count} />
              </h1>
              <h1 className="text-xl font-bold">{item.label}</h1>
            </div>
            <div>{item.icon}</div>
          </div>
        ))}
      </div>

      <div className={`flex flex-row w-full mt-10 border ${cardBorder} ${cardBg}`}>
        <div className="w-full flex flex-col lg:flex-row justify-between p-4 gap-6">
          <div className="w-full lg:w-1/2">
            <Bar
              clg={data?.totalCountCollege}
              poc={data?.totalCountPoc}
              hod={data?.totalCountHod}
            />
          </div>
          <div className="w-full ">
            <section className="w-[90%] mx-auto mb-4">
              <Select
               className="dark:text-black"
                options={clg.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
                onChange={handleCollegeSelect}
              />
            </section>
            <Ap
              hod={bdata?.totalCountHod}
              student={bdata?.totalCountStudent}
              project={bdata?.totalcountProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
