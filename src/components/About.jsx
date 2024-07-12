import React from 'react';
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";


const About = () => {
  return (
    <div className="flex flex-col items-center  bg-white gap-2">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>

      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:px-12 md:px-6 px-4 py-4 lg:py-10">
        <div className="relative mb-8 lg:mb-0 lg:mr-16 p-10">
          <img
            src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-0 right-0 w-[150px] h-[150px] border-t-8 border-r-8 border-blue-600 "></div>
          <div className="absolute bottom-0 left-0 w-[150px] h-[150px] border-b-8 border-l-8 border-blue-600 "></div>
        </div>
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <div className="flex flex-col space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Title Here</h3>
                  <p>
                    Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=' flex w-[100%] h-[120px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bg-blue-600 text-center justify-center items-center'>
        <div className='h-full mt-20'><ImQuotesLeft /> </div><p className='newfont text-3xl'>Making Education Imaginative. </p><div className=' h-full mt-20'><ImQuotesRight /></div>
      </div>

      <div className="flex  flex-col-reverse lg:flex-row items-center lg:items-start lg:px-12 md:px-6 px-4 py-16">

        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <div className="flex flex-col space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Title Here</h3>
                  <p>
                    Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mb-8 lg:mb-0 lg:ml-16 p-10">
          <img
            src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-0 right-0 w-[150px] h-[150px] border-t-8 border-r-8 border-blue-600 "></div>
          <div className="absolute bottom-0 left-0 w-[150px] h-[150px] border-b-8 border-l-8 border-blue-600 "></div>
        </div>
      </div>
    </div>
  );
};


export default About;


