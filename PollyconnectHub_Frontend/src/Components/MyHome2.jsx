import React from "react";
import { motion } from "framer-motion";
import bg from "../assets/AI-Campaign-Hero-Section_BG_Glow.gif";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import themeHook from "./Context";
import { FaProjectDiagram } from "react-icons/fa";
function MyHome() {
  const { theme, setTheme } = themeHook();
  const handleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };
  return (
    <div>
      <div className="min-h-screen dark:bg-black  bg-white text-black dark:text-white">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center sticky top-0 dark:bg-black bg-white">
          <div className="text-2xl font-bold text-purple-500 flex justify-center items-center space-x-2">
            <FaProjectDiagram color="" size={40}/>
            PolyConnectHub
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-purple-500 transition-colors">
              Home
            </a>
            <a
              href="#features"
              className="hover:text-purple-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#categories"
              className="hover:text-purple-500 transition-colors"
            >
              Categories
            </a>
            <a
              href="#contact"
              className="hover:text-purple-500 transition-colors"
            >
              Contact
            </a>
          </div>
          <div
            className="cursor-pointer dark:text-white text-black"
            onClick={handleTheme}
          >
            {theme === "light" ? (
              <MdOutlineDarkMode size={24} />
            ) : (
              <MdOutlineLightMode size={24} />
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          className="container mx-auto px-6 py-16 text-center dark:bg-black dark:text-white text-black"
          style={{
            backgroundImage: theme === "dark" ? `url(${bg})` : "",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">Connect, Create, and </span>
            <span className="text-purple-500">Innovate</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A platform for polytechnic students to showcase their projects and
            get verified by HODs
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center mx-auto">
              Get Started
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </motion.div>
        </section>

        <section id="features" className="container mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-700  text-black hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-purple-500 mb-2">
                Upload Projects
              </h3>
              <p className="dark:text-gray-400">
                Students can upload and showcase their project details.
              </p>
            </div>
            <div className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-700 text-black hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-purple-500 mb-2">
                HOD Verification
              </h3>
              <p className="dark:text-gray-400">
                Only HOD-verified projects are published publicly.
              </p>
            </div>
            <div className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-700 text-black hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-purple-500 mb-2">
                Category Filtering
              </h3>
              <p className="dark:text-gray-400">
                Explore projects by categories like Software, AI, IoT, and more.
              </p>
            </div>
          </div>
        </section>
        {/* Project Categories */}
        <section id="categories" className="container mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            Project Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Software Category */}
            <motion.div
              className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-300 text-black"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-start mb-4">
                <div className="text-purple-500 text-4xl">
                  <svg
                    className="w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 ">Software</h3>
              <p className="text-gray-400">
                Web, mobile, and desktop applications
              </p>
            </motion.div>

            {/* Hardware Category */}
            <motion.div
              className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-300 text-black"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-start mb-4">
                <div className="text-purple-500 text-4xl">
                  <svg
                    className="w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Hardware</h3>
              <p className="text-gray-400">
                Electronic and mechanical projects
              </p>
            </motion.div>

            {/* AI Category */}
            <motion.div
              className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-300 text-black"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-start mb-4">
                <div className="text-purple-500 text-4xl">
                  <svg
                    className="w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">AI</h3>
              <p className="text-gray-400">Machine learning and data science</p>
            </motion.div>

            {/* IoT Category */}
            <motion.div
              className="dark:bg-gray-900 rounded-lg p-6 border-2 dark:border-none dark:text-gray-300 text-black"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-start mb-4">
                <div className="text-purple-500 text-4xl">
                  <svg
                    className="w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">IoT</h3>
              <p className="text-gray-400">
                Internet of Things and embedded systems
              </p>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="container mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <p className="text-center text-gray-400 text-lg max-w-2xl mx-auto">
            If you have registered your college, please contact us at
            <a
              href="mailto:polyconnecthub@gmail.com"
              className="text-purple-500 hover:underline ml-1"
            >
              polyconnecthub@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default MyHome;
