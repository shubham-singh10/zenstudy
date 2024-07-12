import React from "react";
import { IoCallSharp } from "react-icons/io5";
import { FaSearchLocation } from "react-icons/fa";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
    const date = new Date()
  return (
    <div className="bg-[#054BB4] w-full min-h-[35vh] text-[#CADEFB]">
      <div className="px-12 py-5 flex flex-wrap items-start justify-between">
        {/* Upper Section */}
        <div className="w-full lg:w-1/2 flex flex-wrap">
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
            <ul className="flex lg:items-center justify-center flex-col gap-2 text-sm md:items-end items-start w-full">
              <li className=" text-2xl font-semibold">Menu</li>
              <li>Home</li>
              <li>About</li>
              <li>Article</li>
              <li>Upsc</li>
              <li>Courses</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>


        {/* Lower Section */}
        <div className="w-full lg:w-1/2 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-6 text-sm mb-5 md:mb-0">
            <div className="text-2xl font-semibold">Contact With Us</div>
            <div className="flex items-start gap-2">
              <IoCallSharp className="text-xl" />
              <p>+91 9831078729</p>
            </div>
            <div className="flex items-start gap-2">
              <FaSearchLocation className="text-2xl" />
              <p>
                Plot No 60, Lane 3 Heera Nagar, DCM Circle Ajmer Road, Jaipur-
                Raj. 302021
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col lg:items-end md:items-end items-start">
            <p className="mb-2 text-2xl font-semibold">Let’s Connect</p>
            <div className="flex gap-2 text-2xl items-center justify-between lg:w-[45%] md:w-[35%] w-[25%]">
              <FaInstagram />
              <FaFacebookF />
              <FaLinkedinIn />
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 py-4 border-t border-[#CADEFB]">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="text-center flex items-center justify-between w-full">
            <p>Copyright (c) All Rights Reserved {date.getFullYear()}</p>
            <p>ZenStudy</p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};


export default Footer;