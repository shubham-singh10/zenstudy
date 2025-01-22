import React, { useState, useRef, useEffect } from "react";

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
  const[CourseSchedule, setCourseSchedule]= useState(null)

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the same index or close others
  };
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  
  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  // Function to scroll to a section and update active tab
  const scrollToSection = (ref, tabName) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tabName); // Set the active tab when clicked
  };

  const faqData = [
    {
      question: "Why should I join this course and how will this be helpful?",
      answer: "This course is designed to provide you with essential skills and knowledge to succeed.",
    },
    {
      question: "How will the classes be conducted?",
      answer: "All classes will be in Recorded format.",
    },
    {
      question: "Can the classes be downloaded?",
      answer: "Yes, classes can be downloaded for offline access.",
    },
    {
      question: "What are the class days and timings?",
      answer: "Classes are available 24/7 for your convenience.",
    },
    {
      question: "How will I get my doubts answered?",
      answer: "You can get your doubts answered via email or live support sessions.",
    },
    {
      question: "What is the Refund Policy?",
      answer: "Refunds are available as per our policy, which can be reviewed on the website.",
    },
  ];


  const scheduleData = [
    {
      title: "Notices",
      lectures: ["Lecture 1: Introduction", "Lecture 2: Guidelines"],
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Bridge Course",
      lectures: [
        "Lecture 1: Basics of Science",
        "Lecture 2: Introduction to Mathematics",
        "Lecture 3: Conceptual Thinking",
      ],
      description: "Shivam Yash Sir & Bharatendu Singh Sir & Siddharth Singh Shishodia Sir",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Polity",
      lectures: [
        "Lecture 1: Constitution Basics",
        "Lecture 2: Fundamental Rights",
      ],
      description: "Manju Choudhary Ma'am",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Economics",
      lectures: [
        "Lecture 1: Basics of Economics",
        "Lecture 2: Demand and Supply",
        "Lecture 3: National Income",
      ],
      description: "Anil Kumar Sir",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Geography",
      lectures: [
        "Lecture 1: Physical Geography",
        "Lecture 2: World Climate",
        "Lecture 3: Indian Geography",
      ],
      description: "Sunita Sharma Ma'am",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "History",
      lectures: [
        "Lecture 1: Ancient History",
        "Lecture 2: Medieval History",
        "Lecture 3: Modern History",
      ],
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
          setCourseSchedule(data.coursedetail.schedule)

          console.log("Course_data: ", CourseSchedule );
          const ImgData = {
            ...data,
            imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${data.coursedetail.thumbnail}`,
          };
         
        } catch (error) {
          
        }
      };
      getCourse();
    }, []);

  
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
          onClick={() => scrollToSection(faqRef, "teachers")}
          className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${
            activeTab === "teachers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "hover:text-blue-600"
          }`}
        >
          FAQ'S
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
      <div className="flex flex-col-reverse lg:flex-row w-full lg:mx-28">
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
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
          About the Batch
        </h2>
        <ul className="space-y-4">
          {batchDetails.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-500 text-xl mr-3">⭐</span>
              <span>
                {item.label && <strong>{item.label}:</strong>} {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="py-8" ref={scheduleRef}>
      <div className="max-w-md">
        <h2 className="text-2xl font-bold mb-6">Batch Schedules</h2>
        <div className="space-y-4">
          {(showAll ? CourseSchedule : CourseSchedule?.slice(0, 3))?.map(
            (item, index) => (
              <div
                key={index}
                className={`group rounded-lg border ${
                  openIndex === index ? "border-gray-300" : "border-transparent"
                }`}
              >
                <div
                  className={`cursor-pointer flex flex-col gap-2 p-4 ${
                    item.bgColor
                  } ${item.textColor} font-semibold rounded-lg`}
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
                  <div className="text-gray-500 text-sm">
                    {item.other2} lectures
                  </div>
                </div>

                {openIndex === index && (
                  <div className="p-4 bg-white text-gray-700">
                    {item.description && (
                      <p className="mb-2 text-sm">{item.description}</p>
                    )}
                    <ul className="list-disc pl-5">
                      {item.lectures.map((lecture, lectureIndex) => (
                        <li key={lectureIndex} className="text-sm">
                          {lecture}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </div>
        {!showAll && scheduleData.length > 3 && (
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
      {faqData.map((item, index) => (
        <div
          key={index}
          className="bg-blue-50 border rounded-lg"
        >
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
            <div className="p-4 text-gray-600 bg-blue-100">
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
