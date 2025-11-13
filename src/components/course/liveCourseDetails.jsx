"use client";

import { useState, useRef, useEffect, Fragment, useMemo } from "react";
import { BiCalendar } from "react-icons/bi";
import { GoVerified } from "react-icons/go";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import VerifyEmailMsg from "../VerifyEmailMsg";
import { Loader } from "../loader/Loader";
import CoursePageSkeleton from "./course-detailslive-skeleton";
import toast from "react-hot-toast";
import { VideoPlayer } from "../VideoPage";
import axios from "axios";
import Testing from "../testing";

// Combine all imported icon sets
const AllIcons = { ...MdIcons, ...BiIcons };

const DynamicIcon = ({ iconName, className }) => {
  const IconComponent = AllIcons[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

const LiveCourseDetailsPage = () => {
  // Create refs for each section
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const scheduleRef = useRef(null);
  const faqRef = useRef(null);
  const moreDetailsRef = useRef(null);
  const { coursename } = useParams();

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
  const [couponLoading, setCouponLoading] = useState(false);
  const [mloading, setmloading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStatus } = VerifyEmailMsg();
  const [pageLoading, setpageLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setTokenData] = useState(null);

  // Image loading states
  const [bannerImageLoaded, setBannerImageLoaded] = useState(false);

  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        setCurrentUser(user?._id);
      } catch (error) {
        console.error("Error decoding user:", error);
      }
    }
  }, [user]);

  const handleApplyCoupon = async () => {
    try {
      setCouponLoading(true);
      const sendData = {
        code: couponCode,
        coursePrice: CoursesData?.price,
        courseId: CoursesData?._id,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/coupon/applyCoupon`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          toast.error(
            ` ${errorData.message}`
          )`Network response was not ok: ${response.status} - ${errorData.message}`
        );
      }

      const data = await response.json(); // Parse the successful response
      setDiscount(data);
      setCouponLoading(false);

      toast.success("Discount applied successfull!!", {
        position: "top-center",
      });
      setIsModalOpen(false);
    } catch (error) {
      setCouponLoading(false);
    }
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

  // Preload images function
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Perticular Course get data API
  useEffect(() => {
    const getCourse = async () => {
      setmloading(true); // Start loading before API call

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetailslug/${coursename}`,
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

        const posterUrl = data.coursedetail.poster;

        const ImgData = {
          ...mainData,
          posterUrl,
        };

        setCoursesData(ImgData);

        // Preload images in background
        try {
          await Promise.all([
            preloadImage(posterUrl).then(() => setBannerImageLoaded(true)),
          ]);
        } catch (err) {
          console.error("Error preloading images:", err);
          // If preloading fails, we'll still show the images normally
          setBannerImageLoaded(true);
        }

        // Gradually reveal content with a slight delay after images are loaded
        setTimeout(() => {
          setmloading(false);
          // Add a small delay before showing content for a smoother transition
          setTimeout(() => {
            setContentVisible(true);
          }, 300);
        }, 1000);
      } catch (error) {
        setmloading(false);
        setContentVisible(true);
        setBannerImageLoaded(true);
      }
    };

    getCourse();
  }, [coursename]);

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

    // Facebook Pixel - InitiateCheckout
    if (window.fbq) {
      fbq("track", "InitiateCheckout", {
        value: amount,
        currency: "INR",
        content_ids: [CoursesData?._id],
        content_type: "product",
      });
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API2}zenstudy/api/payment/order`,
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
        }).then(() => {
          navigate("/mycourse");
        });
        return;
      }

      const data = await res.json();
      handlePaymentVerify(data.data, CoursesData?._id);
      setPayLoading(false);
    } catch (error) {
      console.error("Error creating payment order:", error);
      setPayLoading(false);
    }
  };

  const handlePaymentVerify = async (data, selectedcourseId) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Zenstudy",
      description: "Making Education Imaginative",
      order_id: data.id,
      handler: async (response) => {
        setpageLoading(true);
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API2}zenstudy/api/payment/verify`,
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
                couponCode: couponCode,
                couponApplied: couponCode ? true : false,
                discount: discount?.discount || 0,
                coursevalidation: "2025-03-01",
              }),
            }
          );

          const verifyData = await res.json();

          if (verifyData.message === "Payment Successful") {
            // Facebook Pixel - Purchase
            if (window.fbq) {
              fbq("track", "Purchase", {
                value: discount?.subTotal || CoursesData?.price,
                currency: "INR",
                content_ids: [CoursesData?._id],
                content_type: "product",
              });
            }

            navigate(verifyData.Url);
          } else {
            navigate(verifyData.Url);
            toast.success(
              `Purchase successful! However, we couldn't send the confirmation email. Please check your course in the "My Courses" section.`,
              {
                position: "top-right",
                duration: 5000,
                icon: "⚠️",
              }
            );
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
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const createToken = async (
    courseId,
    amount,
    couponCode,
    discount,
    couponApplied,
    purchasePrice
  ) => {
    const sendData = {
      courseId,
      amount: purchasePrice,
      coursePrice: amount,
      couponCode,
      couponApplied,
      discount,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/payment/create-token`,
        sendData
      );
      // console.log("Token response:", res.data);
      if (res.data) {
        setTokenData(res.data.token);
      }
      
    } catch (error) {
      console.log("something went wrong", error);
    }
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

  if (mloading) {
    return <CoursePageSkeleton />;
  }

  if (token) {
    return (
      <Testing
        token={token}
        price={
          discount
            ? discount.subTotal === 0
              ? 1
              : discount.subTotal.toFixed(2)
            : CoursesData?.price
        }
        courseName={CoursesData?.title || "Zenstudy Course"}
      />
    );
  }

  return (
    <Fragment>
      {pageLoading && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Loader fill="white" />
        </div>
      )}


      <div
        className={`-mt-3 overflow-auto h-screen flex flex-wrap bg-gray-50 transition-opacity duration-500 ease-in-out ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Banner */}
        <div className="hidden md:flex w-full justify-center items-center relative">
          {CoursesData.posterUrl ? (
            <>
              {/* Blurred Placeholder (Visible Until Image Loads) */}
              <div
                className={`absolute inset-0 w-full h-full bgGredient-purple transition-opacity duration-700 ${
                  bannerImageLoaded ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Course Poster Image */}
              <img
                src={CoursesData.posterUrl || "/placeholder.svg"}
                crossOrigin="anonymous"
                alt="Course Poster"
                className={`w-full lg:h-full md:h-40 h-36 lg:object-contain object-fill transition-opacity duration-700 ${
                  bannerImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="w-full h-40 bgGradient-purple-light flex justify-center items-center text-white">
              <h1 className="text-2xl  textGreen lg:text-4xl font-bold tracking-wide">
               {CoursesData.title} 
              </h1>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        <div className="w-full h-14 bgGredient-purple sticky top-0 z-10 shadow-lg flex justify-start lg:px-36 items-center lg:space-x-8 px-2 scrollable-tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(tab.ref, tab.name.toLowerCase())}
              className={`textLight font-semibold text-sm lg:text-md transition duration-300 ${
                activeTab === tab.name.toLowerCase()
                  ? "textGold border-b-2 border-[#efdb78]"
                  : "hover:text-[#efdb78]"
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
            {CoursesData?.previewVideo?.previewVideoDescription &&
            <div ref={featuresRef} className="py-8">
              <VideoPlayer
                videopath={CoursesData?.previewVideo?.previewVideoDescription}
              />
            </div>
  }
            <div ref={aboutRef} className="py-8 ">
              <h2 className=" text-xl md:text-2xl lg:text-3xl font-extrabold mb-6 textPurple">
                Course Details
              </h2>

              {/* Course Overview Card */}
              <div className="bgGradient-purple-light rounded-xl p-6 mb-8 border border-[#543a5d] shadow-sm">
                <h3 className="text-lg lg:text-xl font-bold textPurple mb-4">
                  Course Overview
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {CoursesData.description}
                </p>

              {CoursesData?.startTime && <div className="mt-4 bg-white rounded-lg p-4 border border-p-urple100 flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 textPurple"
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
                </div>}
              
                </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-6 textPurple">
                About the Batch
              </h2>
              <ul className="space-y-4">
                {CoursesData.title?.includes("UPSC Foundation Batch") && <li className="flex items-start">
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
                          <span className="ml-1 bg-purple-100 textPurple px-2 py-0.5 rounded-full text-sm font-medium">
                            1.5 Years Comprehensive Program
                          </span>
                        )}
                      </>
                    ) : (
                      "24th March, 2025 - 1.5 Years Comprehensive Program"
                    )}
                  </span>
                </li>
}
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
            )}

            {/* Special Offer */}
            {CoursesData &&
              CoursesData.Offer?.map((item, index) => (
                <div
                  className="bgGredient-purple-lr rounded-xl p-6 text-white mb-8"
                  key={index}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-2xl textGold font-bold mb-2">
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
                        className={` ${
                          payloading
                            ? "bg-gradient-to-r from-red-600 to-red-800 cursor-not-allowed"
                            : "mt-4 md:mt-0 bgGredient-gold textDark hover:bg-gray-100 transition duration-300"
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
                        onClick={() => {
                          createToken(
                            CoursesData._id,
                            CoursesData?.price,
                            couponCode ? couponCode : null,
                            discount ? discount.subTotal : 0,
                            couponCode ? true : false,
                            discount?.subTotal !== undefined
                              ? discount?.subTotal === 0
                                ? 1
                                : (discount?.subTotal).toFixed(2)
                              : CoursesData?.price
                          );

                          // Facebook Pixel track event
                          if (window.fbq) {
                            fbq("trackCustom", "LoginToPurchaseClick", {
                              course_name: coursename,
                            });
                          }
                        }}
                        className="mt-4 md:mt-0  bgGredient-gold textDark font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300"
                      >
                        {item.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              ))}

            <div ref={faqRef} className="py-8">
              <h2 className="text-xl textPurple md:text-2xl lg:text-3xl font-extrabold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {CoursesData.fAndQ !== undefined &&
                  CoursesData.fAndQ.map((item, index) => (
                    <div key={index} className="bg-purple-50 border rounded-lg">
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
                        <div className="p-4 text-gray-600 bg-[#fdfdfd]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div ref={moreDetailsRef} className="py-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-4 textPurple">
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
                          className={`${
                            section.bgColor || "bg-gray-200"
                          } p-2 rounded-full mr-3`}
                        >
                          <DynamicIcon
                            iconName={section.icon}
                            className={`w-6 h-6 ${section.textColor}`}
                          />
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold textPurple">
                          {section.title}
                        </h3>
                      </div>
                      {isMentorship ? (
                        <>
                          <div className="p-4 bg-purple-50 rounded-lg mb-4 border border-[#543a5d]">
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
                                  className="h-5 w-5 textGreen"
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
                                  className="h-5 w-5 textGreen"
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
                                  className="h-5 w-5 textGreen"
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
                              className={`flex items-start space-x-2 ${
                                item.highlight
                                  ? "font-medium scale-105 transition-all duration-200"
                                  : ""
                              }`}
                            >
                              <GoVerified
                                size={20}
                                className={`textGreen mt-1`}
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
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 textGold"
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
                  <h3 className=" text-lg lg:text-xl font-bold textPurple">
                    Subjects Covered
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 justify-center items-center">
                  {CoursesData?.subjects?.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-indigo-50 rounded-lg p-3 text-center border border-[#543a5d]"
                    >
                      <span className="p-1 textPurple text-lg font-medium">
                        {subject.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="mt-8 bgGredient-green  rounded-xl p-6 text-white">
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
                      className={` ${
                        payloading
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
                      onClick={() => {
                        createToken(
                          CoursesData._id,
                          CoursesData?.price,
                          couponCode ? couponCode : null,
                          discount ? discount.subTotal : 0,
                          couponCode ? true : false,
                          discount?.subTotal !== undefined
                            ? discount?.subTotal === 0
                              ? 1
                              : (discount?.subTotal).toFixed(2)
                            : CoursesData?.price
                        );

                        // Facebook Pixel track event
                        if (window.fbq) {
                          fbq("trackCustom", "LoginToPurchaseClick", {
                            course_name: coursename,
                          });
                        }
                      }}
                      className="bgGredient-gold text-gray-900 font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300 shadow-lg"
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
              <div className="relative w-full mb-4 aspect-video">
                {/* Blurred Placeholder (Visible Until Image Loads) */}

                <img
                  src={CoursesData.thumbnailS3 || "/placeholder.svg"}
                  crossOrigin="anonymous"
                  alt="Course Thumbnail"
                  className={`w-full h-full object-contain border-2 border-gray-200 rounded-lg transition-opacity duration-700 opacity-100`}
                />
              </div>

              {/* Course Title */}
              <div className="flex flex-row justify-between items-center mb-4">
                <div className="font-bold text-lg textPurple truncate">
                  {CoursesData.title}
                </div>
                <div className="px-3 py-1 text-sm font-medium textGold bgGredient-green bg-gray-100 rounded-full shadow-sm">
                  {CoursesData.language?.name}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="flex flex-col md:flex-row lg:flex-row md:justify-between lg:justify-between lg:items-center mb-6">
                <p className="text-xl font-bold textPurple mb-2 sm:mb-0">
                  <span className="text-red-500 line-through text-sm mr-2">
                    {discount
                      ? `₹ ${CoursesData?.price}`
                      : `₹ ${CoursesData?.value}`}
                  </span>
                  ₹
                  {discount?.subTotal
                    ? discount?.subTotal.toFixed(2)
                    : CoursesData.price}{" "}
                </p>

                <p className="textGold rounded-l-md font-semibold px-3 py-1 border-l-4 border-[#efdb78] bgGredient-green text-sm">
                  Save{" "}
                  {Math.round(
                    ((CoursesData?.value - CoursesData?.price) /
                      CoursesData?.value) *
                      100
                  )}
                  %
                </p>
              </div>
              {discount?.subTotal && (
                <p className="textGold text-sm">
                  Extra discount applied! You saved ₹
                  {(CoursesData.price - discount?.subTotal).toFixed(2)}
                </p>
              )}

              {/* Apply Coupon Link */}
           
                <button
                  className="textPurple text-sm font-semibold hover:text-[#292b27] hover:underline mb-3"
                  onClick={() => setIsModalOpen(true)}
                >
                  Have a coupon? Apply it here.
                </button>
              

              {/* CTA Button */}
              {currentUser ? (
                <button
                  className={` ${
                    payloading
                      ? "bg-gradient-to-r from-red-600 to-red-800 cursor-not-allowed"
                      : "bgGredient-purple hover:from-[#935aa6] hover:to-[#543a5d]"
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
                  onClick={() => {
                    createToken(
                      CoursesData._id,
                      CoursesData?.price,
                      couponCode ? couponCode : null,
                      discount ? discount.subTotal : 0,
                      couponCode ? true : false,
                      discount?.subTotal !== undefined
                        ? discount?.subTotal === 0
                          ? 1
                          : (discount?.subTotal).toFixed(2)
                        : CoursesData?.price
                    );

                    // Facebook Pixel track event
                    if (window.fbq) {
                      fbq("trackCustom", "LoginToPurchaseClick", {
                        course_name: coursename,
                      });
                    }
                  }}
                  className="bgGredient-purple-lr hover:from-[#543a5d] hover:to-[#935aa6] text-white font-medium py-3 px-8 rounded-lg transition duration-300 w-full "
                >
                  Login to Purchase
                </button>
              )}
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-2xl w-96 p-6 relative">
                  <h2 className="text-lg font-semibold textPurple mb-4">
                    Apply Coupon Code
                  </h2>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#543a5d] transition"
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
                      disabled={couponLoading}
                      className={`${
                        couponLoading
                          ? "bg-red-600 cursor-not-allowed"
                          : "bgGredient-purple hover:bg-purple-900 hover:text-[#efdb78]"
                      } text-white font-medium py-2 px-4 rounded-lg transition`}
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
    </Fragment>
  );
};

export default LiveCourseDetailsPage;
