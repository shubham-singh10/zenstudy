



import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { MdEmail, MdPhone } from "react-icons/md";

function SignUpTest() {
  const [step, setStep] = useState(1);
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSendOtp = (data) => {
    setLoading(true);
    setTimeout(() => {
      setOtpStep(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(step + 1);
      setOtpStep(false);
      setLoading(false);
      reset(); // Reset form for the next step
    }, 1000);
  };

  const handleRegister = (data) => {
    setLoading(true);
    setTimeout(() => {
      alert("Registration Successful!");
      setLoading(false);
    }, 1000);
  };

  const renderInputField = (label, name, validation, type = "text") => {
    const icons = label === "Phone Number" ? (<MdPhone size={25} />):( <MdEmail size={25} />)
    return (
      <Box
        sx={{ "& > :not(style)": { mb: 2 } }}
        className="transition-transform transform hover:scale-105"
      >
        <TextField
          className="w-full"
          label={label}
          variant="outlined"
          type={type}
          {...register(name, validation)}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {icons}
              </InputAdornment>
            ),
          }}
        />
      </Box>
    );
  };

  return (
    <div className="min-h-screen lg:p-12 md:p-6 p-0 m-4 bg-white flex items-center justify-center">
      <div className="rounded-lg overflow-hidden bg-white w-full flex flex-col lg:flex-row ">
        {/* Left Section */}
        <div className="bg-blue-600  rounded-2xl text-center flex items-center text-white p-6 lg:p-12 lg:w-1/3">
          <h1 className="text-3xl font-extrabold mb-4 animate-fade-in">
            Welcome to ZenStudy
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex-1 lg:p-12 md:p-6 p-2 text-center lg:text-left">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 animate-slide-in">
            {step === 1
              ? "Sign Up with Email"
              : step === 2
              ? "Verify Your Phone Number"
              : "Complete Your Registration"}
          </h2>

          {step === 1 && (
            <form onSubmit={handleSubmit(handleSendOtp)}>
              {renderInputField("Email", "email", {
                required: "Email is required",
              })}
              {!otpStep && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  {loading ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              )}
            </form>
          )}

          {step === 1 && otpStep && (
            <form onSubmit={handleSubmit(handleVerifyOtp)}>
              {renderInputField("Enter OTP", "otp", {
                required: "OTP is required",
              })}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="hover:bg-blue-700 hover:scale-105 transition-all"
              >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(handleSendOtp)}>
              {renderInputField("Phone Number", "phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              {!otpStep && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  {loading ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              )}
            </form>
          )}

          {step === 2 && otpStep && (
            <form onSubmit={handleSubmit(handleVerifyOtp)}>
              {renderInputField("Enter OTP", "otp", {
                required: "OTP is required",
              })}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="hover:bg-blue-700 hover:scale-105 transition-all"
              >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(handleRegister)}>
              {renderInputField("Full Name", "name", {
                required: "Name is required",
              })}
              {renderInputField(
                "Create Password",
                "password",
                {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                },
                "password"
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="hover:bg-blue-700 hover:scale-105 transition-all"
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUpTest;
