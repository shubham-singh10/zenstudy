import React, { Fragment, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import he from "he";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSlowMotionVideo } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { VerifyEmailMsg } from "../VerifyEmailMsg";
import { Loader } from "../loader/Loader";

const CourseDetailsView = () => {
  const [coursePost, setCoursePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
  const [imgloading, setImgLoading] = useState(true);
  const [payloading, setPayLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [code, setCode] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageloading, setpageLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const {state} = useLocation()
  const selectedcourseId = state.courseId
  const [currentUser, setCurrentUser] = useState(false);
  const { userStatus } = VerifyEmailMsg();

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
        courseId: selectedcourseId,
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
        setShowConfetti(false);
      }, 3000); // 3 seconds
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

        // console.log("Course_data: ", data);
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

  // const stripHtmlTags = (html) => {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   return doc.body.textContent || "";
  // };

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
            user_id: userId,
            course_id: selectedcourseId,
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
      handlePaymentVerify(data.data, selectedcourseId);
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
      name: "ZenStudy",
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
                user_id: userId,
                course_id: selectedcourseId,
                coursePrice: coursePost?.price || 0,
                purchasePrice: discount?.subTotal !== undefined ? (discount?.subTotal === 0 ? 1 : (discount?.subTotal).toFixed(2)) : coursePost?.price,
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

  const firstModule = coursePost.modules[0];

  return (
    <Fragment>
  {pageloading && (
    <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <Loader fill="white" />
    </div>
  )}
  <div className="p-4 lg:p-12 bg-blue-100 w-full rounded-md flex flex-col justify-start items-start">
    <button
      className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4 flex items-center lg:-mt-10 md:-mt-6 sm:mt-0"
      onClick={() => navigate("/courses")}
    >
      <FiArrowLeft className="w-5 h-5 mr-2" />
      Back
    </button>
    <div>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{coursePost?.title}</h1>
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

  <div className="p-4 md:p-12 lg:p-10 mt-8 flex flex-wrap justify-center lg:justify-between gap-1 md:gap-4 lg:gap-0 md:items-center lg:items-start items-center">
    
  
  <div className="border-l-8 border-blue-600 p-2 w-full md:w-full md:mb-28 mb-10 lg:w-[60%]">
      <h2 className="text-lg md:text-xl font-bold">About Course</h2>
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

    <div className="bg-white justify-center items-center  mt-[20px] md:mt-[-80px] lg:mt-[-120px] relative lg:sticky lg:top-4  overflow-hidden shadow-xl border-2 border-gray-300 rounded-md m-4 p-4 w-[2/3] h-1/2">
      {firstModule ? (
        <div key={0}>
          {firstModule.videos && firstModule.videos.length > 0 ? (
            <div key={firstModule.videos[0]._id}>
              {firstModule.videos[0].videoUrl ? (
                <iframe
                  title={firstModule.videos[0].title}
                  src={`https://player.vdocipher.com/v2/?otp=${firstModule.videos[0].videoCode}&playbackInfo=${firstModule.videos[0].playBackInfo}`}
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
            className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${imgloading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setImgLoading(false)}
          />
        </div>
      )}

      <div className="p-2 pt-4 rounded-lg space-y-6">
        <div>
          <h2 className="text-lg font-bold text-blue-600">{coursePost?.title}</h2>
          <p className="text-gray-500 text-xs mt-2">
            Created at: {formatDate(coursePost?.createdAt)}
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              id="coupon"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-grow w-[70%] border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter Coupon Code"
            />
            <button
              onClick={() => ApplyCoupon(coursePost?.price)}
              disabled={!code || couponLoading}
              className={`${couponLoading || !code ? `bg-gray-400 cursor-not-allowed w-[30%] py-1` : "bg-blue-600 hover:bg-blue-700 w-[30%] py-1"} text-sm text-white font-bold px-6 rounded-lg transition-all`}
            >
              {couponLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-spin text-white text-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2a10 10 0 00-10 10h2z"></path>
                  </svg>
                  Applying...
                </span>
              ) : (
                <span className="text-xs">Apply Coupon</span>
              )}
            </button>
          </div>
        )}

        <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-bold text-blue-600">
            {discount ? (
              <div className="flex items-center">
                <span className="line-through text-gray-400 text-sm mr-2">
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
          </div>

          <div className="mt-4 sm:mt-0">
            {currentUser ? (
              <button
                className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center ${payloading ? "cursor-not-allowed" : ""}`}
                onClick={() =>
                  handlePayment(
                    discount ? (discount.subTotal === 0 ? 1 : discount.subTotal.toFixed(2)) : coursePost?.price
                  )
                }
                disabled={payloading}
              >
                {payloading ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2a10 10 0 00-10 10h2z"></path>
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
              >
                Login to Purchase
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {coursePost.modules.length > 0 && <div className="p-2 md:p-12 lg:p-12 w-full md:w-full lg:w-[60%] bg-blue-100">
    {coursePost.modules.map((title, index) => (
        <details key={index} className="mb-4 bg-white rounded-2xl shadow overflow-hidden">
          <summary className="flex items-center p-4 cursor-pointer">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-4" />
            <span className="flex-1 font-semibold">{title.moduleTitle}</span>
            <div className="transform rotate-0 transition-transform">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </summary>
          {title.videos.length > 0 ? (
            title.videos.map(({ _id, videoTitle, IsFree }) => (
              <div className="pb-2 px-10 flex items-center justify-start" key={_id}>
                <MdSlowMotionVideo className="text-blue-500" />
                <p className="px-4 text-gray-500 bg-gray-50 w-full">{videoTitle || "no videos"}</p>
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
        </details>
))}
        </div>}
  </div>
</Fragment>

  );
};

export default CourseDetailsView;
