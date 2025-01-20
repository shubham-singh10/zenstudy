import React, { useState, useRef } from "react";

const NewtestPage = () => {
  // Create refs for each section
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const scheduleRef = useRef(null);
  const teachersRef = useRef(null);
  const moreDetailsRef = useRef(null);

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("features");
  const [showAll, setShowAll] = useState(false);

  // Function to scroll to a section and update active tab
  const scrollToSection = (ref, tabName) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tabName); // Set the active tab when clicked
  };

  const scheduleData = [
    {
      title: "Notices",
      lectures: "10 Lectures",
      description: "",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Bridge Course",
      lectures: "0 Lectures",
      description:
        "Shivam Yash Sir & Bharatendu Singh Sir & Siddharth Singh Shishodia Sir",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Polity",
      lectures: "0 Lectures",
      description: "Manju Choudhary Ma'am",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Economics",
      lectures: "5 Lectures",
      description: "Anil Kumar Sir",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Geography",
      lectures: "7 Lectures",
      description: "Sunita Sharma Ma'am",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "History",
      lectures: "8 Lectures",
      description: "Rajesh Singh Sir",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ];


  const featuresData = [
    "Live Lectures",
    "DPPs",
    "NCERT Books",
    "Answer Writing",
    "Notes",
    "UPSC Wallah Hard copies",
    "Mentorship",
    "Welcome Kit",
  ];

  
  return (
    <div className="relative flex flex-wrap bg-gray-50">
      {/* Top Banner */}
      <div className="w-full -mt-3 h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex justify-center items-center text-white">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-wide">
          Welcome to the UPSC Prarambh Program
        </h1>
      </div>

      {/* Tabs Section */}
      <div className="w-full h-14 bg-white sticky top-0 z-10 shadow-lg flex justify-start lg:px-36 items-center lg:space-x-8 px-2 scrollable-tabs">
        <button
          onClick={() => scrollToSection(featuresRef, "features")}
          className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
            activeTab === "features"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "hover:text-blue-600"
          }`}
        >
          Features
        </button>
        <button
          onClick={() => scrollToSection(aboutRef, "about")}
          className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
            activeTab === "about"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "hover:text-blue-600"
          }`}
        >
          About
        </button>
        <button
          onClick={() => scrollToSection(scheduleRef, "schedule")}
          className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
            activeTab === "schedule"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "hover:text-blue-600"
          }`}
        >
          Schedule
        </button>
        <button
          onClick={() => scrollToSection(teachersRef, "teachers")}
          className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
            activeTab === "teachers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "hover:text-blue-600"
          }`}
        >
          Teachers
        </button>
        <button
          onClick={() => scrollToSection(moreDetailsRef, "moreDetails")}
          className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
            activeTab === "moreDetails"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "hover:text-blue-600"
          }`}
        >
          More Details
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row w-full lg:mx-36">
        {/* Left Section */}
        <div className="w-full lg:w-[60%] bg-white p-6">
          {/* Sections corresponding to tabs */}
          <div ref={featuresRef} className="py-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-6">Batch Features</h2>
            <div className="grid grid-cols-2 gap-y-3">
              {featuresData.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-yellow-400">✔</span>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-600" />
            <div className="flex justify-between items-center bg-gray-700 rounded-lg p-4">
              <div>
                <h3 className="font-bold text-lg">Learn more about Infinity Batch</h3>
                <p className="text-sm text-gray-300">
                  Discover the benefits of Infinity Batch with this short video
                </p>
              </div>
              <button className="bg-gray-800 text-white flex items-center px-4 py-2 rounded-md hover:bg-gray-600">
                <span className="mr-2">▶</span> Watch Now
              </button>
            </div>
          </div>
        </div>

          <div ref={aboutRef} className="py-8">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
              About
            </h2>
            <p className="text-gray-600">
              Add content about the batch here... Discuss the background and
              importance of this program.
            </p>
          </div>

          <div ref={scheduleRef} className="py-8">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6">Batch Schedules</h2>
              <div className="space-y-4">
                {(showAll ? scheduleData : scheduleData.slice(0, 3)).map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`${item.bgColor} p-4 rounded-lg`}
                    >
                      <h3 className={`font-semibold ${item.textColor}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.lectures}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
              {!showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-4 text-purple-600 font-semibold underline"
                >
                  +5 more subjects
                </button>
              )}

              {showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className="mt-4 text-purple-600 font-semibold underline"
                >
                  View Less
                </button>
              )}
            </div>
          </div>

          <div ref={teachersRef} className="py-8">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
              Teachers
            </h2>
            <p className="text-gray-600">
              Add content about teachers here... Introduce the instructors and
              their expertise.
            </p>
          </div>

          <div ref={moreDetailsRef} className="py-8">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
              More Details
            </h2>
            <p className="text-gray-600">
              Add more details about the batch here... Include additional
              information, FAQs, or testimonials.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[40%] bg-gray-100 p-6">
          <div className="sticky top-20 bg-white border border-gray-200 shadow-lg rounded-lg p-6 text-center">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Course Thumbnail"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              UPSC Prarambh 2027 + B.A. Degree Program 2.0
            </h2>
            <p className="text-2xl font-bold text-gray-800 mb-1">
              ₹64,999{" "}
              <span className="text-red-500 line-through text-base">
                ₹79,999
              </span>
            </p>
            <p className="text-green-600 text-sm mb-4">
              Discount of 19% applied
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300">
              Continue with UPSC Prarambh 2027 +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewtestPage;
