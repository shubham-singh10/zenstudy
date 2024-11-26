import React, { Fragment, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import he from "he";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { MdSlowMotionVideo } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";

const CourseDetailsView = () => {
  const [coursePost, setCoursePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payloading, setPayLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [code, setCode] = useState("");
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentUser, setCurrentUser] = useState(false);

  const token = Cookies.get("access_tokennew");
  let userId = null;

  if (token) {
    try {
      userId = token;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const ApplyCoupon = async (price) => {
    try {
      setCouponLoading(true);
      const sendData = {
        code: code,
        coursePrice: price,
        courseId: courseId,
      };
      console.log("Sending data:", sendData);

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

      setCode("");

      toast.success("Discount applied successfull!!", {
        position: "top-center",
      });
      console.log("Coupon applied successfully:", data);
      return data; // Optionally return the response data
    } catch (error) {
      console.error("Error applying coupon:", error);

      setCouponLoading(false);
    }
  };

  useEffect(() => {
    if (discount) {
      // Assuming you only want to show confetti if there's a discount
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // 3 seconds

      // Cleanup the timeout if the component unmounts before the timeout completes
      return () => clearTimeout(timer);
    }
  }, [discount]);

  useEffect(() => {
    const token = Cookies.get("access_tokennew");
    if (token) {
      try {
        setCurrentUser(token);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Perticular Course get data API
  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetail/${courseId}`,
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

        //console.log("Course_data: ", data);
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
        <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  //Payment Initiate
  const handlePayment = async (amount) => {
    setPayLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/payment/order`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            amount,
            user_id: userId,
            course_id: courseId,
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
      handlePaymentVerify(data.data, courseId);
      setPayLoading(false);
    } catch (error) {
      console.error("Error creating payment order:", error);
      setPayLoading(false);
    }
  };

  const handlePaymentVerify = async (data, courseId) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "ZenStudy",
      description: "Making Education Imaginative",
      order_id: data.id,
      handler: async (response) => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API}zenstudy/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: userId,
                course_id: courseId,
              }),
            }
          );

          const verifyData = await res.json();
          //console.log("VerifyData", verifyData)
          if (verifyData.message === "Payment Successful") {
            //console.log("Payment Success")
            navigate(verifyData.Url);
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
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

  const firstModule = coursePost.modules[0];

  return (
    <div className="">
      {showConfetti && discount && <Confetti width={width} height={height} />}
      <div className="p-4 lg:p-12 bg-blue-100 w-full md:p-8 rounded-md flex flex-col justify-start items-start">
        <button
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4 flex items-center lg:-mt-10 md:-mt-6 sm:mt-0"
          onClick={() => navigate("/courses")}
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            {coursePost?.title}
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-base">
            {stripHtmlTags(he.decode(coursePost.description))}
          </p>
          <div className="flex items-center mt-4">
            <div className="flex items-center mr-4">
              <GrLanguage />
              <span className="ml-2">{coursePost?.language}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-12 lg:p-12 mt-8 flex flex-col md:flex-row lg:flex-row gap-1 md:gap-4 lg:gap-10 md:items-center lg:items-start items-center">
        <div className=" border-l-8 border-blue-600 p-2  w-full md:w-1/2 lg:w-2/3">
          <h2 className="text-lg md:text-xl font-bold">About Course</h2>
          <ul className="mt-4 space-y-2 flex flex-col gap-4">
            <li className="flex items-start text-justify">
              {coursePost?.other1}
            </li>
            <li className="flex items-start text-justify">
              {coursePost?.other2}
            </li>
          </ul>
        </div>

        <div className="bg-white justify-center items-center max-w-sm  mt-[20px] md:mt-[-80px] lg:mt-[-120px] relative rounded-2xl overflow-hidden shadow-lg m-4 p-4 w-full h-1/2">
          {firstModule && (
            <div key={0}>
              {firstModule.videos.length > 0 ? (
                <div key={firstModule.videos[0]._id}>
                  <iframe
                    src={firstModule.videos[0].videoUrl || "no videos"}
                    frameBorder="0"
                    className="top-0 left-0 h-[30vh] w-[100%] "
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    title="zenstudy"
                  ></iframe>
                </div>
              ) : (
                <div>No videos</div>
              )}
            </div>
          )}

          <div className="px-6 py-4 ">
            <div className="font-bold text-sm mb-2 text-blue-600">
              {coursePost?.title}
            </div>

            <p className="text-gray-600 text-xs mt-4">
              Created at - {formatDate(coursePost?.createdAt)}
            </p>
          </div>

          {currentUser && (
            <div className="mb-4 w-[100%] flex flex-wrap  justify-between  px-4">
              <input
                type="text"
                id="coupon"
                onChange={(e) => setCode(e.target.value)}
                className="border p-1 outline-none rounded-lg"
                placeholder="Enter Coupon Code"
              />
              <span>
                {couponLoading ? (
                  <button className="bg-red-600 text-sm rounded-lg text-white px-5 py-2 ">
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
                      wait...
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => ApplyCoupon(coursePost?.price)}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white px-8 py-2 "
                  >
                    Apply
                  </button>
                )}
              </span>
            </div>
          )}

          <div className=" flex flex-row px-2 pt-4 pb-2 justify-between items-center  border-t-2">
            <p className="text-blue-600 font-bold text-xl">
              {discount ? (
                <Fragment>
                  <span className="line-through text-gray-400 mr-2 text-sm">
                    ₹ {Math.round(coursePost?.price)}
                  </span>
                  <span>
                    ₹{" "}
                    {Math.round(discount.discount) === 0
                      ? 1
                      : Math.round(discount.discount)}
                  </span>
                </Fragment>
              ) : (
                <span>₹ {Math.round(coursePost?.price)}</span>
              )}
            </p>

            {currentUser ? (
              <button
                className="bg-blue-600 w-[60%] hover:bg-blue-700 text-sm text-white font-bold py-2 px-6 rounded-full flex items-center justify-center"
                onClick={() =>
                  handlePayment(
                    discount
                      ? Math.round(discount.discount) === 0
                        ? 1
                        : Math.round(discount.discount)
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
                    Please wait...
                  </span>
                ) : (
                  "Pay Now"
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate(`/login/${courseId}`)}
                className="bg-blue-600 text-sm text-white font-bold py-2 px-4 rounded-full"
              >
                Login to purchase
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 md:p-12 lg:p-12 bg-blue-100 ">
        {coursePost.modules.map((title, index) => (
          <details
            key={index}
            className="mb-4 bg-white rounded-2xl shadow overflow-hidden"
          >
            <summary className="flex items-center p-4 cursor-pointer">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-4" />

              <span className="flex-1 font-semibold">{title.moduleTitle}</span>
              <div className="transform rotate-0 transition-transform">
                <svg
                  className="w-4 h-4 text-blue-500"
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
                  <MdSlowMotionVideo className="text-blue-500" />
                  <p className="px-4 text-gray-500 bg-gray-50 w-full ">
                    {videoTitle || "no videos"}
                  </p>
                  {IsFree ? (
                    <FaLockOpen className="text-blue-400 " />
                  ) : (
                    <FaLock className="text-blue-400 " />
                  )}
                </div>
              ))
            ) : (
              <h2>No videos</h2>
            )}
          </details>
        ))}
      </div>
    </div>
  );
};

export default CourseDetailsView;
