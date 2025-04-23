import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  BiAward,
  BiBook,
  BiBookOpen,
  BiCalendar,
  BiMapPin,
} from "react-icons/bi";
import { FaClock, FaUsers } from "react-icons/fa";
import { FiTarget, FiX } from "react-icons/fi";
import { LuCheckCircle2 } from "react-icons/lu";
import { Loader } from "./loader/Loader";
import toast from "react-hot-toast";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { usePageTracking } from "../usePageTracking";

const RegistrationForm = ({
  isPopup = false,
  Loading,
  formData = { name: "", email: "", phone: "", education: "", customEducation: "" },
  handleChange = () => { },
  handleSubmit = () => { },
  closePopup = () => { },
}) => (
  <div
    className={`bg-white rounded-lg shadow-lg p-8 ${isPopup ? "relative" : ""}`}
  >
    {isPopup && (
      <button
        onClick={closePopup}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiX className="w-6 h-6" />
      </button>
    )}
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
      Register for the Webinar
    </h2>
    <p className="text-center text-gray-600 mb-8">
      Limited seats available. Reserve your spot today!
    </p>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => handleChange(e)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
          placeholder="Enter your phone number"
        />
      </div>


      <div>
        <label
          htmlFor="education"
          className="block text-sm font-medium text-gray-700"
        >
          Are you a student or parent?
        </label>
        <select
          id="userInfo"
          name="userInfo"
          required
          value={formData.userInfo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
        >
          <option value="">Please Select</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="education"
          className="block text-sm font-medium text-gray-700"
        >
          What are you doing now?
        </label>
        <select
          id="education"
          name="education"
          required
          value={formData.education}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
        >
          <option value="">Please Select</option>
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="working">Working</option>
          <option value="others">Others</option>
        </select>
      </div>

      {formData.education === "others" && (
        <div className="mt-4">
          <label
            htmlFor="customEducation"
            className="block text-sm font-medium text-gray-700"
          >
            Please specify
          </label>
          <input
            type="text"
            id="customEducation"
            name="customEducation"
            required
            value={formData.customEducation || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
            placeholder="Enter your qualification"
          />
        </div>
      )}


      {Loading ? <button
        className="w-full cursor-not-allowed bg-red-600 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        Please Wait...
      </button> : <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md py-3 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Register Now
      </button>}
    </form>
  </div>
);

function Webinar() {
  // Track page view for Google Analytics
  usePageTracking();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    customEducation: "",
    userInfo: "",
  });

  useEffect(() => {
    // Check if the user has previously closed the popup
    const hasClosedPopup = localStorage.getItem("hasClosedPopup");
    if (!hasClosedPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000); // Show popup after 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    window.gtag('event', 'form_submission', {
      event_category: 'Webinar',
      event_label: 'Register Form',
    });
    
    try {
      setFormSubmitted(true);
      setLoading(true);
      setShowPopup(false);
      localStorage.setItem("hasClosedPopup", "true");

      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: "webinar",
        others: formData.userInfo,
        message:
          formData.education === "others"
            ? formData.customEducation
            : formData.education,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API2}zenstudy/api/contact`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("Registration successful! Check your email for details.");
        // Clear form only on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          education: "",
          customEducation: "",
          userInfo: "",
        });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem("hasClosedPopup", "true");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Popup Modal */}
      {showPopup && !formSubmitted && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closePopup}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <RegistrationForm
                isPopup={true}
                formData={formData}
                Loading={Loading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                closePopup={closePopup}
              />
            </div>
          </div>
        </div>
      )}

      {Loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <Loader fill="#fff" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Banner Image */}
        <div className="w-full">
          <img
            src="../assets/webinar.png"
            alt="Background"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Text and Button Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center bg-white">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            Thinking Beyond Degrees: <br />
            <span className="text-blue-600">Crafting Careers with Imagination & UPSC Vision</span>
          </h3>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive webinar and discover a revolutionary approach to education that inspires curiosity and fuels imaginative learning. Let us help you reimagine your future.
          </p>
          <div className="mt-10">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              🎓 Reserve Your Spot Now
            </button>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <BiCalendar className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>April 27, 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <FaClock className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>7pm - 8pm</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <BiMapPin className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Platform</h3>
                <p>Online (Zoom)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <BiBookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Language</h3>
                <p>English & Hindi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Join This Webinar?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover how our expert-led session can transform your UPSC
              preparation journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
              <FiTarget className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Strategic Approach</h3>
              <p className="text-gray-600">
                Learn proven techniques and methodologies to tackle the UPSC
                syllabus effectively
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
              <BiAward className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Get insights from top educators and successful UPSC candidates
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
              <FaUsers className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Interactive Session
              </h3>
              <p className="text-gray-600">
                Engage in Q&A sessions and get your doubts cleared by experts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Get Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              What You'll Get
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              By attending this webinar, you're not just gaining clarity —
              you're getting real value to kickstart your journey with ZenStudy:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <BiBook className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Free Career Clarity & UPSC Guidance
                </h3>

                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>Discover the best career paths after Class 12.</p>
                </div>

                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>Understand how to prepare for UPSC from an early stage.</p>
                </div>

                <div className="flex items-start gap-1 text-gray-600">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>
                    Learn how ZenStudy is reshaping education with imagination.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BiBook className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Exclusive Access to Our Learning Platform
                </h3>
                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>Get free access to ZenStudy’s website dashboard.</p>
                </div>

                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>
                    Explore our features, notes, and learning tools built for
                    UPSC aspirants.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BiBook className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Special Discount on Our UPSC Foundation Batch
                </h3>
                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>
                    Receive a special discount on our upcoming UPSC Foundation
                    Batch.
                  </p>
                </div>
                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>
                    Start strong with structured classes, mentorship, and expert
                    guidance.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BiBook className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Free Access to Premium Recorded Courses
                </h3>
                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>Get 100% free access to select recorded video courses.</p>
                </div>
                <div className="flex items-start gap-1 text-gray-600 mb-1">
                  <span className="mt-1">
                    <VscDebugBreakpointLog />
                  </span>
                  <p>
                    {" "}
                    These are paid courses we are offering exclusively to
                    webinar attendees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div id="register" className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          {formSubmitted ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <LuCheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600">
                Thank you for registering. We'll send you the webinar details
                shortly.
              </p>
            </div>
          ) : (
            <RegistrationForm formData={formData}
              Loading={Loading}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              closePopup={closePopup} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Webinar;
