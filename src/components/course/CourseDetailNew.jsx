import React, { Fragment, useEffect, useState } from "react";
import { GrLanguage } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdOutlineVerified, MdSlowMotionVideo } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { VerifyEmailMsg } from "../VerifyEmailMsg";
import { useAuth } from "../../context/auth-context";
import { FaChevronDown } from "react-icons/fa";
import { FiArrowDown, FiArrowUp, FiLoader } from "react-icons/fi";
import { Loader } from "../loader/Loader";
import axios from "axios";
import Testing from "../testing";

const NewCourseDetailPage = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  // const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [expandedAccordionItem, setExpandedAccordionItem] = useState(null);

  const [coursePost, setCoursePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgloading, setImgLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payloading, setPayLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [code, setCode] = useState(null);
  // const [showConfetti, setShowConfetti] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [pageloading, setpageLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentUser, setCurrentUser] = useState(false);
  const { userStatus } = VerifyEmailMsg();
  const { user } = useAuth();
  const [token, setTokenData] = useState(null);

  const ApplyCoupon = async (price) => {
    try {
      setCouponLoading(true);
      setIsCouponApplied(false); // temproary puropse use
      const sendData = {
        code: code,
        coursePrice: price,
        courseId: coursePost?._id,
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
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetailslug/${courseId}`,
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

        setCoursePost(data.coursedetail);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getCourse();
  }, [courseId]);

  useEffect(() => {
    if (discount) {
      // Assuming you only want to show confetti if there's a discount
      const timer = setTimeout(() => {
        // setShowConfetti(false);
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

    // 🔥 Pixel: Track InitiateCheckout
    if (window.fbq) {
      fbq("track", "InitiateCheckout", {
        value: amount,
        currency: "INR",
        content_ids: [coursePost?._id],
        content_type: "product",
      });
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
          if (verifyData.message === "Payment Successful") {
            // ✅ Pixel: Track Purchase
            if (window.fbq) {
              fbq("track", "Purchase", {
                value:
                  discount?.subTotal !== undefined
                    ? discount?.subTotal === 0
                      ? 1
                      : parseFloat(discount?.subTotal).toFixed(2)
                    : coursePost?.price,
                currency: "INR",
                content_ids: [coursePost?._id],
                content_type: "product",
                coupon_used: code ? true : false,
                discount_amount: discount?.discount || 0,
              });
            }

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
      if (res.data) {
        setTokenData(res.data.token);
      }
    } catch (error) {
      // console.log("something went wrong", error);
    }
  };

  const firstModule = coursePost?.modules[0];

  if (token) {
    return (
      <Testing
        token={token}
        price={
          discount
            ? discount.subTotal === 0
              ? 1
              : discount.subTotal.toFixed(2)
            : coursePost?.price
        }
        courseName={coursePost?.title || "Zenstudy Course"}
      />
    );
  }

  return (
    <Fragment>
      {pageloading && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Loader fill="white" />
        </div>
      )}
      <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
        {/* Sticky Header */}
        <div
          className={`fixed top-0 left-0 right-0 bg-white shadow-md transition-transform duration-300 z-50 ${
            showStickyHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center lg:justify-between md:justify-between justify-center">
            <h2 className="lg:text-lg md:text-lg text-sm font-semibold textPurple truncate">
              {coursePost?.title}
            </h2>
            <div className="flex items-center">
              <div className="lg:text-2xl md:text-xl text-sm font-bold textPurple mr-4">
                {discount ? (
                  <div className="flex items-baseline gap-2">
                    <span className="line-through opacity-75 text-lg">
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
                  <span>₹{Math.round(coursePost?.price)}</span>
                )}
              </div>

              {currentUser ? (
                <button
                  className={`lg:text-lg md:text-lg text-sm w-full sm:w-auto bgGredient-purple  hover:from-[#784688] hover:to-[#543a5d] textGold font-bold py-3 px-8 rounded-lg flex items-center justify-center ${
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
                  className="border border-[#543a5d] textPurple px-4 py-2 rounded-md hover:bg-yellow-50 transition-colors"
                  onClick={() => {
                    // Facebook Pixel: LogInToEnroll click

                    createToken(
                      coursePost._id,
                      coursePost?.price,
                      code ? code : null,
                      discount ? discount.subTotal : 0,
                      code ? true : false,
                      discount?.subTotal !== undefined
                        ? discount?.subTotal === 0
                          ? 1
                          : (discount?.subTotal).toFixed(2)
                        : coursePost?.price
                    );

                    if (window.fbq) {
                      fbq("trackCustom", "LogInToEnrollClick", {
                        courseId: courseId,
                        courseName: coursePost?.title,
                      });
                    }
                  }}
                >
                  Log In to Enroll
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <span className="inline-block bgGredient-green textGold text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Bestseller
              </span>
              <h1 className="lg:text-3xl md:text-2xl text-xl font-bold mb-4 textPurple">
                {coursePost && coursePost.title}
              </h1>
              <p className="text-lg mb-6 text-gray-600">
                {coursePost && coursePost?.description}
              </p>

              <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
                <div className="flex items-center justify-center gap-1">
                  <GrLanguage />
                  <span>{coursePost && coursePost?.language?.name}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-3xl font-bold textPurple mr-3">
                  ₹ {coursePost && coursePost?.price}
                </div>
                <div className="text-lg text-gray-500 line-through">
                  ₹ {coursePost?.value}
                </div>
                <span className=" textPurple font-semibold ml-1 text-xl">
                  {" "}
                  / month
                </span>
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
                    src={coursePost?.thumbnailS3 || "/assets/upcoming.webp"}
                    crossOrigin="anonymous"
                    alt="Course Thumbnail"
                    className={`w-full object-contain rounded-2xl transition-opacity duration-500 ${
                      imgloading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImgLoading(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Course Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold textPurple mb-4">
              Course Overview
            </h2>
            <p
              className={`text-gray-700 ${
                showFullDescription ? "" : "line-clamp-3"
              }`}
            >
              {coursePost && coursePost?.other1}
              <br></br>
              {coursePost && coursePost?.other2}
            </p>
            <button
              className="textPurple mt-2 flex items-center"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? (
                <span className="flex textGold font-bold items-center gap-1">
                  Show less
                  <FiArrowUp />
                </span>
              ) : (
                <span className="flex textGold font-bold items-center gap-1">
                  Show more
                  <FiArrowDown />
                </span>
              )}
            </button>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-xl">
            {coursePost?.dynamicSections.map((section) => (
              <div key={section._id}>
                <h2 className="text-2xl font-semibold textPurple mb-4">
                  {section.title}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.contents.map((point) => (
                    <li
                      key={point._id}
                      className={`flex gap-2 items-center ${section.textColor}`}
                    >
                      <MdOutlineVerified className="text-[#5d6353]" />
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Course Content */}
          {coursePost?.modules?.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold textPurple mb-4">
                Course Content
              </h2>
              {coursePost?.modules?.map((section, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-100 rounded-lg mb-4 px-4 py-1"
                >
                  <button
                    className="w-full py-4 flex justify-between items-center focus:outline-none"
                    onClick={() =>
                      setExpandedAccordionItem(
                        expandedAccordionItem === index ? null : index
                      )
                    }
                  >
                    <span className="font-medium">{section?.moduleTitle}</span>
                    <FaChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedAccordionItem === index
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {expandedAccordionItem === index && (
                    <div className="py-0">
                      {section?.videos?.length > 0 ? (
                        section?.videos?.map(({ _id, videoTitle, IsFree }) => (
                          <div
                            className="pb-2 px-2 rounded-md flex items-center  bg-purple-50 justify-start"
                            key={_id}
                          >
                            <MdSlowMotionVideo className="textGreen" />
                            <p className="px-4 py-2 text-gray-500 w-full">
                              {videoTitle || "no videos"}
                            </p>
                            {IsFree ? (
                              <FaLockOpen className="textGreen" />
                            ) : (
                              <FaLock className="textGreen" />
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
          <div className=" bgGredient-purple text-white p-8 rounded-lg shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="lg:text-3xl md:text-2xl text-xl textGold  font-bold mb-6">
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
                <span className="text-lg ml-1 text-gray-300 line-through">
                  {discount ? " " : `₹ ${coursePost?.value}`}
                </span>
                <span className=" text-[#fdfdfd] font-semibold ml-1 text-xl">
                  {" "}
                  {discount ? "Per month" : "/ month"}
                </span>

                <p className="text-lg mt-2 textGold">
                  {isCouponApplied
                    ? "Discount applied!"
                    : "50% discount - Limited time offer!"}
                </p>
              </div>
              <div className="w-full md:w-auto">

                  <div className="flex mb-4">
                    <input
                      type="text"
                      id="coupon"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f5eeb4] text-gray-900"
                      placeholder="Enter Coupon Code"
                    />
                    <button
                      onClick={() => ApplyCoupon(coursePost?.price)}
                      disabled={couponLoading}
                      className={`${
                        couponLoading
                          ? `bg-red-800 cursor-not-allowed`
                          : "bg-gradient-to-r from-[#efdb78] to-[#f5eeb4] hover:from-[#f5eeb4] hover:to-[#efdb78] textPurple "
                      } font-bold px-4 py-2 rounded-r-md transition-colors`}
                    >
                      <span className="text-xs block w-full">
                        {couponLoading ? "Wait..." : "Apply"}
                      </span>
                    </button>
                  </div>              

                {currentUser ? (
                  <button
                    className={`w-full sm:w-auto bg-gradient-to-r from-[#efdb78] to-[#f5eeb4] hover:from-[#f5eeb4] hover:to-[#efdb78] textPurple font-bold py-3 px-8 rounded-lg flex items-center justify-center ${
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
                    onClick={() => {
                      createToken(
                        coursePost._id,
                        coursePost?.price,
                        code ? code : null,
                        discount ? discount.subTotal : 0,
                        code ? true : false,
                        discount?.subTotal !== undefined
                          ? discount?.subTotal === 0
                            ? 1
                            : (discount?.subTotal).toFixed(2)
                          : coursePost?.price
                      );

                      if (window.fbq) {
                        fbq("trackCustom", "LogInToEnrollClick", {
                          courseId: courseId,
                          courseName: coursePost?.title,
                        });
                      }
                    }}
                    className="w-full md:w-auto  bg-gradient-to-r from-[#efdb78] to-[#f5eeb4] hover:from-[#d6c664] hover:to-[#b2a652] text-black  px-6 py-3 rounded-md font-bold hover:scale-105 transition-colors"
                  >
                    Log In to Enroll
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl textPurple font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            {coursePost &&
              coursePost.fAndQ.map((item, index) => (
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
                    <div className="py-2 bg-purple-50 p-2 rounded-md">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewCourseDetailPage;
