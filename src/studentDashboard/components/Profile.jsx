import React, { useEffect, useState } from "react";
import { FiUpload, FiUploadCloud } from "react-icons/fi";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import { MdVerified } from "react-icons/md";
import { useForm } from "react-hook-form";
import { firebase } from "../../Firebase"; // Adjust the import path as necessary
import {
  getAuth,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { useAuth } from "../../context/auth-context";

const Profile = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    Address: "",
    City: "",
    State: "",
    Country: "",
    Pincode: "",
    avatar: "",
    otp: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhoneModalOpen, setisPhoneModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [imager, setImager] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otploading, setOtpLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
  });
  const [Imgloading, setImgLoading] = useState(false);
  const [Dloading, setDLoading] = useState(true);
  const {user} = useAuth()
  
  const password = watch("password");
  const onSubmit = async (data) => {
    // console.log("Form_Data: ", data);
    try {
      setOtpLoading((prev) => ({ ...prev, verifyOtp: true }));

      const auth = getAuth();
      const credential = PhoneAuthProvider.credential(verificationId, data.otp);
      await signInWithCredential(auth, credential);

      const sendData = {
        phone: userData.phone,
        password: data.password,
        userId: user?._id,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/auth/verifyPhone`,
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
        throw new Error(errorData.message || "Verification failed");
      }

      const resData = await response.json();

      if (resData.message === "Phone verified successfully") {
        Swal.fire({
          icon: "success",
          title: "Verification Successful!",
          text: `Your account has been verified successfully.`,
        }).then(() => {
          setisPhoneModalOpen(false);
          window.location.reload();
        });
      }
    } catch (error) {
      setOtpLoading((prev) => ({ ...prev, verifyOtp: false }));
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "The OTP you entered is incorrect or expired. Please check and try again.",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
    } finally {
      setOtpLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };
  // Handel Image Update
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserData({ ...userData, avatar: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImager(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  //Get User Data API

  const getUserData = async (userId) => {
    setDLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/user/userdetail/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }
      const resData = await response.json();
      // console.log("Responsiocve: ", resData.userdetail)
      const { userdetail } = resData;

      // Construct the `imageUrl` conditionally
      const imageUrl = userdetail.avatar.startsWith("http")
        ? userdetail.avatar
        : `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${userdetail.avatar}`;

      const updatedUserDetail = {
        ...userdetail,
        imageUrl,
      };
      // console.log("Image: ", updatedUserDetail);
      setUserData(updatedUserDetail || {});
      setDLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Fetch User Data",
        text: "We encountered an issue while retrieving your information. Please try again later or contact support if the issue persists.",
        footer: `<a href="/contact">Need Help?</a>`,
        confirmButtonText: "Okay",
        confirmButtonColor: "#d33",
      });
      setDLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update User API
  const submitData = async () => {
    if (!user) return;

    setLoading(true);
    // console.log("User_Data: ", userData)
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}zenstudy/api/user/updateUserN/${user?._id}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // console.log("Response_Data", response.data.user)
      if (response.data.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User updated successfully",
        });
      }
    } catch (error) {
      // console.log('Error: ', error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error: User update failed.`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update User Image API
  const submitImageData = async () => {
    if (!user) return;

    setImgLoading(true);
    // console.log("User_Data: ", userData)
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}zenstudy/api/user/updatenew/${user?._id}`,
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify(userData),
        }
      );

      // console.log("Response_Data", response.data.user)
      if (response.data.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Image updated successfully",
        });
        setImager(null);
      }
    } catch (error) {
      // console.log('Error: ', error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error: User update failed.`,
      });
    } finally {
      setImgLoading(false);
    }
  };

  //User for set Image
  useEffect(() => {
    if (userData?.imageUrl) {
      setImage(userData.imageUrl);
    } else {
      setImage(userData.avatar);
    }
  }, [userData]);

  //Call getUser Data
  useEffect(() => {
    if (user) {
      getUserData(user?._id);
    }
  }, [user]);

  if (Dloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold animate-pulse">Zenstudy</div>
      </div>
    );
  }

  const sendOtp = async (email) => {
    setOtpLoading((prev) => ({ ...prev, sendOtp: true }));
    try {
      const sendData = {
        email: email,
        userId: user?._id,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/email/send-otp`,
        sendData
      );

      // Accessing data from axios response
      const data = response.data;
      // console.log(data);

      if (data.message === "OTP sent successfully") {
        setIsModalOpen(true);
      } else {
        console.error("Failed to send OTP:", data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setOtpLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  const verifyEmail = async (email) => {
    setOtpLoading((prev) => ({ ...prev, verifyOtp: true }));

    try {
      const sendData = {
        email: email,
        userId: user?._id,
        enteredOtp: userData.otp,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/email/verify-email`,
        sendData
      );
      const data = response.data;

      // console.log(data);

      if (data.message === "OTP verified successfully") {
        setIsModalOpen(false);
        getUserData(user?._id);
      } else {
        console.error("Failed to verify OTP:", data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
    } finally {
      setOtpLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  const sendOtpPhone = async (phoneNumber) => {
    // console.log("Phone Number: ", phoneNumber);

    setOtpLoading((prev) => ({ ...prev, sendOtp: true }));
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
        .signInWithPhoneNumber(`+91${phoneNumber}`, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setisPhoneModalOpen(true);
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

  const textFieldStyles = {
  "& label": {
    color: "#543a5d",
  },
  "& label.Mui-focused": {
    color: "#543a5d",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#543a5d",
    },
    "&:hover fieldset": {
      borderColor: "#543a5d",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#543a5d",
    },
  },
};

  return (
    <div className="w-full mx-auto p-4 space-y-4">
      <div id="recaptcha-container"></div>
      <div className="flex flex-row gap-4 items-center justify-center mt-0">
        <img
          src={image}
          crossOrigin="anonymous"
          alt="Profile"
          className="rounded-full lg:h-52 lg:w-52 md:h-40 md:w-40 h-32 w-32 mb-4"
        />

        <div className="flex flex-col items-center">
          <label className="flex gap-2 bgGredient-purple hover:scale-105 rounded text-white w-full items-center justify-center py-2 px-4 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
            />
            <span className="">Browse </span>
            <FiUpload className="text-2xl" />
          </label>
          {imager && (
            <button
              className="flex gap-2 items-center bgGredient-green hover:scale-105 textLight m-2 px-4 py-2 rounded "
              onClick={() => submitImageData()}
              disabled={Imgloading}
            >
              {Imgloading ? "Updating.." : "Update"} <FiUploadCloud />
            </button>
          )}
        </div>
      </div>

      <div className="">
        <TextField
          label="Name"
          variant="outlined"
          value={userData.name || ""}
          fullWidth
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="flex-1 bg-white"
          sx={textFieldStyles}
        />
      </div>
      <div className="relative w-full flex flex-row items-center gap-1">
        <TextField
          label="Email"
          variant="outlined"
          value={userData.email || ""}
          fullWidth
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="bg-white w-full"
          disabled={userData.status.emailStatus === "verified"}
           sx={textFieldStyles}
        />
        {userData.status.emailStatus === "verified" && (
          <div className="absolute right-3 bottom-4 flex items-center gap-1">
            <MdVerified color="#343e25" size={20} />
            <span className="text-sm textGreen">Verified</span>
          </div>
        )}

        {userData.status.emailStatus !== "verified" && (
          <button
            className={`px-4 py-2 text-sm text-white rounded-md shadow-md focus:outline-none transition 
              ${otploading.sendOtp || !isValidEmail(userData.email)
                ? "bg-red-400 opacity-4 cursor-not-allowed"
                : "bgGredient-green hover:scale-105 focus:ring-2 focus:ring-[#343e25]"
              }`}
            onClick={() => sendOtp(userData.email)}
            disabled={otploading.sendOtp || !isValidEmail(userData.email)}
            aria-label="Verify user details"
          >
            {otploading.sendOtp ? "Please Wait..." : "Verify Email"}
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-labelledby="verify-email-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 id="verify-email-title" className="text-xl font-semibold">
                Verify Email
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              An email verification code has been sent to{" "}
              <span className="font-bold">
                {userData.email || "your email"}
              </span>
              . Please check your inbox and enter the verification code below to
              verify your email address.
            </p>
            <p className="text-red-500 font-semibold mb-4">
              If you haven't received the email, please check your spam or junk
              folder. If it's still not there, wait for 2 minutes and refresh
              this page to try again.
            </p>

            <TextField
              label="Enter verification code"
              variant="outlined"
              fullWidth
              className="mb-4"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, otp: e.target.value }))
              }
                sx={textFieldStyles}
            />

            <button
              className="text-white mt-4 bgGredient-purple hover:scale-105 px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#343e25] w-full"
              onClick={() => verifyEmail(userData.email)} // Replace with your verification logic
            >
              {otploading.verifyOtp ? "Please wait..." : "Verify"}
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full flex flex-row items-center gap-1">
        <TextField
          label="Phone"
          variant="outlined"
          value={userData.phone === "1234567890" ? "" : userData.phone || ""}
          fullWidth
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, phone: e.target.value }))
          }
          disabled={userData.status?.phoneStatus === "verified"}
          sx={textFieldStyles}
        />
        {userData.status?.phoneStatus === "verified" && (
          <div className="absolute right-3 bottom-4 flex items-center gap-1">
            <MdVerified color="#343e25" size={20} />
            <span className="text-sm textGreen">Verified</span>
          </div>
        )}

        {userData.status?.phoneStatus !== "verified" && (
          <button
            className={`px-4 py-2 text-sm text-white rounded-md shadow-md focus:outline-none transition 
              ${otploading.sendOtp || !isValidEmail(userData.email)
                ? "bg-red-400 opacity-4 cursor-not-allowed"
                : "bgGredient-green hover:scakle-105 focus:ring-2 focus:ring-[#343e25]"
              }`}
            onClick={() => sendOtpPhone(userData.phone)}
            aria-label="Verify user details"
          >
            {otploading.sendOtp ? "Please Wait..." : "Verify Phone-no."}
          </button>
        )}
      </div>

      {isPhoneModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-lg p-6 max-w-md space-y-2 w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="verify-phone-title" className="text-xl font-semibold">
                Verify Phone No.
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              A phone number verification code has been sent to{" "}
              <span className="font-bold">
                {userData.phone || "your phone number"}
              </span>
              . Please check your inbox and enter the verification code below to
              verify your phone number.
            </p>

            {/* Verification Code Field */}
            <TextField
              label="Enter verification code"
              variant="outlined"
              fullWidth
              className="mb-4"
              {...register("otp", {
                required: "Verification code is required.",
                minLength: {
                  value: 6,
                  message: "Verification code must be 6 characters long.",
                },
              })}
              error={!!errors.otp}
              helperText={errors.otp?.message}
              sx={textFieldStyles}
            />

            {/* Create Password Field */}
            <TextField
              label="Create password"
              variant="outlined"
              fullWidth
              type="password"
              className="mb-4"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long.",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={textFieldStyles}
            />

            {/* Confirm Password Field */}
            <TextField
              label="Confirm password"
              variant="outlined"
              fullWidth
              type="password"
              className="mb-4"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={textFieldStyles}
            />

            <Button
              type="submit"
              variant="contained"              
              fullWidth
              className="mt-4 bgGredient-purple hover:scale-105"
              disabled={otploading.verifyOtp}
            >
              {otploading.verifyOtp ? "Please wait..." : "Verify"}
            </Button>
          </form>
        </div>
      )}

      <TextField
        label="Address"
        variant="outlined"
        value={userData.Address || ""}
        fullWidth
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, Address: e.target.value }))
        }
          sx={textFieldStyles}
      />
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <TextField
          label="City"
          variant="outlined"
          value={userData.City || ""}
          className="w-full md:w-1/2"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, City: e.target.value }))
          }
            sx={textFieldStyles}
        />
        <TextField
          label="State"
          variant="outlined"
          value={userData.State || ""}
          className="w-full md:w-1/2"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, State: e.target.value }))
          }
          sx={textFieldStyles}
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <TextField
          label="Country"
          variant="outlined"
          value={userData.Country || ""}
          className="w-full md:w-1/2"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, Country: e.target.value }))
          }
          sx={textFieldStyles}
        />
        <TextField
          label="Pincode"
          variant="outlined"
          value={userData.Pincode || ""}
          className="w-full md:w-1/2"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, Pincode: e.target.value }))
          }
          sx={textFieldStyles}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="contained"
          className="bgGredient-purple hover:scale-105 text-white"        
          onClick={submitData}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
