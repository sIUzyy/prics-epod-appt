// NOTE: THIS COMPONENT WILL SHOW IN LANDING PAGE ONLY

// react
import { useState, useEffect, useRef } from "react";

// props-validation
import PropTypes from "prop-types";

// react-router-dom
import { Link } from "react-router";

// image
import prics_logo from "../../assets/nav_logo.webp";

// react-icons
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";

export default function NavigationBar({ aboutRef, contactRef }) {
  // state for navigation
  const [nav, setNav] = useState(false);

  // close the sidebar if click outside ref
  const sidebarRef = useRef(null);

  // open-close the navigation
  const pressNavigation = () => {
    setNav((prev) => !prev);
  };

  // close the navigation when links are clicked
  const closeNavigation = () => {
    setNav(false);
  };

  // function to scroll to specific page
  const scrollToSection = (ref) => {
    setNav(false); // Close the sidebar
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // close the sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setNav(false); // Close the sidebar if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/*mobile view - navigation bar */}
      <nav className="mobile_view p-5 flex justify-between items-center md:hidden ">
        <Link to="/">
          <img
            src={prics_logo}
            alt="PRICS company logo"
            className="w-[140px] h-[60px] object-cover"
          />
        </Link>

        {/*nav toggle*/}
        <div className="menu">
          <div onClick={pressNavigation}>
            {!nav ? (
              <GiHamburgerMenu size={25} />
            ) : (
              <IoCloseOutline size={25} />
            )}
          </div>
        </div>

        {/* Side Navbar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 bg-gray-800 text-white h-full w-64 transform ${
            nav ? "translate-x-0" : "-translate-x-full"
          } transition-transform ease-in-out duration-300`}
        >
          <h1 className="p-5 font-bebas tracking-widest text-2xl">
            E-POD – Prics Technologies Inc.
          </h1>
          <ul className="p-5">
            <Link to={"/"} onClick={closeNavigation}>
              <h1 className="font-inter mb-3 border-b-1 border-g pb-2 border-gray-700">
                Home
              </h1>
            </Link>

            <Link onClick={() => scrollToSection(aboutRef)}>
              <h1 className="font-inter mb-3 border-b-1 border-g pb-2 border-gray-700">
                About
              </h1>
            </Link>

            <Link onClick={() => scrollToSection(contactRef)}>
              <h1 className="font-inter mb-3 border-b-1 border-g pb-2 border-gray-700">
                Contact
              </h1>
            </Link>

            <Link to={"/signin"}>
              <h1 className=" font-bebas tracking-widest text-center text-white rounded-full px-8 py-0.5 bg-gradient-to-r from-[#4A90E2] to-[#9013FE] 2xl:py-1 md:hover:opacity-75 md:transition-opacity md:duration-300">
                Sign In
              </h1>
            </Link>
          </ul>
        </div>
      </nav>

      {/*desktop view - navigation bar */}
      <nav className="hidden md:flex p-5 justify-between items-center 2xl:max-w-7xl 2xl:mx-auto">
        <Link to={"/"}>
          <img
            src={prics_logo}
            alt="prics_logo"
            className="w-35 h-15  object-cover"
          />
        </Link>

        {/*navigation bar */}
        <div className="flex justify-between items-center md:w-1/2  ">
          <Link to={"/"}>
            <h1 className="font-inter hover:underline ">Home</h1>
          </Link>

          <Link onClick={() => scrollToSection(aboutRef)}>
            <h1 className="font-inter hover:underline">About</h1>
          </Link>

          <Link onClick={() => scrollToSection(contactRef)}>
            <h1 className="font-inter hover:underline">Contact</h1>
          </Link>

          <Link to={"/signin"}>
            <h1 className=" font-bebas tracking-widest text-white rounded-full px-8 py-0.5 bg-gradient-to-r from-[#4A90E2] to-[#9013FE] 2xl:py-1 md:hover:opacity-75 md:transition-opacity md:duration-300">
              Sign In
            </h1>
          </Link>
        </div>
      </nav>
    </>
  );
}

// props validation
NavigationBar.propTypes = {
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  contactRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
