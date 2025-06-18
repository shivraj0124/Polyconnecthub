import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ss from "./ss.jpg";
import tt from "./tt.jpg";
import jj from "./jj.jpg";
import banner4 from "../../assets/banner4.jpg";
import banner5 from "../../assets/banner5.jpg";
import { Carousel } from "react-responsive-carousel";
import photo from "./not_found.png";
import { BarLoader } from "react-spinners";
import themeHook from "../Context";

function MainContent() {
  const [projectData, setProjectData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;
  const { theme } = themeHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${VITE_BACKEND_API}/api/project/getallprojects`);
        setProjectData(res.data.data.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [search == ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_BACKEND_API}/api/project/search`, {
        title: search,
      });
      setProjectData(res.data.data.projects);
    } catch (error) {
      console.error("Error searching projects:", error);
    }
  };

  const bannerArr = [
    { img: ss, alt: "Slide 1" },
    { img: tt, alt: "Slide 2" },
    { img: jj, alt: "Slide 3" },
    { img: banner4, alt: "Slide 4" },
    { img: banner5, alt: "Slide 5" },
  ];

  return (
    <div className="w-full flex flex-col h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100">
      <div className="flex flex-col p-4 gap-4 w-full overflow-y-auto min-[900px]">
        <h1 className="text-green-600 dark:text-green-400 font-semibold text-lg text-center">
          Empowering Polytechnic Communities through Shared Knowledge: Building
          Bridges, Inspiring Innovation.
        </h1>

        <section className="w-full rounded-md h-60">
          <Carousel
            axis="horizontal"
            showThumbs={false}
            autoPlay={true}
            interval={3000}
            infiniteLoop={true}
            swipeable={true}
          >
            {bannerArr.map((item, index) => (
              <div key={index}>
                <img
                  className="rounded-md w-full h-[250px] object-cover"
                  src={item.img}
                  alt={item.alt}
                />
              </div>
            ))}
          </Carousel>
        </section>

        <section className="">
          <h1 className="mx-2 font-semibold text-xl text-green-700 dark:text-green-400 mb-2">
            Projects
          </h1>
          <div className="flex px-2 py-1 justify-between gap-4 w-full">
            <form
              onSubmit={handleSubmit}
              className="flex justify-end h-9 w-full"
            >
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                className="w-[60%] bg-white dark:bg-slate-800 border dark:border-slate-700 h-full rounded-md px-4 focus:outline-none text-sm text-slate-700 dark:text-slate-200"
              />
            </form>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 min-h-[200px]">
            {loading && (
              <div className="flex justify-center items-center">
                <BarLoader color="green" />
              </div>
            )}

            {projectData.length === 0 ? (
              <div className="flex flex-col justify-center items-center text-center">
                <img src={photo} className="w-36 h-36 mb-2" />
                <h1 className="font-semibold text-slate-600 dark:text-slate-300">No Projects Found</h1>
              </div>
            ) : (
              projectData.map((item, index) => (
                <ProjectCard key={index} data={item} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainContent;
