import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoCallSharp } from "react-icons/io5";
import { FaSearchLocation, FaWhatsapp } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Footer = () => {
  const date = new Date();
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);


  return (
    <div className="bg-[#054BB4] w-full min-h-[35vh] text-[#CADEFB]">
      <div className="lg:px-12 md:px-8 px-4 py-4 flex flex-wrap items-start justify-between">
        {/* Upper Section */}
        <div className="w-full mt-4 lg:w-1/2 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-6 mb-5 md:mb-0">
            <div>
              <p className="text-3xl font-bold">
                ZenStudy<span>.</span>
              </p>
              <p className="text-[10px]">Making Education Imaginative</p>
            </div>
            <div>
              <p className="font-medium text-sm">
                ZenStudy is a result of the vision of "MAKING EDUCATION
                IMAGINATIVE". We have ventured into the field of education.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <Link
                to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu"
                target="blank"
                className="hover:bg-red-500 rounded-full p-2"
              >
                <FiYoutube size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://www.instagram.com/zenstudyz/"
                target="blank"
                className="hover:bg-gradient-to-br from-[#405DE6] via-[#5B51D8] to-[#E1306C] rounded-full p-2"
              >
                <FiInstagram size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://www.facebook.com/people/Zenstudy/61555473406607/"
                target="blank"
                className="hover:bg-[#4267B2] rounded-full p-2"
              >
                <FiFacebook size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://twitter.com/ZenstudyZ"
                target="blank"
                className="hover:bg-[#1DA1F2] rounded-full p-2"
              >
                <FiTwitter size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://wa.me/919810246095"
                target="blank"
                className="flex justify-end bg-green-500  hover:bg-green-700 p-2 text-white z-50 rounded-full fixed bottom-0 right-5 mb-6 text-4xl animate-bounce ..."
              >
                <div>
                  <FaWhatsapp />
                </div>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center ">
            <ul className="flex  flex-col gap-2 text-sm md:items-start lg:px-20 md:px-14 px-0 items-start w-full">
              <li className=" text-2xl font-semibold mb-4">Menu</li>
              <Link to="/" className="hover:text-white">
                <li>Home</li>
              </Link>
              <Link to="/about" className="hover:text-white">
                <li>About</li>
              </Link>
              {
                // <Link to="/article" className="hover:text-white">
                //   <li>Article</li>
                // </Link>
                // <Link to="/upsc" className="hover:text-white">
                //   <li>UPSC</li>
                // </Link>
              }
              <Link to="/courses" className="hover:text-white">
                <li>Courses</li>
              </Link>
              <Link to="https://blog.zenstudy.in/" className="hover:text-white">
              <li>Blogs</li>
            </Link>
              <Link to="/contact" className="hover:text-white">
                <li>Contact</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Lower Section */}
        <div className="w-full lg:w-1/2 mt-4 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-7 text-sm mb-5 md:mb-0">
            <div className="text-2xl font-semibold">Contact With Us</div>
            <div className="flex items-start gap-2">
              <IoCallSharp className="text-xl" />
              <p>+91- 9810246095</p>
            </div>
            <div className="flex items-start gap-2">
              <FaSearchLocation className="text-2xl" />
              <p>
                7/46, Shankar Rd, Block 7, Old Rajinder Nagar, Rajinder Nagar,
                New Delhi, Delhi, 110060
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col lg:items-center md:items-start items-start">
            {
            //   <p className="mb-4 text-2xl font-semibold ">Let’s Connect</p>
            // <div className="flex items-start space-x-4">
            //   <Link
            //     to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu"
            //     target="blank"
            //     className="hover:bg-red-500 rounded-full p-2"
            //   >
            //     <FiYoutube size={25} className="hover:text-white" />
            //   </Link>
            //   <Link
            //     to="https://www.instagram.com/zenstudyz/"
            //     target="blank"
            //     className="hover:bg-gradient-to-br from-[#405DE6] via-[#5B51D8] to-[#E1306C] rounded-full p-2"
            //   >
            //     <FiInstagram size={25} className="hover:text-white" />
            //   </Link>
            //   <Link
            //     to="https://www.facebook.com/people/Zenstudy/61555473406607/"
            //     target="blank"
            //     className="hover:bg-[#4267B2] rounded-full p-2"
            //   >
            //     <FiFacebook size={25} className="hover:text-white" />
            //   </Link>
            //   <Link
            //     to="https://twitter.com/ZenstudyZ"
            //     target="blank"
            //     className="hover:bg-[#1DA1F2] rounded-full p-2"
            //   >
            //     <FiTwitter size={25} className="hover:text-white" />
            //   </Link>
            //   <Link
            //     to="https://wa.me/919810246095"
            //     target="blank"
            //     className="flex justify-end bg-green-500  hover:bg-green-700 p-2 text-white z-50 rounded-full fixed bottom-0 right-5 mb-6 text-4xl animate-bounce ..."
            //   >
            //     <div>
            //       <FaWhatsapp />
            //     </div>
            //   </Link>
            // </div>
          }
          <form className="flex flex-col gap-4 p-6 shadow-md shadow-[#648ecd] rounded-lg max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder={!nameFocused ? "Enter your name" : ""}
          className="p-2 border text-[#000000] bg-[#fcfcfc] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          required
        />
      </div>
      <div className="relative">
        <input
          type="email"
          placeholder={!emailFocused ? "Enter your email" : ""}
          className="p-2 border text-[#000000] bg-[#fcfcfc] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          required
        />
      </div>
      <div className="relative">
        <textarea
          placeholder={!messageFocused ? "Message..." : ""}
          className="p-2 border w-full text-[#000000] bg-[#fcfcfc] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none transition duration-200 placeholder-gray-400"
          onFocus={() => setMessageFocused(true)}
          onBlur={() => setMessageFocused(false)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition duration-200 font-semibold"
      >
        Submit
      </button>
    </form>
        

          </div>
        </div>
      </div>

      <div className="lg:px-12 md:px-8 px-4 py-4 border-t border-[#CADEFB]">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="text-center flex flex-wrap items-center justify-between w-full">
            <p>Copyright (c) All Rights Reserved {date.getFullYear()}</p>
            <Link to="/" className="hover:text-white">
              <p>ZenStudy</p>
            </Link>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
