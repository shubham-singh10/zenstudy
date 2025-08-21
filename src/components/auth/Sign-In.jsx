import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { MdEmail } from "react-icons/md";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { FiArrowRight, FiUser } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/auth-context";

const InputField = ({
  label,
  name,
  disabled,
  validation,
  register,
  errors,
  type = "text",
  icon,
  email,
  sx,
}) => (
  <Box sx={{ "& > :not(style)": { mb: 2 } }}>
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      type={type}
      disabled={disabled}
      {...(email ? { defaultValue: email } : {})}
      {...register(name, validation)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputProps={{
        endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
      }}
      sx={sx}
    />
  </Box>
);

function SignIn() {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState({
    otpLoading: false,
    loginLoading: false,
    resendLoading: false,
  });
  const navigation = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [timer, setTimer] = useState(40);
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  const { login } = useAuth();

  const freeCourseRedirect = location.state?.fromFreeCourse;

  const testSeriesRedirect = location.state?.testData;

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

  // useForm hook remains the same
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const sendOtp = async (data) => {
    setLoading({ ...loading, otpLoading: true });
    setPhone(data.phone);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/auth/verify`,
        { phone: data.phone }
      );

      const result = res.data;

      if (result.success === true) {
        setStep(2);
        startTimer();

        toast.success(
          "OTP has been sent to your phone via 📩 SMS and 📱 WhatsApp.",
          {
            position: "top-right",
          }
        );
      }
    } catch (error) {
      console.log("something went wrong", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading({ ...loading, otpLoading: false });
    }
  };

  const resendOtp = async () => {
    setLoading({ ...loading, resendLoading: true });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/auth/re-send-otp`,
        { phone: phone }
      );
      const result = res.data;

      if (result.success === true) {
        startTimer();
        toast.success(
          "OTP has been resent to your phone via 📩 SMS and 📱 WhatsApp.",
          {
            position: "top-right",
          }
        );
      }
    } catch (error) {
      console.log("something went wrong", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading({ ...loading, resendLoading: false });
    }
  };

  const handleLogin = async (data) => {
    console.log(data);
    try {
      const sendData = {
        phone: phone,
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

      console.log(resData);

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

        if (testSeriesRedirect) {
          navigation("/testSeries", { state: { testData: testSeriesRedirect } });
          return;
        }

        if (freeCourseRedirect) {
          navigation(`/watch-course-free/${freeCourseRedirect.id}`);
        } else {
          const from = location.state?.from || "/course-details-student";
          navigation(from);
        }
      }
    } catch (error) {
      console.log("something went wrong", error);
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
    }
  };

  const purpleOutline = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#935aa6" },
      "&:hover fieldset": { borderColor: "#935aa6" },
      "&.Mui-focused fieldset": { borderColor: "#935aa6" },
    },
    "& label.Mui-focused": { color: "#935aa6" },
  };

  return (
    <Fragment>
      <div id="recaptcha-container"></div>
      <div className="min-h-screen lg:p-12 md:p-6 p-4 bg-white flex items-center justify-center">
        {/* Main Container */}
        <div className="relative w-full max-w-5xl p-1 rounded-lg shadow-xl">
          <div className="absolute inset-0 border-0 border-transparent rounded-lg animate-border bg-gradient-to-r from-[#543a5d] via-[#7d2999] to-[#bca601] bg-clip-border"></div>
          <div className="relative z-10 bg-white rounded-lg lg:p-10 p-4">
            {/* Headings Section */}
            <animated.div
              ref={slideUpRef}
              style={SlideUp}
              className="text-center mb-8 hidden md:block"
            >
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent textPurple">
                Welcome Back
              </h2>
              <p className="text-xl text-gray-600">
                Sign in to continue your learning journey with Zenstudy.
              </p>
            </animated.div>

            <div className="flex flex-col lg:flex-row">
              {/* Left Section */}
              <div
                ref={slideLeftRef}
                style={SlideLeft}
                className="bgGredient-purple-lr rounded-2xl text-center flex flex-col items-center justify-center text-white p-6 lg:p-12 lg:w-1/3 shadow-xl transform hover:scale-105 transition-transform duration-300"
              >
                <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
                  Welcome to Zenstudy
                </h1>
                <p className="lg:text-lg text-md font-medium">
                  Unlock the power of learning with our vibrant community!
                </p>
              </div>

              {/* Right Section */}
              <div className="flex-1 lg:p-12 md:p-6 p-4">
                <h2 className="lg:text-xl text-lg font-semibold mb-6 bg-clip-text text-transparent textPurple">
                  {step === 1
                    ? "Login with your Phone no."
                    : `Enter the OTP sent to your phone number (${phone}) or Whatsapp`}
                </h2>

                <div className="signup-container">
                  {step === 1 && (
                    <animated.form
                      ref={slideRightRef}
                      style={SlideRight}
                      onSubmit={handleSubmit(sendOtp)}
                    >
                      <InputField
                        label="Enter Your Phone No. "
                        name="phone"
                        type="text" // use "text" to prevent arrows
                        inputMode="numeric"
                        register={register}
                        errors={errors}
                        icon={<FiUser size={25} />}
                        validation={{
                          required: "Phone number is required",
                          validate: (value) => {
                            const isPhone = /^\d{10}$/.test(value);
                            if (!isPhone) {
                              return "Enter a valid 10-digit phone number.";
                            }
                          },
                        }}
                        sx={purpleOutline}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading.otpLoading}
                        className="hover:scale-105 transition-all bgGredient-purple"
                        endIcon={!loading.otpLoading && <FiArrowRight />}
                      >
                        {loading.otpLoading ? (
                          <CircularProgress
                            size={24}
                            color="inherit"
                            sx={{ color: "white" }}
                          />
                        ) : (
                          "Next"
                        )}
                      </Button>
                    </animated.form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleSubmit(handleLogin)}>
                      <InputField
                        label="Enter OTP"
                        name="otp"
                        type="text"
                        register={register}
                        errors={errors}
                        icon={<MdEmail size={25} />}
                        validation={{
                          required: "OTP is required",
                          minLength: {
                            value: 6,
                            message: "OTP must be at least 6 characters long",
                          },
                          maxLength: {
                            value: 6,
                            message: "OTP must be exactly 6 characters",
                          },
                        }}
                        sx={purpleOutline}
                      />
                      {otpError && (
                        <p className="-mt-3 mb-2 text-red-500">{otpError}</p>
                      )}

                      <div className="mb-4 -mt-1">
                        {otpSent ? (
                          <p className="text-gray-500 text-md mt-1">
                            Resend OTP in{" "}
                            <span className="textPurple">{timer}</span> seconds
                          </p>
                        ) : (
                          <a
                            disabled={loading.resendLoading}
                            onClick={() => resendOtp()}
                            className="cursor-pointer textPurple font-semibold  hover:underline hover:scale-105 "
                          >
                            {loading.resendLoading
                              ? "Resending..."
                              : "Resend Otp"}
                          </a>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading.loginLoading}
                        className="hover:scale-105 transition-all bgGredient-purple"
                      >
                        {loading.loginLoading ? (
                          <CircularProgress
                            size={24}
                            color="inherit"
                            sx={{ color: "white" }}
                          />
                        ) : (
                          "Log-In"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SignIn;
