import React, { Fragment, useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const navLink = [
  {
    label: "Home",
    link: "/",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "About",
    link: "/about",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Article",
    link: "/article",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Upsc",
    link: "/upsc",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Courses",
    link: "/courses",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Contact",
    link: "/contact",
    className: "hover:text-[#054BB4]"
  },

]

const NavBar = () => {
  const [hamBurger, setHamBurger] = useState(false);
  const location = useLocation()
  const navigate = useNavigate()
  function handleClick() {
    setHamBurger(!hamBurger);
    // console.log(hamBurger);
  }
  return (
    <>
      <div className="w-full h-[15vh] flex items-center justify-between px-12">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center flex-col">
            <p className="text-3xl font-bold">
              ZenStudy<span className="text-[#054BB4] text-4xl">.</span>
            </p>
            <p className="text-[10px] font-medium text-[#054BB4]">
              Making Education Imaginative
            </p>
          </div>
          <div className="lg:block hidden">
            <ul className="flex items-center justify-between gap-8 cursor-pointer">
              {navLink.map((item) => (
                <Fragment key={item.label}>
                  <li className={`${location.pathname === item.link
                    ? "px-5 py-[2px] text-[#054BB4] rounded-full border-2 border-solid border-[#054BB4] font-medium"
                    : item.className
                    } transition-all duration-300 ease-in-out`}>
                    <Link to={item.link}>{item.label}</Link>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="lg:block hidden">
            <button className="px-5 py-2 bg-[#054BB4] text-white rounded-full" onClick={()=> navigate("/sign-Up")}>
              Login/SignUp
            </button>
          </div>
          <div className="lg:hidden text-2xl flex items-center relative z-30 text-[#054BB4]">
            {!hamBurger ? (
              <RxHamburgerMenu onClick={handleClick} className="cursor-pointer" />
            ) : (
              <RxCross2 onClick={handleClick} className="text-[#054BB4] cursor-pointer" />
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {hamBurger && (
          <div
            className="lg:hidden w-full bg-[#054BB4] text-white overflow-hidden"
          >
            <div className="w-full h-[120vh] bg-[#054BB4] relative top-[-230px] text-white ">
              <div className="w-full h-full absolute flex items-center justify-center flex-col gap-5">
                <ul className="flex flex-col items-center justify-center  text-lg w-full">
                  {navLink.map((item) => (
                    <li
                      key={item.label}
                      className={`w-full text-center border-b border-white py-4 transition-all duration-300 ease-in-out hover:text-[#054BB4] hover:bg-[#F9F9F9] cursor-pointer ${location.pathname === item.link
                        ? ""
                        : ""
                        }`}
                    >
                      <Link to={item.link} onClick={() => setHamBurger(false)}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                 
                </ul>
                <button className="px-4 py-1 border-2 border-solid border-white text-lg rounded-full hover:text-[#054BB4] hover:bg-[#F9F9F9] transition-all duration-300 cursor-pointer">
                  Login/SignUp
                </button>
              </div>
            </div>
          </div>)}
      </AnimatePresence>
    </>
  );
};


export default NavBar;


