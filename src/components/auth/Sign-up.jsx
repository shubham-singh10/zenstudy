import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, TextField, InputAdornment } from "@mui/material";
import { MdPerson, MdPhone } from "react-icons/md";
import { firebase } from "../../Firebase"; // Adjust the import path as necessary
import { useSpring, animated } from "@react-spring/web";
import {
  getAuth,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useInView } from "react-intersection-observer";
import Cookies from "js-cookie";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    cpassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [showotpForm, setShowOtpForm] = useState(false);
  const [timer, setTimer] = useState(40);
  const [loading, setLoading] = useState(false);
  const [otploading, setotpLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [otpError, setOtpError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();
  const navigate = useNavigate();

  // Intersection Observers
  const { ref: slideLeftRef, inView: slideLeftInView } = useInView({
    triggerOnce: true,
  });
  const { ref: slideUpRef, inView: slideUpInView } = useInView({
    triggerOnce: true,
  });
  const { ref: slideRightRef, inView: slideRightInView } = useInView({
    triggerOnce: true,
  });

  const SlideUp = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: slideUpInView ? 0 : 100, opacity: slideUpInView ? 1 : 0 },
    config: { duration: 500 },
  });

  const SlideLeft = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
    config: { duration: 100 },
  });

  const SlideRight = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: slideRightInView ? 0 : 100, opacity: slideRightInView ? 1 : 0 },
    config: { duration: 500 },
  });

  // Handle OTP Sent to firebase
  const handlePhoneNumberAuth = async (phoneNumber) => {
    try {

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => { },
          }
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setShowOtpForm(true);
      startTimer();
      Swal.fire({
        icon: "success",
        title: "OTP Sent Successfully",
        text: `A verification OTP has been sent to your phone number: ${phoneNumber}. Please check your messages.`,
        confirmButtonText: "Okay",
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send OTP",
        text: "We encountered an issue while sending the OTP. Please check your network connection and try again.",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Called Otp Send function and User Verification code
  const OnSubmit = async (data) => {
    setLoading(true);
    setFormData(data);
    try {
      const sendData = {
        phone: data.phone,
        email: data.email,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/auth/user-check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Register failed");
      }
      const resData = await response.json();
      if (resData.message === "Success") {
        Swal.fire({
          icon: "info",
          title: "User Already Registered",
          text: "This phone number or email is already associated with an account. Please log in to continue.",
          confirmButtonText: "Okay",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      await handlePhoneNumberAuth(`+91${data.phone}`);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Timer 40 sec
  const startTimer = () => {
    setOtpSent(true);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          setOtpSent(false);
          setTimer(40);
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // OTP Verification and user registration API call
  const OnSubmitOTP = async (data) => {
    try {
      setotpLoading(true);
      const auth = getAuth();
      const credential = PhoneAuthProvider.credential(verificationId, data.otp);
      await signInWithCredential(auth, credential);

      const { phone, name, password } = formData;
      const sendData = {
        phone,
        name,
        password,
        userType: "Reader",
        phoneStatus: "verified",
      };

      const response = await fetch(
        `${process.env.REACT_APP_API3}zenstudy/api/auth/signUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );

      if (!response.ok) {
        if (response.status === 500) {
          Swal.fire({
            icon: "error",
            title: "Registration failed",
            text: "We encountered an issue while registering your account. Please try again.",
            confirmButtonText: "Retry",
            confirmButtonColor: "#d33",
          }).then(() => {
            window.location.reload();
          });
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const resData = await response.json();

      if (resData.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: `Welcome ${name}! Your account has been created successfully. Please log in to start exploring ZenStudy.`,
        });
        Cookies.set("access_tokennew", resData.user._id);
        localStorage.setItem("userData", JSON.stringify(resData.user));
        navigate("/course-details-student");
      }
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      setotpLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "The OTP you entered is incorrect or expired. Please check and try again.",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
    } finally {
      setotpLoading(false);
    }
  };

  // Used to resend OTP
  const resendOtp = async () => {
    await handlePhoneNumberAuth(`+91${formData.phone}`);
  };

  return (
    <div className="min-h-screen lg:p-12 md:p-6 p-4 bg-white flex items-center justify-center">
      <div id="recaptcha-container"></div>
      <div className="relative w-full max-w-5xl p-1  rounded-lg shadow-xl">
        <div className="absolute inset-0 border-0 border-transparent rounded-lg animate-border bg-gradient-to-r from-blue-500 via-blue-900 to-blue-400 bg-clip-border"></div>
        <div className="relative z-10 bg-white rounded-lg lg:p-10 p-4">
          <div className="text-center hidden md:block">
            <animated.h2
              ref={slideUpRef}
              style={SlideUp}
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"
            >
              Join the ZenStudy Community
            </animated.h2>
            <animated.p
              ref={slideUpRef}
              style={SlideUp}
              className="text-xl text-gray-600 mb-4"
            >
              Sign up now to start your learning journey with us.
            </animated.p>
          </div>

          <div className="flex flex-col items-center lg:flex-row p-4 lg:p-12 bg-white gap-6 w-full h-full">
            <animated.div
              ref={slideLeftRef}
              style={SlideLeft}
              className="bg-gradient-to-r from-blue-500 via-blue-900 to-blue-300 rounded-2xl text-center flex flex-col items-center justify-center text-white p-6 lg:p-12 lg:w-1/3 shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
                Welcome to ZenStudy
              </h1>
              <p className="text-lg font-medium">
                Unlock the power of learning with our vibrant community!
              </p>
            </animated.div>

            <div className="flex-1 p-2 lg:p-8 lg:w-3/4 w-full text-center lg:text-center">
              <animated.form
                ref={slideRightRef}
                style={SlideRight}
                className={`space-y-4 ${showotpForm && "hidden"}`}
                onSubmit={handleSubmit(OnSubmit)}
              >
                <Box
                  sx={{ "& > :not(style)": { m: 1 } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    className="w-full"
                    id="name"
                    label="Enter full name"
                    variant="outlined"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <MdPerson size={25} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className="w-full"
                    id="phone"
                    label="Enter your phone no."
                    variant="outlined"
                    {...register("phone", {
                      required: "Phone is required",
                      minLength: {
                        value: 10,
                        message: "Phone number must be 10 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Phone number must be 10 digits",
                      },
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone number must be numeric",
                      },
                    })}
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <MdPhone size={25} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    className="w-full"
                    id="password"
                    label="Create password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {showPassword ? (
                            <FiEye
                              className="cursor-pointer"
                              size={25}
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <FiEyeOff
                              className="cursor-pointer"
                              size={25}
                              onClick={() => setShowPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className="w-full"
                    id="cpassword"
                    label="Confirm password"
                    variant="outlined"
                    type={showCPassword ? "text" : "password"}
                    {...register("cpassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    error={!!errors.cpassword}
                    helperText={
                      errors.cpassword ? errors.cpassword.message : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {showCPassword ? (
                            <FiEye
                              className="cursor-pointer"
                              size={25}
                              onClick={() => setShowCPassword(false)}
                            />
                          ) : (
                            <FiEyeOff
                              className="cursor-pointer"
                              size={25}
                              onClick={() => setShowCPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <div className="flex justify-between">
                  <p>
                    Already have an account ?{" "}
                    <Link
                      to="/sign-In"
                      className="underline text-blue-500 hover:text-blue-700"
                    >
                      Login
                    </Link>
                  </p>
                  {loading ? (
                    <button
                      disabled
                      className="bg-red-600 text-white py-2 lg:py-2 lg:px-10 px-4 rounded-full"
                    >
                      Please wait...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 lg:py-2 lg:px-10 px-4 rounded-full"
                    >
                      Register
                    </button>
                  )}
                </div>
              </animated.form>

              {/* OTP Form */}
              <form
                className={`space-y-4 ${!showotpForm && "hidden"}`}
                onSubmit={handleSubmit2(OnSubmitOTP)}
              >
                <Box
                  sx={{ "& > :not(style)": { m: 1 } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    className="w-full"
                    id="otp"
                    label="Enter OTP"
                    variant="outlined"
                    {...register2("otp", { required: "OTP is required" })}
                    error={!!errors2.otp || !!otpError}
                    helperText={errors2.otp ? errors2.otp.message : otpError}
                  />
                </Box>
                <div className="flex flex-row justify-between items-center">
                  {otploading ? (
                    <button
                      disabled
                      className="bg-red-600 text-white py-2 px-10 rounded-full"
                    >
                      Please wait...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-10 rounded-full hover:bg-blue-800"
                    >
                      Verify OTP
                    </button>
                  )}
                  {otpSent && (
                    <p className="text-gray-500 text-md ">
                      Resend OTP in{" "}
                      <span className="text-blue-600">{timer}</span> seconds
                    </p>
                  )}
                  {!otpSent && (
                    <button
                      onClick={resendOtp}
                      className=" py-2 px-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
