import React, { useState } from "react";
import themeHook from "./Context";
import { FaUserCircle, FaProjectDiagram } from "react-icons/fa";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import Button from "@mui/material/Button";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Navbar() {
  const { userDetails, theme, setTheme } = themeHook();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleHashNavigation = (hash) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    } else {
      scrollToSection(hash);
    }
    setMenuOpen(false);
  };

  const scrollToSection = (hash) => {
    const id = hash.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = (
    <div className="flex flex-col md:flex-row gap-4 items-center md:gap-6 text-lg font-medium">
      <Link to="/" className="hover:text-green-500" onClick={() => setMenuOpen(false)}>
        Home
      </Link>
      <button className="hover:text-green-500" onClick={() => handleHashNavigation("#features")}>
        Features
      </button>
      <button className="hover:text-green-500" onClick={() => handleHashNavigation("#categories")}>
        Categories
      </button>
      <button className="hover:text-green-500" onClick={() => handleHashNavigation("#contact")}>
        Contact
      </button>
    </div>
  );

  return (
    <div className="relative">
      <div className="flex justify-between items-center px-5 py-3 dark:bg-slate-950 bg-white border-b-2 border-gray-300 dark:border-gray-600 sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 text-green-800">
          <FaProjectDiagram size={32} />
          <h1 className="text-lg font-bold text-green-600 cursor-pointer">
            <Link to="/">
              <i>PolyConnectHub</i>
            </Link>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-slate-800 dark:text-white">
          {navLinks}
        </div>

        {/* Theme Toggle + Auth + Hamburger */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <div className="cursor-pointer" onClick={handleTheme}>
            {theme === "light" ? (
              <MdOutlineDarkMode size={24} />
            ) : (
              <MdOutlineLightMode color="white" size={24} />
            )}
          </div>

          {/* Auth Section */}
          {userDetails ? (
            <div className="flex items-center gap-2 dark:text-white">
              <h1 className="font-semibold hidden md:block">
                <Link
                  to={
                    userDetails.userType === "admin"
                      ? "/Admin/Dashboard"
                      : userDetails.userType === "poc"
                      ? "/Poc/Dashboard"
                      : userDetails.userType === "HOD"
                      ? "/Hod/Dashboard"
                      : "/Profile"
                  }
                >
                  {userDetails.username}
                </Link>
              </h1>
              <FaUserCircle size={32} className="text-darkgreen" />
            </div>
          ) : (
            <Button
              variant="contained"
              style={{ backgroundColor: "#22c55e" }}
              onClick={() => navigate("/Login")}
            >
              Login
            </Button>
          )}

          {/* Hamburger Button */}
          <button
            className="block md:hidden text-3xl dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full bg-white dark:bg-slate-950 shadow-md px-5 py-4 z-40">
          {navLinks}
          <div className="mt-4 border-t border-gray-300 pt-4">
            {userDetails ? (
              <div className="flex items-center justify-between text-slate-800 dark:text-white">
                <Link
                  to={
                    userDetails.userType === "admin"
                      ? "/Admin/Dashboard"
                      : userDetails.userType === "poc"
                      ? "/Poc/Dashboard"
                      : userDetails.userType === "HOD"
                      ? "/Hod/Dashboard"
                      : "/Profile"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {userDetails.username}
                </Link>
                <FaUserCircle size={28} />
              </div>
            ) : (
              <Button
                variant="contained"
                style={{ backgroundColor: "#22c55e", marginTop: "10px" }}
                onClick={() => {
                  navigate("/Login");
                  setMenuOpen(false);
                }}
                fullWidth
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
