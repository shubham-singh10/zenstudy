import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { IoMdMail } from "react-icons/io";
import { MdLocalPhone } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import Swal from "sweetalert2";

const ContactUs = () => {
  // Hooks for section visibility
  const { ref: refSlideLeft, inView: inViewSlideLeft } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refSlideRight, inView: inViewSlideRight } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refSlideLeftMap, inView: inViewSlideLeftMap } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation for left sliding section
  const SlideLeft = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewSlideLeft ? 0 : -100, opacity: inViewSlideLeft ? 1 : 0 },
    config: { duration: 500 },
  });

  // Animation for right sliding section
  const SlideRight = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewSlideRight ? 0 : 100, opacity: inViewSlideRight ? 1 : 0 },
    config: { duration: 500 },
  });

  // Animation for the map section
  const SlideLeftMap = useSpring({
    from: { x: -100, opacity: 0 },
    to: {
      x: inViewSlideLeftMap ? 0 : -100,
      opacity: inViewSlideLeftMap ? 1 : 0,
    },
    config: { duration: 500 },
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [Loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  // Handle form change
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    // Check if any field is empty
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all the fields!",
        timer: 2500,
      });
      return;
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is not valid",
      }));
      valid = false;
    }

    if (valid) {
      setLoading(true);
      try {
        const sendData = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          type: "enquiry",
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

            if (window.fbq) {
      window.fbq('track', 'Contact');
    }
    
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
      setFormData({
        fullName: "",
        email: "",
        message: "",
        phone: "",
      });
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
    <div>
      <div className="flex flex-col lg:flex-row p-4 lg:p-12 bg-white gap-10">
        <animated.div
          style={SlideLeft}
          ref={refSlideLeft}
          className="bgGredient-purple-lr text-white p-4 lg:p-16  lg:rounded-br-[40%] md:rounded-br-[30%] rounded-br-[20%] flex-1"
        >
          <h2 className="text-3xl textGoldGradient font-bold mb-4">
            Contact Us
          </h2>
          <div className="space-y-4 mb-8">
            <p className="flex gap-2 items-center">
              <i className="fas fa-envelope text-xl">
                <IoMdMail />
              </i>{" "}
              contact@zenstudy.in
            </p>
            <p className="flex gap-2 items-center">
              <i className="fas fa-phone text-xl">
                <MdLocalPhone />
              </i>{" "}
              +91- 9810246095
            </p>
            <p className="flex gap-2 items-center">
              <i className="fas fa-map-marker-alt text-xl">
                <FaLocationDot />
              </i>{" "}
              7/46, Shankar Rd, Block 7, Old Rajinder Nagar, Rajinder Nagar, New
              Delhi, Delhi, 110060
            </p>
          </div>
          <h3 className="text-2xl font-bold mb-4 textGoldGradient">
            Connect with us
          </h3>
          <div className="flex space-x-4">
            <div className="flex space-x-4 justify-center items-center">
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
            </div>
          </div>
        </animated.div>
        <animated.div
          style={SlideRight}
          ref={refSlideRight}
          className="flex-1 lg:p-8 md-p-4 p-1"
        >
          <h2 className="text-3xl font-bold mb-8 textPurpleGradient">
            Get In Touch
          </h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Box
              sx={{ "& > :not(style)": { m: 1 } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                className="w-full"
                id="outlined-basic"
                name="fullName"
                label="Enter Full Name"
                value={formData.fullName}
                onChange={handleChange}
                variant="outlined"
                sx={purpleOutline}
              />
              <TextField
                className="w-full"
                id="outlined-basic"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                label="Enter Your Email"
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={purpleOutline}
              />
              <TextField
                className="w-full"
                id="outlined-basic"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                label="Enter Your Phone"
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                sx={purpleOutline}
              />
              <TextField
                className="w-full"
                id="outlined-basic"
                name="message"
                value={formData.message}
                onChange={handleChange}
                label="Enter Your Message"
                variant="outlined"
                multiline
                rows={4}
                sx={purpleOutline}
              />
            </Box>

            <button
              type="submit"
              className="bgGredient-purple bg-gradient-to-r hover:from-[#935aa6] hover:to-[#543a5d]  text-white py-2 px-4 rounded-md"
              disabled={Loading}
            >
              {Loading ? "Please wait..." : "Submit"}
            </button>
          </form>
        </animated.div>
      </div>

      <div ref={refSlideLeftMap} className="p-4 lg:p-16 md:p-8">
        <animated.h2
          style={SlideLeftMap}
          className="text-3xl font-bold mb-8 textPurpleGradient"
        >
          Find Us On Map
        </animated.h2>
        <animated.iframe
          style={SlideLeftMap}
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d28013.452410248326!2d77.15255183858231!3d28.63930484227425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x390d03546ed7b9f1%3A0x5067889d8241272f!2szenstudy!3m2!1d28.6467262!2d77.1632791!5e0!3m2!1sen!2sin!4v1720787355305!5m2!1sen!2sin"
          width="600"
          title="Map"
          height="450"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full "
        ></animated.iframe>
      </div>
    </div>
  );
};

export default ContactUs;
