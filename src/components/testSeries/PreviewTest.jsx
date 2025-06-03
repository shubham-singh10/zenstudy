import { Fragment, useEffect, useState } from "react";
import { BiBrain, BiTimer, BiTrophy } from "react-icons/bi";
import {
  FiBarChart,
  FiBook,
  FiCheckCircle,
  FiFileText,
  FiLock,
  FiTarget,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import VerifyEmailMsg from "../VerifyEmailMsg";
import Swal from "sweetalert2";
import { Loader } from "../loader/Loader";

export function PreviewTest({ test, onBack }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payloading, setPayLoading] = useState(false);
  const [pageloading, setpageLoading] = useState(false);
  // const [discount, setDiscount] = useState(null);
  // const [code, setCode] = useState(null);

  const { user } = useAuth();
  const { userStatus } = VerifyEmailMsg();

  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/main/test-series/${test._id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test series");
        }

        const data = await response.json();

        console.log("Response_Data: ", data);
        if (isMounted) {
          setTestSeries(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching test series:", error);
        if (isMounted) setLoading(false);
      }
    };

    getTestSeries();

    return () => {
      isMounted = false;
    };
  }, [test]);

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
            test_series_id: test._id,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error: ${res.status} - ${res.statusText}\n${errorText}`);
        Swal.fire({
          title: "Oops. Test Series already purchase",
          text: "Please visit the test section to see the test series",
          icon: "error",
        }).then((result) => {
          navigate("/testSeries");
        });
        return;
      }

      const data = await res.json();
      //console.log("Data", data)
      handlePaymentVerify(data.data, test?._id);
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
                test_series_id: test?._id,
                coursePrice: test?.price || 0,
                purchasePrice: test?.price || 0,
                // couponCode: code,
                // couponApplied: code ? true : false,
                // discount: discount?.discount || 0,
                couponCode: null,
                couponApplied: false,
                discount: 0,
                coursevalidation: "2026-03-01",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader fill="#000" />
      </div>
    );
  }

  const newPage = test.courses[0]?.title?.includes("UPSC Foundation Batch")

  return (
    <Fragment>
      {pageloading && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Loader fill="white" />
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with Image */}
            <div className="relative h-56 md:h-64 lg:h-96 w-full rounded-lg overflow-hidden shadow-lg">
              {/* Image */}
              <img
                src={test.imageUrl}
                crossOrigin="anonymous"
                alt={test.title}
                className="object-fill w-full h-full"
              />

              {/* Darker Gradient for Better Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end">
                <div className="px-3 sm:px-6 py-3 sm:py-6 w-full">
                  {/* Course Badge */}
                  {test.includedInCourse && (
                    <div className="text-[10px] sm:text-xs md:text-sm font-medium mb-2 bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded-full shadow-md inline-block">
                      Included in: {test.courses[0]?.title}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-snug">
                    {test.title}
                  </h1>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-white/90 mt-1">
                    {test.shortDescription}
                  </p>
                </div>
              </div>
            </div>


            {/* Navigation Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto hide-scrollbar">
                <div className="flex space-x-4 px-4 sm:px-6 min-w-max">
                  {[
                    { id: "overview", label: "Overview", icon: FiFileText },
                    { id: "syllabus", label: "Test Details", icon: FiBarChart },
                    {
                      id: "outcomes",
                      label: "Learning Outcomes",
                      icon: FiTarget,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        icon: FiBook,
                        label: "Total Tests",
                        value: test.totalTests,
                      },
                      {
                        icon: BiBrain,
                        label: "Questions",
                        value: test.totalQuestions,
                      },
                      {
                        icon: BiTimer,
                        label: "Validity",
                        value: `${test.validityDays} Days`,
                      },
                      {
                        icon: IoSparkles,
                        label: "Last Updated",
                        value: new Date(test.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          }
                        ),
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 sm:p-4 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 text-gray-600 mb-1">
                          <stat.icon className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">
                            {stat.label}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-bold text-gray-900">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Key Highlights
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {test.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                        >
                          <BiTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-green-900">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      What you'll get
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {test.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg"
                        >
                          <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                          <span className="text-sm text-indigo-900">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "syllabus" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Available Tests
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {testSeries?.map((testItem) => (
                      <div
                        key={testItem.id}
                        className="bg-white rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">
                              {testItem.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
                              <div className="flex items-center">
                                <FiBook className="w-4 h-4 mr-1" />
                                {testItem.questions.length} Questions
                              </div>
                              <div className="flex items-center">
                                <BiTimer className="w-4 h-4 mr-1" />
                                {testItem.duration} mins
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${testItem.difficulty === "Basic"
                                ? "bg-green-100 text-green-800"
                                : testItem.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : testItem.difficulty === "Moderate"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                          >
                            {testItem.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "outcomes" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Learning Outcomes
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {test.learningOutcomes.map((outcome, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg"
                      >
                        <FaGraduationCap className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <span className="text-sm text-purple-900">
                          {outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Purchase Options */}
            <div className="border-t bg-gray-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  {test.includedInCourse ? (
                    <div>
                      <div className="text-base font-medium text-gray-900">
                        This test series is included in
                      </div>
                      <div className="text-xl font-bold text-indigo-600">
                        {test.courses[0]?.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>
                          Get the{" "}
                          <span className="font-semibold text-black">
                            complete course
                          </span>{" "}
                          for
                          <span className="font-semibold text-black">
                            {" "}
                            ₹{test.courses[0]?.price}
                          </span>{" "}
                          instead of just the test series.
                        </p>

                        <p className="mt-1">
                          Or purchase only the test for
                          <span className="font-semibold text-black">
                            {" "}
                            ₹{test?.price}
                          </span>
                          .
                          <Link
                            to="#"
                            onClick={() => handlePayment(test?.price)}
                            className="text-indigo-500 hover:underline ml-1 font-bold"
                          >
                            Buy Test Only
                          </Link>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        ₹{test.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        Lifetime access to all tests
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={onBack}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                  >
                    Back
                  </button>

                  {test.includedInCourse ? (
                    <button
                      onClick={() => {
                        newPage ? navigate(
                          `/courseDetailslive/${test.courses[0].title.replace(
                            /\s+/g,
                            "-"
                          )}`,
                          {
                            state: { courseId: test.courses[0]._id },
                          }
                        ) :
                          navigate(
                            `/course-details/${test.courses[0].title.replace(
                              /\s+/g,
                              "-"
                            )}`,
                            {
                              state: { courseId: test.courses[0]._id },
                            }
                          )
                      }
                      }
                      className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <FiLock className="w-4 h-4" />
                      View Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePayment(test.price)}
                      disabled={payloading}
                      className={` ${payloading
                          ? "bg-red-600 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                        } flex-1 sm:flex-initial px-4 py-2  text-white rounded-lg font-medium  transition-colors flex items-center justify-center gap-2 text-sm`}
                    >
                      <FiLock className="w-4 h-4" />
                      {payloading ? "Please Wait.." : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
              {test.includedInCourse && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <IoSparkles className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Get More Value with the Complete Course!
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        By purchasing the complete course, you'll get this test
                        series along with comprehensive study materials, video
                        lectures, and additional resources at a better value.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
