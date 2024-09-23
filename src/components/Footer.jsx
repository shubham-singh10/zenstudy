import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoCallSharp } from "react-icons/io5";
import { FaSearchLocation, FaWhatsapp } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Footer = () => {
  const date = new Date();
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") {
      setErrors({ email: "" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const sendData = {
        name: formData.fullName,
        email: formData.email,
        message: formData.message,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/contact`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // //console.log("Contact", data)
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Message Sent Successfully!",
          timer: 3000,
          text: "Thank you for reaching out. We will get back to you soon.",
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }

    // Clear form data
    setFormData({ fullName: "", email: "", message: "" });
  };

  return (
    <div className="bg-[#054BB4] w-full min-h-[35vh] text-[#CADEFB]">
      <div className="lg:px-12 md:px-8 px-4 py-4 flex flex-wrap items-start justify-between">
        {/* Upper Section */}
        <div className="w-full mt-4 lg:w-1/2 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-6 mb-5 md:mb-0">
            <div>
              <p className="text-3xl font-bold">
                ZenStudy<span>.</span>
              </p>
              <p className="text-[10px]">Making Education Imaginative</p>
            </div>
            <div>
              <p className="font-medium text-sm">
                ZenStudy is a result of the vision of "MAKING EDUCATION
                IMAGINATIVE". We have ventured into the field of education.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <Link
                to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu"
                target="blank"
                className="hover:bg-red-500 rounded-full p-2"
              >
                <FiYoutube size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://www.instagram.com/zenstudyz/"
                target="blank"
                className="hover:bg-gradient-to-br from-[#405DE6] via-[#5B51D8] to-[#E1306C] rounded-full p-2"
              >
                <FiInstagram size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://www.facebook.com/people/Zenstudy/61555473406607/"
                target="blank"
                className="hover:bg-[#4267B2] rounded-full p-2"
              >
                <FiFacebook size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://twitter.com/ZenstudyZ"
                target="blank"
                className="hover:bg-[#1DA1F2] rounded-full p-2"
              >
                <FiTwitter size={25} className="hover:text-white" />
              </Link>
              <Link
                to="https://wa.me/919810246095"
                target="blank"
                className="flex justify-end bg-green-500  hover:bg-green-700 p-2 text-white z-50 rounded-full fixed bottom-0 right-5 mb-6 text-4xl animate-bounce ..."
              >
                <div>
                  <FaWhatsapp />
                </div>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center ">
            <ul className="flex  flex-col gap-2 text-sm md:items-start lg:px-20 md:px-14 px-0 items-start w-full">
              <li className=" text-2xl font-semibold mb-4">Menu</li>
              <Link to="/" className="hover:text-white">
                <li>Home</li>
              </Link>
              <Link to="/about" className="hover:text-white">
                <li>About</li>
              </Link>

              <Link to="/ourteam" className="hover:text-white">
                <li>Our Team</li>
              </Link>

              <Link to="/courses" className="hover:text-white">
                <li>Courses</li>
              </Link>
              <Link to="https://blog.zenstudy.in/" className="hover:text-white">
                <li>Blogs</li>
              </Link>
              <Link to="/contact" className="hover:text-white">
                <li>Contact</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Lower Section */}
        <div className="w-full lg:w-1/2 mt-4 flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col gap-7 text-sm mb-5 md:mb-0">
            <div className="text-2xl font-semibold">Get In Touch</div>
            <div className="flex items-start gap-2">
              <IoCallSharp className="text-xl" />
              <p>+91- 9810246095</p>
            </div>
            <div className="flex items-start gap-2">
              <FaSearchLocation className="text-2xl" />
              <p>
                7/46, Shankar Rd, Block 7, Old Rajinder Nagar, Rajinder Nagar,
                New Delhi, Delhi, 110060
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col lg:items-center md:items-start items-start">
            <form
              className="flex w-full flex-col gap-4 p-4 shadow-md shadow-[#648ecd] rounded-lg max-w-md mx-auto"
              onSubmit={onSubmit}
            >
              <p className=" text-2xl font-semibold text-center ">
                Contact with us
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder={!nameFocused ? "Enter your name" : ""}
                  name="fullName"
                  value={formData.fullName}
                  className="p-2 border w-full text-[#000000] bg-[#fcfcfc] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder={!emailFocused ? "Enter your email" : ""}
                  className="p-2 border w-full text-[#000000] bg-[#fcfcfc] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder={!messageFocused ? "Message..." : ""}
                  name="message"
                  value={formData.message}
                  className="p-2 border w-full text-[#000000] bg-[#fcfcfc] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none transition duration-200 placeholder-gray-400"
                  onFocus={() => setMessageFocused(true)}
                  onBlur={() => setMessageFocused(false)}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              {Loading ? (
                <button
                  disabled
                  type="button"
                  class="bg-red-700 font-semibold text-white rounded-lg py-2"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="transition duration-200 font-semibold text-white rounded-lg py-2 bg-blue-500 hover:bg-blue-600"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="lg:px-12 md:px-8 px-4 py-4 border-t border-[#CADEFB]">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="text-center flex flex-wrap items-center justify-between w-full">
            <p>Copyright (c) All Rights Reserved {date.getFullYear()}</p>
            <Link to="/" className="hover:text-white">
              <p>ZenStudy</p>
            </Link>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
