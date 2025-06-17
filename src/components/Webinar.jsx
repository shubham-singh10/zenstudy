import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
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
// import NewFooter from "./NewFooter";

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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-[#543a5d] focus:ring-[#543a5d] px-4 py-2 border"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-[#543a5d] focus:ring-[#543a5d] px-4 py-2 border"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-[#543a5d] focus:ring-[#543a5d] px-4 py-2 border"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-[#543a5d] focus:ring-[#543a5d] px-4 py-2 border"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-[#543a5d] focus:ring-[#543a5d] px-4 py-2 border"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none focus:border-[#543a5d] focus:ring-[#543a5d] px-4 py-2 border"
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
        className="w-full bg-[#543a5d] text-white rounded-md py-3 px-4 hover:bg-[#795187] focus:outline-none focus:ring-2 focus:ring-[#543a5d] focus:ring-offset-2 transition-colors"
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
    <Fragment>
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
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
<div className="relative overflow-hidden bgGradient-purple-light lg:py-16 md:py-12 py-6">
  {/* Banner Image and Date */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-7xl mx-auto lg:px-6 md:px-4 px-2">
  
  {/* Image */}
  <div className="overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 h-full">
    <img
      src="../assets/newWebinar.png"
      alt="Webinar Banner"
      className="w-full h-full object-fill hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* Date Card */}
  <div className="backdrop-blur-md bg-white/80 border border-gray-200 lg:p-10 md:p-8 p-2 rounded-3xl shadow-md hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
    <div>
    <div className="flex items-center justify-center gap-6 mb-6 p-6 bgGradient-purple-light rounded-xl border border-[#543a5d] shadow-lg">
    <div className="flex-shrink-0">
      <BiCalendar className="lg:w-14 lg:h-14 w-8 h-8 text-[#543a5d] drop-shadow-md" />
    </div>
    <div className="text-center">
      <h3 className="text-md md:text-2xl font-medium text-[#543a5d] mb-1">
        Save the Date!
      </h3>
      <p className="text-lg md:text-3xl font-extrabold text-gray-700 ">
      1 June, 2025
      </p>
    </div>
  </div>

      <p className="text-gray-700 text-base leading-relaxed mb-6 text-center">
        📌 Save the date! Join us for a transformative webinar designed for future leaders and thinkers.
      </p>
    </div>

    <div className="flex justify-center items-center mt-2">
      <button
        onClick={() => setShowPopup(true)}
        className="w-full  px-8 lg:py-4 md:py-4 py-3 text-lg font-semibold bg-gradient-to-r from-[#543a5d] to-[#935aa6] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
      > 
        <span className="inline-block animate-bounce">🎓 Reserve Your Spot Now</span>
      </button>
    </div>
  </div>
</div>


  {/* Hero Text and Button */}
  <div className="text-center mt-20 px-6">
    <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-6">
      Thinking Beyond Degrees: <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#543a5d] to-[#935aa6]">
        Crafting Careers with Imagination & UPSC Vision
      </span>
    </h1>
    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
      🚀 Join our exclusive webinar and discover a revolutionary approach to education that sparks curiosity and fuels imaginative learning. Reimagine your future with us!
    </p>
  </div>
</div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <BiCalendar className="w-8 h-8 text-[#543a5d]" />
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>1 June, 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <FaClock className="w-8 h-8 text-[#543a5d]" />
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>5pm - 6pm</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <BiMapPin className="w-8 h-8 text-[#543a5d]" />
              <div>
                <h3 className="font-semibold">Platform</h3>
                <p>Online (Zoom)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <BiBookOpen className="w-8 h-8 text-[#543a5d]" />
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
              <FiTarget className="w-12 h-12 text-[#543a5d] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Strategic Approach</h3>
              <p className="text-gray-600">
                Learn proven techniques and methodologies to tackle the UPSC
                syllabus effectively
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
              <BiAward className="w-12 h-12 text-[#543a5d] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Get insights from top educators and successful UPSC candidates
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
              <FaUsers className="w-12 h-12 text-[#543a5d] mb-4" />
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
              <BiBook className="w-6 h-6 text-[#5d6e53] flex-shrink-0 mt-1" />
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
              <BiBook className="w-6 h-6 text-[#5d6e53] flex-shrink-0 mt-1" />
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
              <BiBook className="w-6 h-6 text-[#5d6e53] flex-shrink-0 mt-1" />
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
              <BiBook className="w-6 h-6 text-[#5d6e53] flex-shrink-0 mt-1" />
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
    
    </Fragment>
  );
}

export default Webinar;
