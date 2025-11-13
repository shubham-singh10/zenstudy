import axios from "axios";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { Loader } from "./loader/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const Testing = ({ token, price, courseName }) => {
  const navigation = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(40);
  const [phoneError, setPhoneError] = useState("");
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // step control
  const [loading, setLoading] = useState({
    otpLoading: false,
    payLoading: false,
    resendLoading: false,
    pageLoading: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm();

  const startTimer = () => {
    setOtpSent(true);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const sendOtp = async (phone) => {
    setLoading((prev) => ({ ...prev, otpLoading: true }));
    setPhoneNumber(phone);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/auth/verify`,
        { phone }
      );
      if (res.data.success === true) {
        setOtpSent(true);
        setTimer(40);
        startTimer();
        setCurrentStep(2);
        toast.success("OTP sent via SMS & WhatsApp!", {
          position: "top-right",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading((prev) => ({ ...prev, otpLoading: false }));
    }
  };

  const resendOtp = async () => {
    setLoading((prev) => ({ ...prev, resendLoading: true }));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/auth/re-send-otp`,
        { phone: phoneNumber }
      );
      if (res.data.success === true) {
        startTimer();
        setTimer(40);
        toast.success("OTP resent via SMS & WhatsApp!", {
          position: "top-right",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading((prev) => ({ ...prev, resendLoading: false }));
    }
  };

  //Payment Initiate
  const handlePayment = async (paydata) => {
    setLoading((prev) => ({ ...prev, payLoading: true }));

    // Facebook Pixel - InitiateCheckout
    if (window.fbq) {
      fbq("track", "InitiateCheckout", {
        value: paydata.purchasePrice,
        currency: "INR",
        content_ids: [paydata?.courseId],
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
            amount: paydata?.purchasePrice,
            user_id: paydata?.userId,
            course_id: paydata?.courseId,
             test_series_id: paydata?.testSeriesId,
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
          window.location.pathname = "/mycourse";
        });
        return;
      }

      const data = await res.json();

      if (data.message === "Free purchase successful") {
        navigation("/testSeries", {
          state: { testData: paydata.otherDetailsTestSeries },
        });
      } else {
        handlePaymentVerify(data.data, paydata);
      }
    } catch (error) {
      console.error("Error creating payment order:", error);
    } finally {
      setLoading((prev) => ({ ...prev, payLoading: false }));
    }
  };

  const handlePaymentVerify = async (data, preData) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Zenstudy",
      description: "Making Education Imaginative",
      order_id: data.id,
      prefill: {
        name: preData?.userName,
        email: preData?.userEmail,
        contact: preData?.userPhone,
      },
      handler: async (response) => {
        setLoading((prev) => ({ ...prev, pageLoading: true }));
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
                user_id: preData.userId,
                course_id: preData.courseId,
                coursePrice: preData.coursePrice,
                purchasePrice: preData.purchasePrice,
                couponCode: preData.couponCode || null,
                couponApplied: preData.couponApplied,
                discount: preData.discount,
                coursevalidation: preData.coursevalidation,
                pendingPaymentId: preData.pendingPaymentId,
              }),
            }
          );

          const verifyData = await res.json();

          if (verifyData.message === "Payment Successful") {
            // Facebook Pixel - Purchase
            if (window.fbq) {
              fbq("track", "Purchase", {
                value: preData.purchasePrice || preData?.coursePrice,
                currency: "INR",
                content_ids: [preData?.courseId],
                content_type: "product",
              });
            }

            window.location.pathname = "/mycourse";
          } else {
            window.location.pathname = "/mycourse";
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
          setLoading((prev) => ({ ...prev, pageLoading: false }));
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleFreePayment = async (paydata) => {
    setLoading((prev) => ({ ...prev, payLoading: true }));

    // Facebook Pixel - InitiateCheckout
    if (window.fbq) {
      fbq("track", "InitiateCheckout", {
        value: paydata.purchasePrice,
        currency: "INR",
        content_ids: [paydata?.courseId],
        content_type: "product",
      });
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API2}zenstudy/api/payment/order-free`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            amount: paydata?.purchasePrice,
            user_id: paydata?.userId,
            test_series_id: paydata?.testSeriesId,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error: ${res.status} - ${res.statusText}\n${errorText}`);
        Swal.fire({
          title: "Test Series Already Purchased",
          text: "You’ve already bought this test series. You can access it anytime in the Mock Test section.",
          icon: "error",
        }).then(() => {
          window.location.pathname = "/testSeries";
        });
        return;
      }

      const data = await res.json();
      if (data.message === "Free purchase successful") {
        navigation("/testSeries", {
          state: { testData: paydata.otherDetailsTestSeries },
        });
      }
    } catch (error) {
      console.error("Error creating payment order:", error);
    } finally {
      setLoading((prev) => ({ ...prev, payLoading: false }));
    }
  };

  const verifyToken = async (tokenn, userId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/payment/verify-token`,
        {
          token: tokenn,
          userId,
        }
      );

      const result = res.data;
      if (result.message === "Token is valid") {
        handlePayment(result.data);
      }
    } catch (error) {
      console.error("Token verification error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Token verification failed. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Final form submission
  const onSubmit = async (data) => {
    try {
      if (!/^\d{10}$/.test(data.phone)) {
        setPhoneError("Phone number must be exactly 10 digits");
        return;
      }
      if (!/^\d{6}$/.test(data.otp)) {
        return;
      }
      setLoading((prev) => ({ ...prev, payLoading: true }));
      const sendData = {
        phone: phoneNumber,
        otp: data.otp,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/auth/verify-otp`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const resData = await response.json();

      if (resData.message === "Success") {
        toast.success(
          `Welcome, ${resData.user.name}! Your account has been successfully created.`,
          {
            position: "top-right",
            duration: 4000,
            icon: "🎉",
          }
        );
        setLoading(false);
        login(resData.user, resData.role, resData.token);

        verifyToken(token, resData.user._id);
      }
    } catch (error) {
      if (error.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: "The OTP you entered is incorrect or has expired. Please try again.",
          confirmButtonColor: "#d33",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong",
          confirmButtonColor: "#d33",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, payLoading: false }));
    }
  };

  return (
    <Fragment>
      {loading.pageLoading && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Loader fill="white" />
        </div>
      )}

      <div className="min-h-screen bgGradient-purple-light flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-5xl border-[#543a5d] border-2">
          <div className="text-center mb-6">
            <span className="text-2xl font-semibold textGreen">Paying to</span>
            <span className="text-3xl font-bold textPurple"> Zenstudy</span>
          </div>

          <div className="flex flex-col md:flex-row rounded-xl overflow-hidden">
            {/* Left Image */}
            <div className="md:w-1/2 p-4 bg-white">
              <img
                src="../assets/paymentModel.png"
                alt="UPSC Webinar"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Right Form */}
            <div className="md:w-1/2 p-6 flex flex-col">
              {/* Top Text */}
              <div className="text-2xl textPurple font-semibold text-black mb-4">
                Payment Details
              </div>

              {/* Centered Content */}
              <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-col space-y-4 justify-center bg-white w-full">
                  {/* Course name */}
                  <div className="text-lg textPurple mb-2">
                    <b> Course : </b> {courseName}
                  </div>

                  {/* Price */}
                  <div className="bg-gray-100 rounded-lg p-2 font-semibold text-lg text-black">
                    ₹ {price}
                  </div>
                  <p className="text-xs text-gray-500">
                    (18% GST already included which is paid to the Government)
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Step 1: Phone */}
                    {currentStep === 1 && (
                      <div>
                        <input
                          type="text"
                          placeholder="Phone Number"
                          className="border p-2 rounded-md w-full text-sm"
                          maxLength={10}
                          {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^\d{10}$/,
                              message: "Phone number must be exactly 10 digits",
                            },
                          })}
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                        {phoneError && !errors.phone && (
                          <p className="text-red-600 text-sm mt-1">
                            {phoneError}
                          </p>
                        )}

                        <button
                          type="button"
                          disabled={loading.otpLoading}
                          className="bgGredient-green w-full text-white py-2 rounded-md text-sm font-semibold mt-2"
                          onClick={() => {
                            const phoneValue = getValues("phone");
                            if (!/^\d{10}$/.test(phoneValue)) {
                              setPhoneError(
                                "Please enter a valid 10-digit phone number."
                              );
                              return;
                            }
                            setPhoneError("");
                            sendOtp(phoneValue);
                          }}
                        >
                          {loading.otpLoading ? "Sending OTP..." : "Proceed"}
                        </button>
                      </div>
                    )}

                    {/* Step 2: OTP */}
                    {currentStep === 2 && (
                      <>
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          className="border p-2 rounded-md w-full text-sm mb-1"
                          maxLength={6}
                          {...register("otp", {
                            required: "OTP is required",
                            pattern: {
                              value: /^\d{6}$/,
                              message: "OTP must be exactly 6 digits",
                            },
                          })}
                        />
                        {errors.otp && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.otp.message}
                          </p>
                        )}

                        <div className="text-right flex justify-between items-center">
                          {timer > 0 ? (
                            <p className="text-gray-500 text-sm mt-1">
                              Resend OTP in{" "}
                              <span className="textPurple">{timer}</span>{" "}
                              seconds
                            </p>
                          ) : (
                            <span className="text-sm text-green-600 font-medium">
                              You can resend now
                            </span>
                          )}

                          <button
                            type="button"
                            disabled={timer > 0 || loading.resendLoading}
                            className={`px-4 py-1 rounded-md textLight text-sm transition-all duration-200 ${
                              timer > 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bgGredient-green hover:scale-105"
                            }`}
                            onClick={resendOtp}
                          >
                            {loading.resendLoading
                              ? "Resending..."
                              : "Resend OTP"}
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={loading.payLoading}
                          className="bgGredient-purple hover:scale-105 py-2 rounded-md text-sm font-semibold text-white transition-transform duration-300 w-full mt-3"
                        >
                          {loading.payLoading
                            ? "Wait..."
                            : `Pay Securely ₹ ${price}`}
                        </button>
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Testing;
