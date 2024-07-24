import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";


const WatchCourse = () => {
  const [selectedTab, setSelectedTab] = useState("About Video");


  const tabs = ["About Video", "Q&A", "Reviews"];


  const courseModules = [
    {
      moduleName: "Module Name",
      videos: [
        "First Video Title",
        "Second Video Title",
        "Third Video Title",
        "Fourth Video Title",
      ],
    },
    {
      moduleName: "Module Name",
      videos: [
        "First Video Title",
        "Second Video Title",
        "Third Video Title",
        "Fourth Video Title",
      ],
    },
    {
      moduleName: "Module Name",
      videos: [
        "First Video Title",
        "Second Video Title",
        "Third Video Title",
        "Fourth Video Title",
      ],
    },
    {
      moduleName: "Module Name",
      videos: [
        "First Video Title",
        "Second Video Title",
        "Third Video Title",
        "Fourth Video Title",
      ],
    },
  ];


  return (
    <div className="container mx-auto p-4">
      <button className="px-6 py-2 bg-blue-600 rounded-full mb-4 text-white flex justify-center items-center gap-2">
        {" "}
        <IoIosArrowBack /> Back{" "}
      </button>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Video Section */}
        <div className="lg:w-2/3">
          <div className="relative">
            <iframe
              src="https://player.vdocipher.com/v2/?otp=20160313versASE323s4S1hQSfuWTzSE0dJ7qwaqNVRlBwUF5LCSRXanNavZtxTF&playbackInfo=eyJ2aWRlb0lkIjoiMTJkY2RkZDcxMzJlNDFiZTE2NWQ0NmM5NTk0ZmVlNTEifQ=="
              className="top-0 left-0 h-[50vh] w-full border max-w-screen-lg"
              allowFullScreen
              allow="encrypted-media"
              title="Video Player"
            ></iframe>


            <button className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <div className="flex space-x-8 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`text-lg p-2 ${
                    selectedTab === tab
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {selectedTab === "About Video" && (
                <div>
                  <p className="text-gray-700">
                    Lorem Ipsum has been the industry's standard dummy text...
                  </p>
                </div>
              )}
              {selectedTab === "Q&A" && <div>Q&A Content</div>}
              {selectedTab === "Reviews" && <div>Reviews Content</div>}
            </div>
          </div>
        </div>
        {/* Course Content Section */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <h2 className="text-2xl font-bold mb-4">Course Content</h2>
          {courseModules.map((module, index) => (
            <details key={index} className="mb-4 bg-white shadow rounded-lg">
              <summary className="w-full text-left bg-blue-600 text-white font-bold p-4 cursor-pointer rounded-t-lg">
                {module.moduleName}
              </summary>
              <div className="border-t border-gray-200 rounded-b-lg overflow-hidden">
                {module.videos.map((video, idx) => (
                  <div key={idx} className="flex items-center p-2 border-t">
                    <input type="checkbox" className="mr-2" />
                    <span>{video}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};


export default WatchCourse;