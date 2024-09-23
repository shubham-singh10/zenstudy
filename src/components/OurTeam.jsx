import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import OurTeamSlider from "./OurTeamSlider";

const OurTeam = () => {
  return (
    <div>
    <div className="mb-5"><h3 className="text-[#054BB4] font-bold text-2xl px-14 mt-10">Our Team</h3></div>
    <div className="flex flex-col lg:flex-row items-center lg:justify-between px-6 lg:px-16 py-10 lg:py-20">
    
       <div className="bg-blue-50 p-8 rounded-2xl shadow-lg flex flex-col items-center w-full md:w-[1/2] lg:w-[1/2]">
        {/* Profile Image */}
        <img
          src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*jZ9v-2QShwnfCwHlEZCmDw.png" 
          alt="Founder"
          className="w-32 h-32 rounded-full -mt-20 mb-4 shadow-lg shadow-black object-cover"
        />
        
        {/* Name and Role */}
        <h3 className="text-xl font-bold text-[#054BB4] mb-1">Founder's Name</h3>
        <p className="text-gray-500 text-sm mb-4">Lorem | Lorem</p>

        {/* Social Icons */}
        <div className="flex space-x-20 mt-4">
          <a href="#" className="text-[#054BB4] hover:text-blue-800">
            <FaFacebookF size={24} />
          </a>
          <a href="#" className="text-[#054BB4] hover:text-blue-800">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="text-[#054BB4] hover:text-blue-800">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-[#054BB4] hover:text-blue-800">
            <FaLinkedinIn size={24} />
          </a>
        </div>
      </div>
    

      {/* Founder Bio */}
      <div className="mt-10 lg:mt-0 lg:ml-12 text-center lg:text-right  w-full md:w-[1/2] lg:w-[1/2]">
        <h3 className="text-3xl font-bold">Meet Our Founder</h3>
        <p className="text-gray-600 mt-4  text-center lg:text-right">
          Lorem Ipsum has been the industry’s standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
        </p>
        <p className="text-gray-600 mt-4  text-center lg:text-right">
          Lorem Ipsum has been the industry’s standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
        </p>
        <p className="text-gray-600 mt-4  text-center lg:text-right">
          Lorem Ipsum has been the industry’s standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
        </p>
       
        <blockquote className="text-blue-600  text-2xl md:text-3xl lg:text-4xl  font-bold italic mt-4">
          “Lorem Ipsum has been the industry’s standard dummy text ever”
        </blockquote>
      </div>
    </div>

    <div>
    <h3 className="text-3xl lg:text-left md:text-left text-center px-20 font-bold">Meet Our Team</h3>
    <OurTeamSlider/>
    
    </div>
    </div>
  );
};

export default OurTeam;
