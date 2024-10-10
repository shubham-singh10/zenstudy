import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import OurTeamSlider from "./OurTeamSlider";

const OurTeam = () => {
  return (
    <div>
    
    <div className="flex flex-col lg:flex-row items-center lg:justify-between px-6 lg:px-16 py-20 lg:py-20">
    
       <div className="bg-blue-50 p-8 rounded-2xl shadow-lg flex flex-col items-center w-full md:w-[1/2] lg:w-[1/2]">
        {/* Profile Image */}
        <img
          src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*jZ9v-2QShwnfCwHlEZCmDw.png" 
          alt="Founder"
          className="w-32 h-32 rounded-full -mt-20 mb-4 shadow-lg shadow-black object-cover"
        />
        
        {/* Name and Role */}
        <h3 className="text-xl font-bold text-[#054BB4] mb-1">Kumud Kishore</h3>
        <p className="text-gray-500 text-sm mb-4">Founder</p>

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
        <p className="text-gray-600 mt-4   text-sm text-center lg:text-right">
        He is a passionate individual who strives to simplify all aspects of life. This drive for simplification leads him to explore and experiment in various fields.

        </p>
        <p className="text-gray-600 mt-4  text-sm text-center lg:text-right">
        Currently, he is working on his vision and startup idea to simplify education, making it easier and more enjoyable for students to learn. His approach involves creating educational content that is supported by 3D technology and emotionally engaging. The 3D element can be enhanced through technologies like graphics and virtual reality, while emotional engagement can be achieved by infusing educational content with artistic, poetic, and musical elements.

        </p>
        <p className="text-gray-600 mt-4  text-sm text-center lg:text-right">
        His desire for simplicity also extends to his thoughts, which he expresses through poetry and storytelling. This allows him to release his deepest emotions, including love, care, happiness, sadness, spirituality, and more.

        </p>
       
        <blockquote className="text-blue-600  text-lg md:text-xl lg:text-xl  font-bold italic mt-4">
          “The method of education should be ignite the mind, to befriend the heart, and together, they both embark on a journey to discover their soul.”
        </blockquote>
      </div>
    </div>

    <div>
    <h3 className="text-3xl -mb-14 lg:mb-0 md:mb-0 lg:text-left md:text-left text-center px-20 font-bold">Meet Our Team</h3>
    <OurTeamSlider/>
    
    </div>
    </div>
  );
};

export default OurTeam;
