import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { MdEdit, MdEmail } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const InputField = ({
  label,
  name,
  disabled,
  validation,
  register,
  errors,
  type = "text",
  icon,
}) => (
  <Box sx={{ "& > :not(style)": { mb: 2 } }}>
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      type={type}
      disabled={disabled}
      {...register(name, validation)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputProps={{
        endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
      }}
      aria-label={label}
    />
  </Box>
);

function DynamicSignUp() {
  const step = 1;
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const navigation = useNavigate();
  const { courseId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const sendOtp = async (email) => {
    setEmail(email);
    setLoading(true)
    try {
      const sendData = {
        email: email,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/email/send-otpNew`,
        sendData
      );

      // Accessing data from axios response
      const data = response.data;

      console.log(data);

      if (data.message === "OTP sent successfully") {
        setOtpStep(true);
      } else {
        console.error("Failed to send OTP:", data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (data) => {
    setLoading(true);
    try {
      const sendData = {
        data: data.email,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/auth/user-check`,
        sendData
      );
      const resdata = response.data;
      if (resdata.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Account Found!",
          text: "You already have an account. Please log in to continue and purchase the course.",
        }).then(() => {
          navigation(`/sign-In/${courseId}`);
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        await sendOtp(data.email);
      } else if (error.response?.status === 403) {
        Swal.fire({
          icon: "warning",
          title: "Almost there!",
          text: "It seems you haven't set your password yet. Please create a password to complete your registration.",
        }).then(() => {
          navigation("/sign-In");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Please try again later.",
        }).then(() => {
          window.location.reload();
        });

      }
    }
  };

  const handleEdit = async () => {
    setOtpStep(false);
    reset();
  };

  const handleRegister = async (data) => {
    setLoading(true);
    const sendData = {
      email: email,
      otp: data.otp,
      userType: "Reader",
    };
    // console.log(sendData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/auth/signUpDynamic`,
        sendData
      );

      const { data } = response;
      if (data.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Registration Successful!",
        });
        Cookies.set("access_tokennew", data.user._id);
        localStorage.setItem("userData", JSON.stringify(data.user));
        navigation(`/course-details/${courseId}`);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    } finally {
      setOtpStep(false);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen lg:p-12 md:p-6 p-4 bg-white flex items-center justify-center">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
          {/* Headings Section */}
          <div className="text-center mb-8 hidden md:block">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
              Join the ZenStudy Community
            </h2>
            <p className="text-xl text-gray-600">
              Sign up now to start your learning journey with us.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-900 to-blue-300 rounded-2xl text-center flex flex-col items-center justify-center text-white p-6 lg:p-12 lg:w-1/3 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
                Welcome to ZenStudy
              </h1>
              <p className="text-lg font-medium">
                Unlock the power of learning with our vibrant community!
              </p>
            </div>

            {/* Right Section */}
            <div className="flex-1 lg:p-12 md:p-6 p-4">
              <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-800 to-blue-300">
                {step === 1
                  ? "Sign Up with Email"
                  : otpStep
                    ? "Verify Your OTP"
                    : "Complete Your Registration"}
              </h2>

              {step === 1 && (
                <form onSubmit={handleSubmit(handleSendOtp)}>
                  <InputField
                    label="Enter Your Email"
                    name="email"
                    type="email"
                    register={register}
                    errors={errors}
                    disabled={otpStep}
                    icon={
                      otpStep ? (
                        <MdEdit
                          className="cursor-pointer hover:text-green-500"
                          onClick={() => handleEdit()}
                          size={25}
                        />
                      ) : (
                        <MdEmail size={25} />
                      )
                    }
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, // Enhanced Regex
                        message:
                          "Please enter a valid email address (e.g., example@domain.com)",
                      },
                      validate: {
                        noSpaces: (value) =>
                          !/\s/.test(value) ||
                          "Email address cannot contain spaces",
                        maxLength: (value) =>
                          value.length <= 320 ||
                          "Email cannot exceed 320 characters",
                      },
                    }}
                  />

                  {!otpStep && (
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="hover:bg-blue-700 hover:scale-105 transition-all bg-gradient-to-r from-blue-500 via-blue-900 to-blue-300"
                      aria-label="Send OTP"
                    >
                      {loading ? <CircularProgress size={24} /> : "Send OTP"}
                    </Button>
                  )}
                </form>
              )}

              {otpStep && (
                <form onSubmit={handleSubmit(handleRegister)}>
                  <p className="text-gray-600 text-sm mb-4">
                    An OTP has been sent to your email address. Please enter it
                    below to complete your registration. </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Didn't receive the OTP? Click on the edit icon to change your email address.
                  </p>

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
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="hover:bg-blue-700 bg-gradient-to-r from-blue-500 via-blue-900 to-blue-300 hover:scale-105 w-[50%] transition-all"
                    aria-label="Verify OTP"
                  >
                    {loading ? <CircularProgress size={24} /> : "Verify OTP"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default DynamicSignUp;
