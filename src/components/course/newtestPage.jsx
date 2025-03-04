import React, { useState, useRef, useEffect } from "react";
import { BiBadge, BiCalendar } from "react-icons/bi";
import { GoVerified } from "react-icons/go";


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
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetail/67c6afd0d79cf3c90ab0d7f7`,
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
        console.log("main",mainData);

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

          <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Course Details</h2>

          {/* Course Overview Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100 shadow-sm">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Course Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              {CoursesData.description}
            </p>
            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-100 flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Start Date</p>
                <p className="font-semibold text-gray-800"> {new Date(CoursesData.startTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}</p>
              </div>
            </div>
          </div>
          
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
           
          </div>


          <div ref={moreDetailsRef} >
          

          {/* Class Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
  {CoursesData?.dynamicSections?.map((section, index) => (
    <div
      key={index}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center mb-4">
        <div className={`${section.bgColor || "bg-gray-200"} p-2 rounded-full mr-3`}>
          {section.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
      </div>

      <ul className="space-y-3">
        {section?.contents?.map((item, i) => (
          <li key={i} className="flex items-start space-x-2">
            <GoVerified className="text-green-500 mt-1" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>




          {/* Test Series and Mentorship */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <BiBadge/>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Test Series</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Regular MCQ and Mains answer writing practice by faculty</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Prelims test series- part length and full length test every 15 days</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Main test series: full length and part length mains answer writing programme</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Continuous test series until exams to keep you exam-ready</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v          3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Mentorship & Support</h3>
              </div>
              <div className="p-4 bg-green-50 rounded-lg mb-4 border border-green-100">
                <p className="text-gray-700">
                  Interact and discuss about doubts and study related issues with your personal mentor who would be
                  available constantly during your preparation journey.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Personal Guidance</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Doubt Clearing Sessions</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Motivational Sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Covered */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Subjects Covered</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {CoursesData?.subjects?.map((subject, index) => (
                <div key={index} className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-100">
                  <span className="text-indigo-700 font-medium">{subject.subject}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Exclusive Offer</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-300 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Affordable Fees: All this at just ₹9,999/-</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-300 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Special Refund Policy: Clear the Prelims in your first attempt with us and get a 100% fee
                      refund!
                    </span>
                  </li>
                </ul>
              </div>
              <button className="mt-4 md:mt-0 bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
                Enroll Now
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">9810246095</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a href="https://www.zenstudy.in" className="font-semibold text-blue-600 hover:underline">
                    www.zenstudy.in
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-800">7/46, Shankar Rd, Old Rajinder Nagar, Delhi, 110060</p>
                </div>
              </div>
            </div> 
          </div>

          {/* Why Choose Us */}
          <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-yellow-500 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Comprehensive syllabus coverage by industry experts</p>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-500 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Structured learning with consistent support</p>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-500 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Effective test series with detailed feedback</p>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-500 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Opportunity to save on fees with our unique refund policy</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300 shadow-lg">
                Enroll Now and Start Your UPSC Journey!
              </button>
            </div>
          </div>
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
