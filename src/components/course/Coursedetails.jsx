import React, { Fragment, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import he from "he";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSlowMotionVideo } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { VerifyEmailMsg } from "../VerifyEmailMsg";
import { Loader } from "../loader/Loader";
import { useAuth } from "../../context/auth-context";

const CourseDetailsView = () => {
  const [coursePost, setCoursePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgloading, setImgLoading] = useState(true);
  const [payloading, setPayLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [code, setCode] = useState(null);
  // const [showConfetti, setShowConfetti] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState(null);
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
    if (discount) {
      // Assuming you only want to show confetti if there's a discount
      const timer = setTimeout(() => {
        // setShowConfetti(false);
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [discount]);

  useEffect(() => {
    if (user) {
      try {
        setCurrentUser(user?._id);
      } catch (error) {
        console.error("Error decoding user:", error);
      }
    }
  }, [user]);

  // Perticular Course get data API
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

  // const firstModule = coursePost.modules[0];

  
  return (
    <Fragment>
      {pageloading && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Loader fill="white" />
        </div>
      )}
      <div className="p-4 lg:p-12 bgGradient-purple-light  w-full rounded-md flex flex-col justify-start items-start">
        <button
          className="text-white bgGredient-green  hover:scale-105 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4 flex items-center lg:-mt-10 md:-mt-6 sm:mt-0"
          onClick={() => navigate("/courses")}
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold textGreen">
            {coursePost?.title}
          </h1>
          <p
            className="mt-2 md:mt-4 text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: he.decode(coursePost?.description),
            }}
          />
          <div className="flex items-center mt-4">
            <div className="flex items-center mr-4">
              <GrLanguage />
              <span className="ml-2">{coursePost?.language.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row w-full items-center justify-center lg:p-20 md:p-14 p-2 gap-10  rounded-lg shadow-md">
        <div className="border-l-4 lg:border-l-4 md:border-l-4 md:border-r-4 lg:border-r-4 border-[#543a5d] w-full lg:rounded-br-[10%] lg:rounded-tl-[10%] md:rounded-br-[10%] md:rounded-tl-[10%] lg:w-[60%] bg-white p-2 md:p-3 lg:p-6 ">
          <h2 className="text-lg md:text-xl textPurple font-bold">About Course</h2>
          <ul className="mt-4 space-y-2 flex flex-col gap-4">
            <li
              className="flex items-start text-justify"
              dangerouslySetInnerHTML={{
                __html: he.decode(coursePost?.other1),
              }}
            />
            <li
              className="flex items-start text-justify"
              dangerouslySetInnerHTML={{
                __html: he.decode(coursePost?.other2),
              }}
            />
          </ul>
        </div>

        <div className="w-full max-w-sm lg:w-[40%] shadow-md border-1 border-[#543a5d] p-2 md:p-5 lg:p-6 ">
          
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
                className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${
                  imgloading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImgLoading(false)}
              />
            </div>        

          <div className="p-2 pt-4 rounded-lg space-y-3">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="font-bold text-sm textPurple  truncate">
                {coursePost.title}
              </div>
              <div className="px-3 py-1 text-sm font-medium textGold bgGredient-green  w-fit rounded-tr-xl rounded-bl-xl shadow-sm">
                {coursePost.language?.name}
              </div>
            </div>
            {
              // <p className="text-gray-500 text-xs mt-2">
              //   Created at: {formatDate(coursePost?.createdAt)}
              // </p>
            }

            <div className="text-xl font-bold  textPurple">
              {discount ? (
                <div className="flex items-center">
                  <span className="line-through text-gray-400 text-sm mr-2">
                    ₹ {Math.round(coursePost?.price)}
                  </span>
                  <span>
                    ₹{" "}
                    {discount.subTotal === 0 ? 1 : discount.subTotal.toFixed(2)}
                  </span>
                </div>
              ) : (
                <>
                  <span>₹ {Math.round(coursePost?.price)}</span>
                  <span className="text-red-500 line-through text-sm ml-2">
                    ₹{coursePost?.value}
                  </span>
                  {coursePost?.title
                    ?.toLowerCase()
                    .includes("mentorship and answer") && (
                    <span className="text-xs text-gray-500">/month</span>
                  )}
                </>
              )}
            </div>

            {currentUser && (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  id="coupon"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-grow w-[70%] border border-[#343e25] p-2 rounded-lg focus:outline-none focus:ring focus:ring-[#343e25]"
                  placeholder="Enter Coupon Code"
                />
                <button
                  onClick={() => ApplyCoupon(coursePost?.price)}
                  disabled={!code || couponLoading}
                  className={`${
                    couponLoading || !code
                      ? "bg-gray-300 cursor-not-allowed textGreen"
                      : "bgGredient-green hover:scale-105 textGold"
                  } w-[30%] h-[46px] text-xs  font-bold rounded-lg transition-all flex items-center justify-center`}
                >
                  {couponLoading ? "Wait..." : "Apply"}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 ">
              <div className="mt-4 w-full">
                {currentUser ? (
                  <button
                    className={`w-full hover:scale-105 bgGredient-purple text-white font-bold py-2 px-8 rounded-lg flex items-center justify-center ${
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
                        <svg
                          className="w-5 h-5 mr-2 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V2a10 10 0 00-10 10h2z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/login/${courseId}`)}
                    className="w-full bgGredient-purple hover:scale-105 text-white font-bold py-2 px-8 rounded-lg"
                  >
                    Login to Purchase
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {coursePost.tags !== "live" && ( coursePost.modules.length > 0 && (
        <div className="p-2 md:p-12 lg:p-12 w-full bgGradient-purple-light">
          {coursePost.modules.map((title, index) => (
            <details
              key={index}
              className="mb-4 bg-white rounded-2xl shadow overflow-hidden"
            >
              <summary className="flex items-center p-4 cursor-pointer">
                <div className="w-4 h-4 bgGredient-purple rounded-full flex items-center justify-center mr-4" />
                <span className="flex-1 font-semibold">
                  {title.moduleTitle}
                </span>
                <div className="transform rotate-0 transition-transform">
                  <svg
                    className="w-4 h-4 textPurple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </summary>
              {title.videos.length > 0 ? (
                title.videos.map(({ _id, videoTitle, IsFree }) => (
                  <div
                    className="pb-2 px-10 flex items-center justify-start"
                    key={_id}
                  >
                    <MdSlowMotionVideo className="textPurple" />
                    <p className="px-4 textGreen bgGradient-green-light w-full">
                      {videoTitle || "no videos"}
                    </p>
                    {IsFree ? (
                      <FaLockOpen className="textPurple" />
                    ) : (
                      <FaLock className="textPurple" />
                    )}
                  </div>
                ))
              ) : (
                <h2>No videos</h2>
              )}
            </details>
          ))}
        </div>
              ))}
    </Fragment>
  );
};

export default CourseDetailsView;
