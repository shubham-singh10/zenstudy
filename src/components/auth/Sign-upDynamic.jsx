import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const InputField = ({ label, name, validation, register, errors, type = "text", icon }) => (
  <Box sx={{ "& > :not(style)": { mb: 2 } }}>
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      type={type}
      {...register(name, validation)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {icon}
          </InputAdornment>
        ),
      }}
      aria-label={label}
    />
  </Box>
);

function DynamicSignUp() {
  const [step, setStep] = useState(1);
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSendOtp = (data) => {
    setEmail(data.email);
    setLoading(true);
    setTimeout(() => {
      setOtpStep(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setOtpStep(false);
      setLoading(false);
      reset(); // Reset form for the next step
    }, 1000);
  };

  //   const handleRegister = (data) => {
  //     handleVerifyOtp();
  //     setLoading(true);
  //     setTimeout(() => {
  //       alert("Registration Successful!");
  //       setLoading(false);
  //     }, 1000);
  //   };

  const handleRegister = async () => {
    handleVerifyOtp();
    setLoading(true);
    const sendData = {
      email: email,
      otp: "123456",
      userType: "Reader"
    }
    console.log(sendData);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API}zenstudy/api/auth/signUpDynamic`, sendData)

      const { data } = response;
      console.log(data)
      if(data.message === "Success"){
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Registration Successful!",
        });
        Cookies.set("access_tokennew", data.user._id);
        localStorage.setItem("userData", JSON.stringify(data.user));
        window.location.pathname = "/course-details-student";
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  }


  return (
    <Fragment>
      <div className="min-h-screen lg:p-12 md:p-6 p-4 bg-white flex items-center justify-center">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
          {/* Headings Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">
              Join the ZenStudy Community
            </h2>
            <p className="text-xl text-gray-600">
              Sign up now to start your learning journey with us.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="bg-blue-600 rounded-2xl text-center flex items-center justify-center text-white p-6 lg:p-12 lg:w-1/3">
              <h1 className="text-3xl font-extrabold mb-4">
                Welcome to ZenStudy
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex-1 lg:p-12 md:p-6 p-4">
              <h2 className="text-2xl font-semibold mb-6 text-blue-700">
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
                    icon={<MdEmail size={25} />}
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
                          !/\s/.test(value) || "Email address cannot contain spaces",
                        maxLength: (value) =>
                          value.length <= 320 || "Email cannot exceed 320 characters",
                      },
                    }}
                  />

                  {!otpStep && (
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="hover:bg-blue-700 hover:scale-105 transition-all"
                      aria-label="Send OTP"
                    >
                      {loading ? <CircularProgress size={24} /> : "Send OTP"}
                    </Button>
                  )}
                </form>
              )}

              {otpStep && (
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
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="hover:bg-blue-700 hover:scale-105 w-[50%] transition-all"
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
