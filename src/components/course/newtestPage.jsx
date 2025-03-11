import React, { useState, useRef, useEffect, Fragment, useMemo } from "react";
import { BiCalendar } from "react-icons/bi";
import { GoVerified } from "react-icons/go";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import VerifyEmailMsg from "../VerifyEmailMsg";
import { Loader } from "../loader/Loader";
import CoursePageSkeleton from "./skeleton";

// Combine all imported icon sets
const AllIcons = { ...MdIcons, ...BiIcons };

const DynamicIcon = ({ iconName, className }) => {
  const IconComponent = AllIcons[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

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
  const [payloading, setPayLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [code, setCode] = useState(null);
  const [mloading, setmloading] = useState(true)
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStatus } = VerifyEmailMsg();
  const [pageLoading, setpageLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (user) {
      try {
        setCurrentUser(user?._id);
      } catch (error) {
        console.error("Error decoding user:", error);
      }
    }
  }, [user]);

  console.log("User status", userStatus);

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

  // Perticular Course get data API
  useEffect(() => {
    const getCourse = async () => {
      setmloading(true); // Start loading before API call
  
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
  
        const ImgData = {
          ...mainData,
          posterUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${data.coursedetail.poster}`,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${data.coursedetail.thumbnail}`,
        };
  
        setCoursesData(ImgData);
        console.log("CoursesData", ImgData);
  
        // Wait for 3 seconds before setting loading to false
        setTimeout(() => {
          setmloading(false);
        }, 3000);
  
      } catch (error) {
        // console.error("Error fetching course:", error);
        setmloading(false); // In case of an error, stop loading immediately
      }
    };
  
    getCourse();
  }, []);

  //Payment Initiate
  const handlePayment = async (amount) => {
    if (userStatus.emailStatus !== "verified") {
      Swal.fire({
        title: "Verify Your Email",
        text: "Please verify your email to proceed with the payment.",
        icon: "warning",
      }).then(() => {
        navigate("/profile");
      });
      return;
    }
    setPayLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API2}zenstudy/api/payment/orderNew`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            amount,
            user_id: user?._id,
            course_id: CoursesData?._id,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error: ${res.status} - ${res.statusText}\n${errorText}`);
        Swal.fire({
          title: "Oops. Course already purchase",
          text: "Please visit the MyCourse section to see course",
          icon: "error",
        }).then((result) => {
          navigate("/mycourse");
        });
        return;
      }

      const data = await res.json();
      //console.log("Data", data)
      handlePaymentVerify(data.data, CoursesData?._id);
      setPayLoading(false);
    } catch (error) {
      console.error("Error creating payment order:", error);
      setPayLoading(false);
    }
  };

  const handlePaymentVerify = async (data, selectedcourseId) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_TEST_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "ZenStudy",
      description: "Making Education Imaginative",
      order_id: data.id,
      handler: async (response) => {
        setpageLoading(true);
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API2}zenstudy/api/payment/verifyNew`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user?._id,
                course_id: CoursesData?._id,
                coursePrice: CoursesData?.price || 0,
                purchasePrice:
                  discount?.subTotal !== undefined
                    ? discount?.subTotal === 0
                      ? 1
                      : (discount?.subTotal).toFixed(2)
                    : CoursesData?.price,
                couponCode: code,
                couponApplied: code ? true : false,
                discount: discount?.discount || 0,
                coursevalidation: "2025-03-01",
              }),
            }
          );

          const verifyData = await res.json();

          console.log("VerifyData", verifyData);
          if (verifyData.message === "Payment Successful") {
            navigate(verifyData.Url);
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        } finally {
          setpageLoading(false);
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };
    //console.log("Options", options)
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const colors = [
    { bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { bgColor: "bg-purple-50", textColor: "text-purple-600" },
  ];

  const tabs = useMemo(() => {
    const baseTabs = [
      { name: "Features", ref: featuresRef },
      { name: "About", ref: aboutRef },
      { name: "FAQ'S", ref: faqRef },
      { name: "More Details", ref: moreDetailsRef },
    ];

    if (CoursesData?.schedule?.length > 0) {
      baseTabs.splice(2, 0, { name: "Schedule", ref: scheduleRef }); // Insert "Schedule" at index 2
    }

    return baseTabs;
  }, [featuresRef, aboutRef, scheduleRef, faqRef, moreDetailsRef, CoursesData]);

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
  }, [tabs]);

  if(mloading){
    return <CoursePageSkeleton />
  }
  return (
    <Fragment>
      {pageLoading && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Loader fill="white" />
        </div>
      )}

      <div className="-mt-3 overflow-auto h-screen flex flex-wrap bg-gray-50">
        {/* Top Banner */}
        <div className="w-full flex justify-center items-center relative">
          {CoursesData.posterUrl ? (
            <>
              {/* Blurred Placeholder (Visible Until Image Loads) */}
              {!imageLoaded && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
              )}

              {/* Course Poster Image */}
              <img
                src={CoursesData.posterUrl}
                crossOrigin="anonymous"
                alt="Course Poster"
                className={`w-full lg:h-full md:h-40 h-36 lg:object-contain object-fill transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex justify-center items-center text-white">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-wide">
                Welcome to the {CoursesData.title} Batch
              </h1>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        <div className="w-full h-14 bg-white sticky top-0 z-10 shadow-lg flex justify-start lg:px-36 items-center lg:space-x-8 px-2 scrollable-tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(tab.ref, tab.name.toLowerCase())}
              className={`text-gray-700 font-semibold text-sm lg:text-md transition duration-300 ${activeTab === tab.name.toLowerCase()
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-600"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col-reverse lg:flex-row w-full lg:mx-28">
          {/* Left Section */}
          <div className="w-full lg:w-[60%] bg-white p-2 md:p-3 lg:p-6">
            {/* Sections corresponding to tabs */}
            <div ref={featuresRef} className="py-8">
              <iframe
                title={CoursesData.title}
                src={`https://player.vdocipher.com/v2/?otp=${CoursesData?.previewVideo?.previewVideoUrl}&playbackInfo=${CoursesData?.previewVideo?.previewVideoDescription}`}
                className="w-full h-96"
                allowFullScreen
                allow="encrypted-media"
              ></iframe>
            </div>

            <div ref={aboutRef} className="py-8 ">
              <h2 className=" text-xl md:text-2xl lg:text-3xl font-extrabold mb-6 text-gray-800">
                Course Details
              </h2>

              {/* Course Overview Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100 shadow-sm">
                <h3 className="text-lg lg:text-xl font-bold text-blue-800 mb-4">
                  Course Overview
                </h3>
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
                    <p className="font-semibold text-gray-800">
                      {" "}
                      {new Date(CoursesData.startTime).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-6 text-gray-800">
                About the Batch
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">⭐ </span>{" "}
                  <span>
                    <strong>Course Duration : </strong>{" "}
                    {CoursesData.startTime ? (
                      <>
                        {new Date(CoursesData.startTime).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}{" "}
                        {CoursesData.endTime ? (
                          <>
                            |{" "}
                            {new Date(CoursesData.endTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </>
                        ) : (
                          <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm font-medium">
                            1.5 Years Comprehensive Program
                          </span>
                        )}
                      </>
                    ) : (
                      "24th March, 2025 - 1.5 Years Comprehensive Program"
                    )}
                  </span>
                </li>

                {CoursesData?.features?.map((item, index) => {
                  const [beforeColon, afterColon] =
                    item.features.split(/:(.+)/); // Splitting at the first colon

                  return (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 text-xl mr-3">⭐</span>
                      <span>
                        <strong>{beforeColon}:</strong> {afterColon}
                      </span>
                    </li>
                  );
                })}

                <li className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">⭐ </span>{" "}
                  <strong>Subjects:&nbsp;</strong>{" "}
                  <div className="flex flex-wrap">
                    {" "}
                    {CoursesData?.subjects?.slice(0, 6).map((item, index) => (
                      <span key={index} className="mr-2">
                        {item.subject}
                        {index < Math.min(5, CoursesData.subjects.length - 1) &&
                          ", "}
                      </span>
                    ))}
                    {CoursesData?.subjects?.length > 6 && (
                      <span> and more</span>
                    )}
                  </div>
                </li>
              </ul>
            </div>

            {CoursesData.schedule?.length > 0 && (
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
                        className={`group rounded-lg border ${openIndex === index
                          ? "border-gray-300"
                          : "border-transparent"
                          }`}
                      >
                        <div
                          className={`cursor-pointer flex flex-col gap-2 p-4 ${colors[index % colors.length].bgColor
                            } ${colors[index % colors.length].textColor
                            } font-semibold rounded-lg`}
                          onClick={() => handleToggle(index)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{item.title}</span>
                            <span
                              className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""
                                }`}
                            >
                              ▼
                            </span>
                          </div>
                          <div className="text-gray-500 flex justify-between items-center text-sm">
                            ({item.other2} lectures)
                            <span
                              className={`ml-4 text-sm flex gap-1 items-center ${colors[index % colors.length].textColor
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
                              {new Date(item.endDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        {openIndex === index && (
                          <div className="p-4 bg-white text-gray-700">
                            {item.description && (
                              <p
                                className={`mb-2 text-sm ${colors[index % colors.length].textColor
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
            )}

            {/* Special Offer */}
            {CoursesData &&
              CoursesData.Offer?.map((item, index) => (
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white mb-8"
                  key={index}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Exclusive Offer
                      </h3>
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
                          <span>
                            {item.title} {item.description}
                          </span>
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
                          <span>{item.refundPolicy}</span>
                        </li>
                      </ul>
                    </div>
                    {currentUser ? (
                      <button
                        className={` ${payloading
                          ? "bg-gradient-to-r from-red-600 to-red-800 cursor-not-allowed"
                          : "mt-4 md:mt-0 bg-white text-indigo-600 hover:bg-gray-100 transition duration-300"
                          } font-bold py-3 px-6 rounded-lg `}
                        onClick={() =>
                          handlePayment(
                            discount
                              ? discount.subTotal === 0
                                ? 1
                                : discount.subTotal.toFixed(2)
                              : CoursesData?.price
                          )
                        }
                        disabled={payloading}
                      >
                        {payloading ? "Wait..." : item.buttonText}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/login/${CoursesData._id}`)}
                        className="mt-4 md:mt-0 bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300"
                      >
                        {item.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              ))}

            <div ref={faqRef} className="py-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-6 text-gray-800">
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
                          className={`transform transition-transform ${openFaqIndex === index ? "rotate-180" : ""
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

            <div ref={moreDetailsRef} className="py-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-4 text-gray-800">
                More Details...
              </h2>
            </div>

            <div ref={moreDetailsRef}>
              {/* Class Features */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {CoursesData?.dynamicSections?.map((section, index) => {
                  const isMentorship = section.title
                    .toLowerCase()
                    .includes("mentorship");
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <div
                          className={`${section.bgColor || "bg-gray-200"
                            } p-2 rounded-full mr-3`}
                        >
                          <DynamicIcon
                            iconName={section.icon}
                            className={`w-6 h-6 ${section.textColor}`}
                          />
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                          {section.title}
                        </h3>
                      </div>
                      {isMentorship ? (
                        <>
                          <div className="p-4 bg-green-50 rounded-lg mb-4 border border-green-100">
                            {section?.contents?.map((item, i) => (
                              <Fragment key={i}>
                                <p className="text-gray-700">{item.text}</p>
                              </Fragment>
                            ))}
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
                              <span className="font-medium">
                                Personal Guidance
                              </span>
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
                              <span className="font-medium">
                                Doubt Clearing Sessions
                              </span>
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
                              <span className="font-medium">
                                Motivational Sessions
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <ul className="space-y-3">
                          {section?.contents?.map((item, i) => (
                            <li
                              key={i}
                              className={`flex items-start space-x-2 ${item.highlight
                                ? "font-medium scale-105 transition-all duration-200"
                                : ""
                                }`}
                            >
                              <GoVerified
                                size={20}
                                className={`text-green-500 mt-1`}
                              />
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
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
                  <h3 className=" text-lg lg:text-xl font-bold text-gray-800">
                    Subjects Covered
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 justify-center items-center">
                  {CoursesData?.subjects?.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-100"
                    >
                      <span className="p-1 text-indigo-700 text-lg font-medium">
                        {subject.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {CoursesData &&
                    CoursesData.whyChooseUs?.map((item, index) => (
                      <div className="flex items-start" key={index}>
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
                        <p>{item.point}</p>
                      </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center">
                  {currentUser ? (
                    <button
                      className={` ${payloading
                        ? "bg-gradient-to-r from-red-600 to-red-800 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-500  hover:from-yellow-500 hover:to-yellow-600 transition duration-300 shadow-lg"
                        } text-gray-900 font-bold py-3 px-8 rounded-lg `}
                      onClick={() =>
                        handlePayment(
                          discount
                            ? discount.subTotal === 0
                              ? 1
                              : discount.subTotal.toFixed(2)
                            : CoursesData?.price
                        )
                      }
                      disabled={payloading}
                    >
                      {payloading
                        ? "Wait..."
                        : "Enroll Now and Start Your UPSC Journey!"}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/login/${CoursesData._id}`)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300 shadow-lg"
                    >
                      Enroll Now and Start Your UPSC Journey!
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-[40%] bg-gray-50 p-2 md:p-5 lg:p-10">
            <div className="sticky top-20 bg-white border border-gray-200 shadow-lg rounded-lg p-6">
              {/* Image Section */}
              <img
                src={CoursesData.imageUrl}
                crossOrigin="anonymous"
                alt="Course Thumbnail"
                className="w-full mb-4 lg:object-contain object-contain border-2 border-gray-200 rounded-lg"
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
              {currentUser ? (
                <button
                  className={` ${payloading
                    ? "bg-gradient-to-r from-red-600 to-red-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                    }  text-white font-medium py-3 px-8 rounded-lg transition duration-300 w-full`}
                  onClick={() =>
                    handlePayment(
                      discount
                        ? discount.subTotal === 0
                          ? 1
                          : discount.subTotal.toFixed(2)
                        : CoursesData?.price
                    )
                  }
                  disabled={payloading}
                >
                  {payloading ? "Wait..." : "Enroll Now"}
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/login/${CoursesData._id}`)}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-3 px-8 rounded-lg transition duration-300 w-full "
                >
                  Login to Purchase
                </button>
              )}
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
      </div >
    </Fragment >
  );
};

export default NewtestPage;
