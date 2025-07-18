import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  MdEmail,
  MdLock,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAuth,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { firebase } from "../../Firebase";
import { FiUser } from "react-icons/fi";
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

function SignInDynamic() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const navigation = useNavigate();
  const [phone, setPhone] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(40);
  const [resLoading, setresLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [otpError, setOtpError] = useState("");
  const location = useLocation();
  const [otpSent, setOtpSent] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { courseId } = useParams();
  const { login } = useAuth();
  // useForm hook remains the same
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Handle user check function remains the same
  const handleChekUser = async (data) => {
    setEmail(data.email);
    setLoading(true);
    try {
      const sendData = {
        data: data.email,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/auth/user-check`,
        sendData
      );
      const resdata = response.data;
      if (resdata.message === "Success") {

         if (window.fbq) {
        fbq('trackCustom', 'UserFound', {
          email: data.email,
          courseId,
        });
      }

        setStep(4);
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {

         if (window.fbq) {
        fbq('trackCustom', 'UserNotFound', {
          email: data.email,
          courseId,
        });
      }

        Swal.fire({
          icon: "info",
          title: "Account Not Found",
          text: "It looks like you haven't registered yet. Please sign up to create an account.",
        }).then(() => {
          navigation(`/sign-up-dynamic/${courseId}`);
        });
      } else if (error.response?.status === 403) {

          if (window.fbq) {
        fbq('trackCustom', 'IncompleteSignup', {
          email: data.email,
          courseId,
        });
      }

        Swal.fire({
          icon: "warning",
          title: "Almost there!",
          text: "It seems you haven't set your password yet. Please create a password to complete your registration.",
        }).then(() => {
          setStep(2);
          setLoading(false);
        });
      }
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

  const resendOtp = async () => {
    setresLoading(true);
    await handlePhoneNumberAuth(`+91${phone}`);
  };

  const handlePhoneNumberAuth = async (phoneNumber) => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {},
          }
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setStep(3);
      startTimer();
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: `OTP has been sent to ${phoneNumber}`,
      }).then(() => {
        setresLoading(false);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send OTP. Please try again.",
      }).then(() => {
        setresLoading(false);
      });
    }
  };

  const sendOtp = async (data) => {
    setLoading(true);

    try {
      const sendData = {
        data: data.phone,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/auth/user-check`,
        sendData
      );
      const resdata = response.data;

      if (resdata.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Provied Number already exist",
          text: "Either login or reset password",
        });
        setLoading(false);
      }
    } catch (error) {
      setPhone(data.phone);
      await handlePhoneNumberAuth(`+91${data.phone}`);
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      const auth = getAuth();
      const credential = PhoneAuthProvider.credential(verificationId, data.otp);
      await signInWithCredential(auth, credential);

      const sendData = {
        phone: data.phone,
        password: data.password,
        email: data.email,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/auth/Signinverify`,
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

           if (window.fbq) {
        fbq('trackCustom', 'UserRegistered', {
          email: data.email,
          phone: data.phone,
          name: resData.user?.name || "N/A",
        });
      }

        toast.success(
          `Welcome back, ${resData.user.name}! You are now logged in.`,
          {
            position: "top-right",
            duration: 4000,
            icon: "👏",
          }
        );

        setLoading(false);
        login(resData, resData.role, resData.token);

        const from = location.state?.from || "/course-details-student";
        navigation(from);
      }
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      setLoading(false);

       // ❌ Facebook Pixel: OTP failed
    if (window.fbq) {
      fbq('trackCustom', 'OTPFailed', {
        email: data.email,
        phone: data.phone,
      });
    }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Login failed: Invalid OTP. Please try again.`,
      });
    }
  };

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      const sendData = {
        phone: data.email,
        password: data.password,
      };
      const response = await fetch(
        ` ${process.env.REACT_APP_API}zenstudy/api/auth/signinNew`,
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
        throw new Error(errorData.message || "Login failed");
      }
      const resData = await response.json();

       // ✅ Facebook Pixel: Login Success
    if (window.fbq) {
      fbq('trackCustom', 'UserLogin', {
        phone: data.email,
        courseId: courseId || "N/A",
        name: resData.name || "N/A",
      });
    }

      toast.success(`Welcome back, ${resData.name}! You are now logged in.`, {
        position: "top-right",
        duration: 4000,
        icon: "👏",
      });

      setLoading(false);
      login(resData, resData.role, resData.token);

      const newPage = courseId?.toLowerCase().includes("upsc-foundation-batch");
      const mentor = courseId
        ?.toLowerCase()
        .includes("personalised-mentorship-programme");

      const from = newPage
        ? `/courseDetailslive/${courseId}`
        : mentor
        ? `/courseDetailNew/${courseId}`
        : `/course-details/${courseId}`;

      // navigate(from);
      navigation ? navigation(from) : (window.location.pathname = from);
    } catch (error) {

       // ❌ Facebook Pixel: Login Failed
    if (window.fbq) {
      fbq('trackCustom', 'LoginFailed', {
        phone: data.email,
        error: error.message,
        courseId: courseId || "N/A",
      });
    }
    
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Login failed: ${error.message}`,
      });
      setLoading(false);
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
          <div className="absolute inset-0 border-0 border-transparent rounded-lg animate-border  bg-gradient-to-r from-[#543a5d] via-[#7d2999] to-[#bca601] bg-clip-border"></div>
          <div className="relative z-10 bg-white rounded-lg lg:p-10 p-4">
            {/* Headings Section */}
            <div className="text-center mb-8 hidden md:block">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent textPurple">
                Welcome Back
              </h2>
              <p className="text-xl text-gray-600">
                Sign in to continue your learning journey with Zenstudy.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Left Section */}
              <div className="bgGredient-purple-lr rounded-2xl text-center flex flex-col items-center justify-center text-white p-6 lg:p-12 lg:w-1/3 shadow-xl transform hover:scale-105 transition-transform duration-300">
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
                    ? "Enter your Email or Phone no."
                    : step === 2
                    ? "Complete Your Registration"
                    : step === 3
                    ? `Enter the OTP sent to your phone number (${phone})`
                    : "Enter Your Password"}
                </h2>

                <div className="signup-container">
                  {step === 1 && (
                    <form onSubmit={handleSubmit(handleChekUser)}>
                      <InputField
                        label="Enter Your Phone No. or Email"
                        name="email"
                        type="text"
                        register={register}
                        errors={errors}
                        icon={<FiUser size={25} />}
                        validation={{
                          required: "Phone number or email is required",
                          validate: (value) => {
                            const isPhone = /^\d{10}$/.test(value);
                            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                              value
                            );
                            if (!isPhone && !isEmail) {
                              return "Enter a valid 10-digit phone number or a valid email address";
                            }
                          },
                        }}
                        sx={purpleOutline}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        className=" hover:scale-105 transition-all bgGredient-purple"
                      >
                        {loading ? <CircularProgress size={24} /> : "Next"}
                      </Button>

                      <div className="mt-4">
                        <p>
                          New User?{" "}
                          <Link
                            to={`/sign-up-dynamic/${courseId}`}
                            className="underline textPurple hover:text-[#935aa6] font-semibold"
                          >
                            Sign Up
                          </Link>
                        </p>
                      </div>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleSubmit(sendOtp)}>
                      <InputField
                        name="email"
                        type="text"
                        email={email}
                        disabled={true}
                        register={register}
                        errors={errors}
                        icon={<MdEmail size={25} />}
                        sx={purpleOutline}
                      />
                      <InputField
                        label="Enter Your Phone Number"
                        name="phone"
                        type="text"
                        register={register}
                        errors={errors}
                        icon={<MdPhone size={25} />}
                        validation={{
                          required: "Phone number is required",
                          minLength: {
                            value: 10,
                            message: "Phone number must be 10 digits",
                          },
                          maxLength: {
                            value: 10,
                            message: "Phone number must be exactly 10 digits",
                          },
                          pattern: {
                            value: /^\d{10}$/,
                            message:
                              "Phone number must be numeric and 10 digits long",
                          },
                        }}
                        sx={purpleOutline}
                      />
                      <InputField
                        label="Create a Password"
                        name="password"
                        type="password"
                        register={register}
                        errors={errors}
                        icon={<MdLock size={25} />}
                        validation={{
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long",
                          },
                        }}
                        sx={purpleOutline}
                      />
                      <InputField
                        label="Confirm Password"
                        name="cpassword"
                        type="password"
                        register={register}
                        errors={errors}
                        icon={<MdLock size={25} />}
                        validation={{
                          required: "Confirm Password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long",
                          },
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                        }}
                        sx={purpleOutline}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        className="hover:scale-105 transition-all bgGredient-purple"
                      >
                        {loading ? <CircularProgress size={24} /> : "Next"}
                      </Button>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleSubmit(handleRegister)}>
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
                        }}
                        sx={purpleOutline}
                      />
                      {otpError && (
                        <p className="-mt-3 mb-2 text-red-500">{otpError}</p>
                      )}
                      {otpSent && (
                        <p className="textPurple text-md mt-1">
                          Resend OTP in{" "}
                          <span className="textPurple">{timer}</span> seconds
                        </p>
                      )}
                      {!otpSent &&
                        (resLoading ? (
                          <button
                            onClick={resendOtp}
                            className=" py-2 px-4 mb-4 bgGredient-gold cursor-not-allowed text-white rounded-full "
                          >
                            Please Wait...
                          </button>
                        ) : (
                          <button
                            onClick={resendOtp}
                            className=" py-2 px-4 mb-4 bgGredient-green hover:scale-105 text-white rounded-full "
                          >
                            Resend OTP
                          </button>
                        ))}

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        className=" hover:scale-105 transition-all bgGredient-purple"
                      >
                        {loading ? <CircularProgress size={24} /> : "Next"}
                      </Button>
                    </form>
                  )}

                  {step === 4 && (
                    <form onSubmit={handleSubmit(handleLogin)}>
                      <div className="relative">
                        <InputField
                          label="Enter Your Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          register={register}
                          errors={errors}
                          validation={{
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message:
                                "Password must be at least 6 characters long",
                            },
                          }}
                          sx={purpleOutline}
                        />
                        <div className="-mt-2 mb-4">
                          <Link
                            to="/reset-password"
                            className="textPurple
                                                hover:text-[#935aa6] font-semibold"
                          >
                            Forgot password ?{" "}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/3 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <MdVisibility size={25} />
                          ) : (
                            <MdVisibilityOff size={25} />
                          )}
                        </button>
                      </div>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        className="hover:scale-105 transition-all bgGredient-purple"
                      >
                        {loading ? <CircularProgress size={24} /> : "Login"}
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

export default SignInDynamic;
