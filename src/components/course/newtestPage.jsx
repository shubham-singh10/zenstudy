import React, { useState, useRef, useEffect } from "react";
import { BiCalendar } from "react-icons/bi";

const NewtestPage = () => {
  // Create refs for each section
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const scheduleRef = useRef(null);
  const faqRef = useRef(null);
  const moreDetailsRef = useRef(null);

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("features");
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [CoursesData, setCoursesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    console.log("Coupon Code Applied:", couponCode);
    setIsModalOpen(false);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the same index or close others
  };
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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

  const batchDetails = [
    { label: "Course Duration", value: "06 May 2025 - 10 Dec 2026" },
    { label: "Validity", value: "30 June 2027" },
    { label: null, value: "Online lectures" },
    { label: null, value: "DPPs and Test With Solutions" },
    {
      label: null,
      value: "Offline counseling at Vidyapeeth Centers",
    },
    {
      label: null,
      value: "One to One Telephonic PTM, based on SPD",
    },
    {
      label: null,
      value: "Physical support and helpdesk at Vidyapeeth offline Centers",
    },
    {
      label: "Subjects",
      value:
        "Physics, Botany, Zoology, Physical Chemistry, Organic Chemistry and Inorganic Chemistry",
    },
  ];

  // Perticular Course get data API
  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetail/678e0ed8bb874b63423a4601`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const mainData = data.coursedetail;
        console.log(mainData);

        const ImgData = {
          ...mainData,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${data.coursedetail.thumbnail}`,
        };
        setCoursesData(ImgData);
      } catch (error) {}
    };
    getCourse();
  }, []);

  const colors = [
    { bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { bgColor: "bg-purple-50", textColor: "text-purple-600" },
  ];

  const tabs = [
    { name: "Features", ref: featuresRef },
    { name: "About", ref: aboutRef },
    { name: "Schedule", ref: scheduleRef },
    { name: "FAQ'S", ref: faqRef },
    { name: "More Details", ref: moreDetailsRef },
  ];

  const scrollToSection = (ref, tabName) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tabName); // Set the active tab when clicked
  };

  useEffect(() => {
    // Create an IntersectionObserver to track section visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update activeTab when the section comes into view
            setActiveTab(entry.target.dataset.tab);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    // Observe all sections
    tabs.forEach((tab) => {
      if (tab.ref.current) {
        tab.ref.current.dataset.tab = tab.name.toLowerCase();
        observer.observe(tab.ref.current);
      }
    });

    // Cleanup the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="-mt-3 overflow-auto h-screen flex flex-wrap bg-gray-50">
      {/* Top Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex justify-center items-center text-white">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-wide">
          Welcome to the {CoursesData.title} Batch
        </h1>
      </div>

      {/* Tabs Section */}
      <div className="w-full h-14 bg-white sticky top-0 z-10 shadow-lg flex justify-start lg:px-36 items-center lg:space-x-8 px-2 scrollable-tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(tab.ref, tab.name.toLowerCase())}
            className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
              activeTab === tab.name.toLowerCase()
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-600"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row w-full  lg:mx-28">
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
                  <h3 className="font-bold text-lg">
                    Learn more about Infinity Batch
                  </h3>
                  <p className="text-sm text-gray-300">
                    Discover the benefits of Infinity Batch with this short
                    video
                  </p>
                </div>
                <button className="bg-gray-800 text-white flex items-center px-4 py-2 rounded-md hover:bg-gray-600">
                  <span className="mr-2">▶</span> Watch Now
                </button>
              </div>
            </div>
          </div>

          <div ref={aboutRef} className="py-8 ">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
              About the Batch
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-yellow-500 text-xl mr-3">⭐ </span>{" "}
                <span>
                  <strong>Course Duration : </strong>{" "}
                  {new Date(CoursesData.startTime).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  |{" "}
                  {new Date(CoursesData.endTime).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </li>

              {CoursesData?.features?.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">⭐</span>
                  <span>{item.features}</span>
                </li>
              ))}

              <li className="flex items-start">
                <span className="text-yellow-500 text-xl mr-3">⭐ </span>{" "}
                <strong>Subjects:{" "}</strong>{" "}
                <div className="flex flex-wrap">
                {" "}{" "}
                  {CoursesData?.subjects?.map((item, index) => (
                    <span key={index} className="mr-2">
                      {item.subject}
                      {index < CoursesData.subjects.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          <div className="py-8" ref={scheduleRef}>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold mb-6">Batch Schedules</h2>
              <div className="space-y-4">
                {(showAll
                  ? CoursesData.schedule
                  : CoursesData.schedule?.slice(0, 3)
                )?.map((item, index) => (
                  <div
                    key={index}
                    className={`group rounded-lg border ${
                      openIndex === index
                        ? "border-gray-300"
                        : "border-transparent"
                    }`}
                  >
                    <div
                      className={`cursor-pointer flex flex-col gap-2 p-4 ${
                        colors[index % colors.length].bgColor
                      } ${
                        colors[index % colors.length].textColor
                      } font-semibold rounded-lg`}
                      onClick={() => handleToggle(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.title}</span>
                        <span
                          className={`transform transition-transform ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </div>
                      <div className="text-gray-500 flex justify-between items-center text-sm">
                        ({item.other2} lectures)
                        <span
                          className={`ml-4 text-sm flex gap-1 items-center ${
                            colors[index % colors.length].textColor
                          }`}
                        >
                          <BiCalendar />
                          {new Date(item.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          -{"  "}
                          {new Date(item.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {openIndex === index && (
                      <div className="p-4 bg-white text-gray-700">
                        {item.description && (
                          <p
                            className={`mb-2 text-sm ${
                              colors[index % colors.length].textColor
                            }`}
                          >
                            {item.description}
                          </p>
                        )}
                        <ul className="list-disc pl-5">
                          {item?.lecture.map((lecture, lectureIndex) => (
                            <li key={lectureIndex} className="text-sm">
                              {lecture.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!showAll && CoursesData?.schedule?.length > 3 && (
                <button
                  className="mt-4 px-4 py-2 font-bold text-purple-600 rounded-lg"
                  onClick={handleShowMore}
                >
                  Show More...
                </button>
              )}
              {showAll && (
                <button
                  className="mt-4 px-4 py-2 font-bold text-purple-600 rounded-lg"
                  onClick={handleShowMore}
                >
                  Show less...
                </button>
              )}
            </div>
          </div>

          <div ref={faqRef} className="py-8">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {CoursesData.fAndQ !== undefined &&
                CoursesData.fAndQ.map((item, index) => (
                  <div key={index} className="bg-blue-100 border rounded-lg">
                    <div
                      className="cursor-pointer flex justify-between items-center p-4 text-gray-800 font-medium"
                      onClick={() => handleFaqToggle(index)}
                    >
                      <span>{item.question}</span>
                      <span
                        className={`transform transition-transform ${
                          openFaqIndex === index ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                    {openFaqIndex === index && (
                      <div className="p-4 text-gray-600 bg-blue-50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
            </div>
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
        <div className="w-full lg:w-[40%] bg-gray-50 p-10">
          <div className="sticky top-10 bg-white border border-gray-200 shadow-lg rounded-lg p-6">
            {/* Image Section */}
            <img
              src={CoursesData.imageUrl}
              crossOrigin="anonymous"
              alt="Course Thumbnail"
              className="w-full h-44 sm:h-64 object-cover rounded-lg mb-6"
            />

            {/* Course Title */}
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="font-bold text-lg text-blue-600 truncate">
                {CoursesData.title}
              </div>
              <div className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full shadow-sm">
                {CoursesData.language?.name}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-col md:flex-row lg:flex-row md:justify-between lg:justify-between lg:items-center mb-6">
              <p className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                ₹{CoursesData.price}{" "}
                <span className="text-red-500 line-through text-sm">
                  ₹{CoursesData?.value}
                </span>
              </p>
              <p className="text-green-700 rounded-l-md font-semibold px-3 py-1 border-l-4 border-green-600 bg-green-200 text-sm">
                Save{" "}
                {Math.round(
                  ((CoursesData?.value - CoursesData?.price) /
                    CoursesData?.value) *
                    100
                )}
                %
              </p>
            </div>

            {/* Apply Coupon Link */}
            <button
              className="text-blue-600 text-sm font-semibold hover:text-blue-800 hover:underline mb-3"
              onClick={() => setIsModalOpen(true)}
            >
              Have a coupon? Apply it here.
            </button>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-3 px-8 rounded-lg transition duration-300 w-full ">
              Enroll Now
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-2xl w-96 p-6 relative">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Apply Coupon Code
                </h2>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewtestPage;
