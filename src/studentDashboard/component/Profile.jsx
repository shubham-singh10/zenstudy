import React, { useEffect, useState } from "react";
import { FiUpload, FiUploadCloud } from "react-icons/fi";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Add this package
import axios from "axios";
import { MdVerified } from "react-icons/md";

const Profile = () => {
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
  const [image, setImage] = useState(null);
  const [imager, setImager] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otploading, setOtpLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
  });
  const [Imgloading, setImgLoading] = useState(false);
  const [Dloading, setDLoading] = useState(true);
  const token = Cookies.get("access_tokennew");
  let userId = null;

  if (token) {
    try {
      userId = token;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

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
        imageUrl
      };
      // console.log("Image: ", updatedUserDetail);
      setUserData(updatedUserDetail || {});
      setDLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error: ${error.message}`,
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
    if (!userId) return;

    setLoading(true);
    // console.log("User_Data: ", userData)
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}zenstudy/api/user/updateUserN/${userId}`,
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
    if (!userId) return;

    setImgLoading(true);
    // console.log("User_Data: ", userData)
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}zenstudy/api/user/updatenew/${userId}`,
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
    if (userId) {
      getUserData(userId);
    }
  }, [userId]);

  if (Dloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
      </div>
    );
  }

  const sendOtp = async (email) => {
    setOtpLoading((prev) => ({ ...prev, sendOtp: true }));
    try {
      const sendData = {
        email: email,
        userId: token,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/email/send-otp`,
        sendData
      );

      // Accessing data from axios response
      const data = response.data;

      console.log(data);

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
        userId: token,
        enteredOtp: userData.otp,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/email/verify-email`,
        sendData
      );
      const data = response.data;

      console.log(data);

      if (data.message === "OTP verified successfully") {
        setIsModalOpen(false);
        getUserData(userId)
      } else {
        console.error("Failed to verify OTP:", data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
    } finally {
      setOtpLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  return (
    <form
      className="w-full mx-auto p-4 space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-row gap-4 items-center justify-center mt-0">
        <img
          src={image}
          crossOrigin="anonymous"
          alt="Profile"
          className="rounded-full lg:h-52 lg:w-52 md:h-40 md:w-40 h-32 w-32 mb-4"
        />

        <div className="flex flex-col items-center">
          <label className="flex gap-2 bg-blue-700 hover:bg-blue-800 rounded text-white w-full items-center justify-center py-2 px-4 cursor-pointer">
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
              className="flex gap-2 items-center bg-[#76b641] hover:bg-[#6ba63a] text-white m-2 px-4 py-2 rounded "
              onClick={() => submitImageData()}
              disabled={Imgloading}
            >
              {Imgloading ? "Updating.." : "Update"} <FiUploadCloud />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
        <TextField
          label="Name"
          variant="outlined"
          value={userData.name || ""}
          fullWidth
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="flex-1 bg-white"
        />

        <div className="relative w-full flex-1">
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
          />
          {userData.status.emailStatus === "verified" && (
            <div className="absolute right-3 bottom-4 flex items-center gap-1">
              <MdVerified color="green" size={20} />
              <span className="text-sm text-green-600">Verified</span>
            </div>
          )}

        </div>

        {userData.status.emailStatus !== "verified" && (
          <button
            className={`px-6 py-4 text-white rounded-md shadow-md focus:outline-none transition 
            ${otploading.sendOtp || !isValidEmail(userData.email)
                ? "bg-red-400 opacity-4 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:blue-red-300"
              }`}
            onClick={() => sendOtp(userData.email)}
            disabled={otploading.sendOtp || !isValidEmail(userData.email)}
            aria-label="Verify user details"
          >
            {otploading.sendOtp ? "Please Wait..." : "Verify Email"}
          </button>
        )}

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
                {
                  // <button
                  //   onClick={closeModal}
                  //   className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  //   aria-label="Close modal"
                  // >
                  //   &#10005;
                  // </button>
                }
              </div>
              <p className="text-gray-700 mb-4">
                An email verification code has been sent to{" "}
                <span className="font-bold">
                  {userData.email || "your email"}
                </span>
                . Please check your inbox and enter the verification code below
                to verify your email address.
              </p>
              <p className="text-red-500 font-semibold mb-4">
                If you haven't received the email, please check your spam or
                junk folder. If it's still not there, wait for 2 minutes and
                refresh this page to try again.
              </p>

              <TextField
                label="Enter verification code"
                variant="outlined"
                fullWidth
                className="mb-4"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, otp: e.target.value }))
                }
              />
              {/* Placeholder for error message */}
              {/* <p className="text-sm text-red-500">Invalid verification code. Please try again.</p> */}
              <button
                className="text-white mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                onClick={() => verifyEmail(userData.email)} // Replace with your verification logic
              >
                {otploading.verifyOtp ? "Please wait..." : "Verify"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full flex-1">
        <TextField
          label="Phone"
          variant="outlined"
          value={userData.phone || ""}
          fullWidth
          disabled
        />
        <div className="absolute right-3 bottom-4 flex items-center gap-1">
          <MdVerified color="green" size={20} />
          <span className="text-sm text-green-600">Verified</span>
        </div>
      </div>

      <TextField
        label="Address"
        variant="outlined"
        value={userData.Address || ""}
        fullWidth
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, Address: e.target.value }))
        }
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
        />
        <TextField
          label="State"
          variant="outlined"
          value={userData.State || ""}
          className="w-full md:w-1/2"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, State: e.target.value }))
          }
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
        />
        <TextField
          label="Pincode"
          variant="outlined"
          value={userData.Pincode || ""}
          className="w-full md:w-1/2"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, Pincode: e.target.value }))
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default Profile;
