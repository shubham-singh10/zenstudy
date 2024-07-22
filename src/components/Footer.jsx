import React from "react";
import { IoCallSharp } from "react-icons/io5";
import { FaSearchLocation } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";


const Footer = () => {
  const date = new Date()
  return (
    <div className="bg-[#054BB4] w-full min-h-[35vh] text-[#CADEFB]">
      <div className="lg:px-12 md:px-8 px-4 py-4 flex flex-wrap items-start justify-between">
        {/* Upper Section */}
        <div className="w-full mt-4 lg:w-1/2 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-7 mb-5 md:mb-0">
            <div>
              <p className="text-3xl font-bold">
                ZenStudy<span>.</span>
              </p>
              <p className="text-[10px]">Making Education Imaginative</p>
            </div>
            <div>
              <p className="font-medium text-sm">
                Zen-Study is a result of the vision of "MAKING EDUCATION
                IMAGINATIVE". We have ventured into the field of education.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center ">
            <ul className="flex  flex-col gap-2 text-sm md:items-start lg:px-20 md:px-14 px-0 items-start w-full">
              <li className=" text-2xl font-semibold mb-4">Menu</li>
              <Link to="/" className="hover:text-white"><li>Home</li></Link>
              <Link to="/about" className="hover:text-white"><li>About</li></Link>
              <Link to="/article" className="hover:text-white"><li>Article</li></Link>
              <Link to="/upsc" className="hover:text-white"><li>UPSC</li></Link>
              <Link to="/courses" className="hover:text-white"><li>Courses</li></Link>
              <Link to="/contact" className="hover:text-white"><li>Contact</li></Link>
            </ul>
          </div>
        </div>




        {/* Lower Section */}
        <div className="w-full lg:w-1/2 mt-4 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-6 text-sm mb-5 md:mb-0">
            <div className="text-2xl font-semibold">Contact With Us</div>
            <div className="flex items-start gap-2">
              <IoCallSharp className="text-xl" />
              <p>+91- 9810246095</p>
            </div>
            <div className="flex items-start gap-2">
              <FaSearchLocation className="text-2xl" />
              <p>
                House no 2934, GF, Block-13, Block 7, Patel Nagar, Ranjeet Nagar, New Delhi, Delhi, 110008
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col lg:items-start md:items-start md:px-14  items-start">
            <p className="mb-4 text-2xl font-semibold ">Let’s Connect</p>

            <div className="flex items-start space-x-4">

              <Link to="#" className="hover:bg-red-500 rounded-full p-2">
                <FiYoutube size={25} className="hover:text-white" />
              </Link>

              <Link to="#" className="hover:bg-gradient-to-br from-[#405DE6] via-[#5B51D8] to-[#E1306C] rounded-full p-2">
                <FiInstagram size={25} className="hover:text-white" />
              </Link>


              <Link to="#" className="hover:bg-[#4267B2] rounded-full p-2">
                <FiFacebook size={25} className="hover:text-white" />
              </Link>

              <Link to="#" className="hover:bg-[#1DA1F2] rounded-full p-2">
                <FiTwitter size={25} className="hover:text-white" />
              </Link>

            </div>
          </div>
        </div>
      </div>

      <div className="lg:px-12 md:px-8 px-4 py-4 border-t border-[#CADEFB]">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="text-center flex flex-wrap items-center justify-between w-full">
            <p>Copyright (c) All Rights Reserved {date.getFullYear()}</p>
            <Link to="/" className="hover:text-white"><p>ZenStudy</p></Link>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};




export default Footer;


