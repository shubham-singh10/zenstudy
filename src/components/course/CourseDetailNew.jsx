import React, { useEffect, useRef, useState } from "react";
import { GrLanguage } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdOutlineVerified, MdSlowMotionVideo } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { VerifyEmailMsg } from "../VerifyEmailMsg";
import { useAuth } from "../../context/auth-context";
import { FaChevronDown } from "react-icons/fa";
import {
  FiArrowDown,
  FiArrowUp,
  FiClock,
  FiLoader,
  FiUser,
} from "react-icons/fi";

const NewCourseDetailPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [expandedAccordionItem, setExpandedAccordionItem] = useState(null);

  const [coursePost, setCoursePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
  const [imgloading, setImgLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payloading, setPayLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [code, setCode] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [pageloading, setpageLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentUser, setCurrentUser] = useState(false);
  const { userStatus } = VerifyEmailMsg();
  const { user } = useAuth();

  const ApplyCoupon = async (price) => {
    try {
      setCouponLoading(true);
      const sendData = {
        code: code,
        coursePrice: price,
        courseId: coursePost?._id,
      };
      // console.log("Sending data:", sendData);

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
      // console.log("Coupon applied successfully:", data);
      return data; // Optionally return the response data
    } catch (error) {
      // console.error("Error applying coupon:", error);
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // If scrolled past 200px, show sticky header
      setShowStickyHeader(window.scrollY > 400);
    };

    // Attach event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      try {
        setCurrentUser(user?._id);
      } catch (error) {
        console.error("Error decoding user:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetailslug/Indian-Economy`,
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

        console.log("Course_data: ", data);
        const ImgData = {
          ...data,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${data.coursedetail.thumbnail}`,
        };
        setImageSrc(ImgData.imageUrl);
        setCoursePost(data.coursedetail);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getCourse();
  }, []);

  useEffect(() => {
    if (discount) {
      // Assuming you only want to show confetti if there's a discount
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [discount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="text-4xl font-bold animate-pulse">Zenstudy</div>
      </div>
    );
  }

  if (error) {
    navigate("/courses");
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold text-red-600">
          {" "}
          Error: Please refresh the page.
        </div>
      </div>
    );
  }

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
        `${process.env.REACT_APP_API2}zenstudy/api/payment/order`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            amount,
            user_id: user?._id,
            course_id: coursePost?._id,
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
      handlePaymentVerify(data.data, coursePost?._id);
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
                course_id: coursePost?._id,
                coursePrice: coursePost?.price || 0,
                purchasePrice:
                  discount?.subTotal !== undefined
                    ? discount?.subTotal === 0
                      ? 1
                      : (discount?.subTotal).toFixed(2)
                    : coursePost?.price,
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

  const faqItems = [
    {
      question: "Who is this course for?",
      answer:
        "This course is designed for beginners with no prior coding experience, as well as intermediate developers looking to expand their skills in web development.",
    },
    {
      question: "How long do I have access to the course?",
      answer:
        "You will have lifetime access to the course content, including any future updates and additions.",
    },
    {
      question: "Is there a certificate upon completion?",
      answer:
        "Yes, you will receive a certificate of completion once you finish all the course modules and pass the final project assessment.",
    },
    {
      question: "What if I'm not satisfied with the course?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with the course content, you can request a full refund within 30 days of purchase.",
    },
    {
      question: "Do I need any special software or hardware?",
      answer:
        "You'll need a computer with an internet connection. All the necessary software used in this course is free and open-source. We'll guide you through the installation process.",
    },
  ];

  const firstModule = coursePost?.modules[0];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white shadow-md transition-transform duration-300 z-50 ${
          showStickyHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-600 truncate">
            {coursePost?.title}
          </h2>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600 mr-4">
              {discount ? (
                <div className="flex items-center">
                  <span className="line-through opacity-75 text-lg mr-2">
                    ₹ {Math.round(coursePost?.price)}
                  </span>
                  <span>
                    ₹{" "}
                    {discount.subTotal === 0 ? 1 : discount.subTotal.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span>₹ {Math.round(coursePost?.price)}</span>
              )}
            </span>
            {currentUser ? (
              <button
                className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center ${
                  payloading ? "cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handlePayment(
                    discount
                      ? discount.subTotal === 0
                        ? 1
                        : discount.subTotal.toFixed(2)
                      : coursePost?.price
                  )
                }
                disabled={payloading}
              >
                {payloading ? (
                  <span className="flex items-center gap-1">
                    <FiLoader className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Enroll Now"
                )}
              </button>
            ) : (
              <button
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                onClick={() => navigate(`/login/${coursePost?._id}`)}
              >
                Log In to Enroll
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div
          className="grid md:grid-cols-2 gap-8 items-center mb-12"
        >
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Bestseller
            </span>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {coursePost && coursePost.title}
            </h1>
            <p className="text-xl mb-6 text-gray-600">
              Learn HTML, CSS, JavaScript, React, and Node.js in this
              comprehensive course
            </p>

            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
              <div className="flex items-center gap-1">
                <FiUser />
                <span>10,000+ students</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock />
                <span>50 hours</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <GrLanguage />
                <span>{coursePost && coursePost?.language?.name}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-3">
                ₹ {coursePost && coursePost?.price}
              </div>
              <div className="text-lg text-gray-500 line-through">
                ₹ {coursePost?.value}
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
            {firstModule ? (
              <div key={0}>
                {firstModule?.videos && firstModule?.videos?.length > 0 ? (
                  <div key={firstModule?.videos[0]._id}>
                    {firstModule?.videos[0].videoUrl ? (
                      <iframe
                        title={firstModule?.videos[0].title}
                        src={`https://player.vdocipher.com/v2/?otp=${firstModule?.videos[0].videoCode}&playbackInfo=${firstModule?.videos[0].playBackInfo}`}
                        className="w-full aspect-video rounded-md"
                        allowFullScreen
                        allow="encrypted-media"
                      ></iframe>
                    ) : (
                      <div>No video URL provided</div>
                    )}
                  </div>
                ) : (
                  <div>No videos available</div>
                )}
              </div>
            ) : (
              <div className="relative">
                {imgloading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-2xl">
                    <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
                  </div>
                )}
                <img
                  src={imageSrc}
                  crossOrigin="anonymous"
                  alt="Course Thumbnail"
                  className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${
                    imgloading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImgLoading(false)}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Preview
              </button>
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Course Overview</h2>
          <p
            className={`text-gray-700 ${
              showFullDescription ? "" : "line-clamp-3"
            }`}
          >
            {coursePost && coursePost?.description}
            <br></br>
            {coursePost && coursePost?.other1}
          </p>
          <button
            className="text-blue-600 mt-2 flex items-center"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? (
              <span className="flex items-center gap-1">
                Show less
                <FiArrowUp />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Show more
                <FiArrowDown />
              </span>
            )}
          </button>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "HTML5 structure and semantics",
              "CSS3 styling and responsive design",
              "JavaScript fundamentals and ES6+ features",
              "React.js for building dynamic user interfaces",
              "Node.js and Express for server-side development",
              "Database integration with MongoDB",
              "RESTful API design and implementation",
              "Authentication and authorization techniques",
            ].map((item, index) => (
              <li key={index} className="flex  gap-1 items-center">
                <MdOutlineVerified color="lightgreen" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Content */}
        {coursePost?.modules?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            {coursePost?.modules?.map((section, index) => (
              <div key={index} className="border-2 border-gray-100 rounded-lg mb-4 px-4 py-1"> 
                <button
                  className="w-full py-4 flex justify-between items-center focus:outline-none"
                  onClick={() =>
                    setExpandedAccordionItem(
                      expandedAccordionItem === index ? null : index
                    )
                  }
                >
                  <span className="font-medium">{section?.moduleTitle}</span>
                  <FaChevronDown className={`w-5 h-5 transition-transform ${
                      expandedAccordionItem === index
                        ? "transform rotate-180"
                        : ""
                    }`}/>
                 
                </button>
                {expandedAccordionItem === index && (
                  <div className="py-0">
                    {section?.videos?.length > 0 ? (
                      section?.videos?.map(({ _id, videoTitle, IsFree }) => (
                        <div
                          className="pb-2 px-2 rounded-md flex items-center  bg-gray-50 justify-start"
                          key={_id}
                        >
                          <MdSlowMotionVideo className="text-blue-500" />
                          <p className="px-4 py-2 text-gray-500 w-full">
                            {videoTitle || "no videos"}
                          </p>
                          {IsFree ? (
                            <FaLockOpen className="text-blue-400" />
                          ) : (
                            <FaLock className="text-blue-400" />
                          )}
                        </div>
                      ))
                    ) : (
                      <h2>No videos</h2>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pricing and Enrollment */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-lg shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold mb-6">
            Enroll Now and Start Your Journey
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <span className="text-4xl font-bold">
                {discount ? (
                  <div className="flex items-center">
                    <span className="line-through  opacity-75 text-lg mr-2">
                      ₹ {Math.round(coursePost?.price)}
                    </span>
                    <span>
                      ₹{" "}
                      {discount.subTotal === 0
                        ? 1
                        : discount.subTotal.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span>₹ {Math.round(coursePost?.price)}</span>
                )}
              </span>

              <p className="text-lg mt-2">
                {isCouponApplied
                  ? "60% discount applied!"
                  : "50% discount - Limited time offer!"}
              </p>
            </div>
            <div className="w-full md:w-auto">
              {currentUser && (
                <div className="flex mb-4">
                  <input
                    type="text"
                    id="coupon"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                    placeholder="Enter Coupon Code"
                  />
                  <button
                    onClick={() => ApplyCoupon(coursePost?.price)}
                    disabled={couponLoading}
                    className={`${
                      couponLoading
                        ? `bg-red-800 cursor-not-allowed`
                        : "bg-blue-800 hover:bg-blue-900 "
                    } text-white px-4 py-2 rounded-r-md transition-colors`}
                  >
                    <span className="text-xs block w-full">
                      {couponLoading ? "Wait..." : "Apply"}
                    </span>
                  </button>
                </div>
              )}

              {currentUser ? (
                <button
                  className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center ${
                    payloading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    handlePayment(
                      discount
                        ? discount.subTotal === 0
                          ? 1
                          : discount.subTotal.toFixed(2)
                        : coursePost?.price
                    )
                  }
                  disabled={payloading}
                >
                  {payloading ? (
                    <span className="flex items-center">
                      <FiLoader className="animate-spin gap-1" />
                      Processing...
                    </span>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/login/${coursePost?._id}`)}
                  className="w-full md:w-auto bg-blue-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-900 transition-colors"
                >
                  Log In to Enroll
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          {faqItems.map((item, index) => (
            <div key={index} className="border-b last:border-b-0">
              <button
                className="w-full py-4 flex justify-between items-center focus:outline-none"
                onClick={() =>
                  setExpandedAccordionItem(
                    expandedAccordionItem === index ? null : index
                  )
                }
              >
                <span className="font-medium">{item.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedAccordionItem === index
                      ? "transform rotate-180"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedAccordionItem === index && (
                <div className="py-2">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewCourseDetailPage;
