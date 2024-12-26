import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// VerifyEmailMsg Component
function VerifyEmailMsg() {
  const token = Cookies.get("access_tokennew");
  const [userStatus, setUserStatus] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = token;

    if (!userId) {
      // console.error("No user ID found in token.");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/user/userdetail/${userId}`
        );
        const data = response.data;
        setUserStatus(data.userdetail.status);
        setUserData(data.userdetail);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  return { userStatus, userData };
}

// PopUpMsg Component
function PopUpMsg() {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate("/profile");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex items-center justify-center flex-col gap-3 bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <p className="text-lg font-medium text-gray-800 mb-4">
          Please verify your email to continue.
        </p>
        <button
          onClick={handleOkClick}
          className="bg-blue-600 w-[50%] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          OK
        </button>
      </div>
    </div>
  );
}

// Named Exports
export { VerifyEmailMsg, PopUpMsg };

