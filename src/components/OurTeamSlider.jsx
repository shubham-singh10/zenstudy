import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Custom Next Arrow
const NextArrow = ({ onClick }) => {
  return (
    <button
      className="absolute z-10 right-4 lg:top-[600px] md:top-[620px] top-[620px] transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md"
      onClick={onClick}
    >
      <FaArrowRight />
    </button>
  );
};

// Custom Prev Arrow
const PrevArrow = ({ onClick }) => {
  return (
    <button
      className="absolute z-10 right-16 lg:top-[600px] md:top-[620px] top-[620px] transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md"
      onClick={onClick}
    >
      <FaArrowLeft />
    </button>
  );
};

function OurTeamSlider() {
  const { ref: slideLeftRef, inView: slideLeftInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  const slideLeftStyles = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
    config: { duration: 500 },
  });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    beforeChange: (current, next) => setActiveSlide(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "0",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0",
        },
      },
    ],
  };

  const facultyData = [

    {
      id: 1,
      title: "Sachin Srivastava",
      role: "GS Faculty",
      description:
        "He is a senior teacher with over 10 years of experience in teaching UPSC aspirants. He graduated from Allahabad University and completed his post-graduation in Geography. He has excellent communication skills and explains topics with ease. Under his guidance, many students have successfully cleared the UPSC examination.",
      thumbnail:
        "/assets/sachin.webp",
    },
    {
      id: 2,
      title: "Krittika Mishra",
      role: "GS Faculty",
      description:
        "An insightful educator, thinker, and keen observer. With a strong academic background, she holds a B.Tech in Biotechnology from the prestigious National Institute of Technology (NIT), Durgapur. Following her engineering studies, she ventured into the development sector, where her hands-on experiences sparked a deeper interest in understanding societal structures and national issues. Her career evolved as she transitioned into the educational sphere, where she now focuses on developing lectures for General Studies. Her areas of expertise include Society, Ethics, Economy, and Environmental Education. Passionate about teaching, Krittika is known for her engaging and thoughtful approach, as well as her ability to foster teamwork and collaboration within academic environments.",

      thumbnail:'/assets/kritika.webp',

    },

    {
      id: 3,
      title: "Ansh Arora",
      role: "Designing Head",
      description:
        "Ansh Arora, Designing Head of Zenstudy. With a unique fusion of creativity and strategic insight, Ansh excels as both a designer and business developer. With over 3 years of experience in branding, digital design, and product development. He creates innovative design solutions that not only captivate but also drive business growth. Ansh has a proven track record in identifying market opportunities and developing tailored strategies that align with business goals. Ansh believes that effective design should tell a story and enhance user experience while contributing to overall business objectives. When not crafting impactful designs or strategizing new ventures, he enjoys socialising and staying up-to-date with the latest industry trends.",
      thumbnail:'/assets/ansh.webp',

    },
    {
      id: 4,
      title: "Gaurav Rai",
      role: "CTO",
      description:
        "Gaurav Rai, CTO of Zenstudy, is a seasoned full-stack developer with a passion for Edtech. With a BTech in Computer Science, he has built a strong foundation in technology. His experience at Prutor.ai and various freelance projects has honed his skills and fueled his entrepreneurial spirit. At Zenstudy, Gaurav leverages his expertise to develop innovative learning platforms. His leadership, technical acumen, and dedication to creating impactful educational experiences make him a valuable asset to the edtech industry.",
      thumbnail:'/assets/gaurav.webp',
    },
  ];

  const [showFullText, setShowFullText] = useState({});

  // Function to toggle the read more
  const toggleReadMore = (id) => {
    setShowFullText((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div>
      <animated.div
        ref={slideLeftRef}
        style={slideLeftStyles}
        className="w-full"
      >
        <div className="mx-4 mb-10 lg:mb-20 lg:mx-20 md:mx-15 relative">
          <Slider {...settings}>
            {facultyData.map((faculty, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-between rounded-2xl overflow-hidden shadow-lg shadow-slate-500 my-20 p-6 transition-transform duration-500 bg-white ${index === activeSlide
                    ? "transform translate-y-[30px] opacity-100"
                    : "opacity-70"
                  }`}
              >
                <div className=" flex justify-center">
                  <img
                    src={faculty.thumbnail}
                    alt="Profile"
                    className="w-45 h-45"
                  />
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-blue-600">
                    {faculty.title}
                  </h2>
                  <p className="italic text-gray-500">{faculty.role}</p>
                </div>

                <div className="text-center mt-4 px-6">
                  <p className="text-gray-700 text-sm">
                    {/* Conditionally render the full description or truncated version */}
                    {showFullText[faculty.id]
                      ? faculty.description
                      : truncateText(faculty.description, 20)}
                  </p>
                  <button
                    className="text-blue-600 mt-2"
                    onClick={() => toggleReadMore(faculty.id)}
                  >
                    {showFullText[faculty.id] ? "Read Less" : "Read More"}
                  </button>
                </div>

                {
                  //   <div className="flex w-full justify-end mt-6 space-x-4">
                  //   <FaLinkedin className="text-blue-600 w-6 h-6 cursor-pointer" />
                  //   <FaInstagram className="text-blue-600 w-6 h-6 cursor-pointer" />
                  //   <FaFacebook className="text-blue-600 w-6 h-6 cursor-pointer" />
                  //   <FaTwitter className="text-blue-600 w-6 h-6 cursor-pointer" />
                  // </div>
                }
              </div>
            ))}
          </Slider>
        </div>
      </animated.div>
    </div>
  );
}

export default OurTeamSlider;
