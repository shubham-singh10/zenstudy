import React, { useMemo, useState, lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { useSpring, animated } from "@react-spring/web";

const useSlideIn = (direction = "y", offset = 100) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const style = {
    from: { [direction]: offset, opacity: 0 },
    to: { [direction]: inView ? 0 : offset, opacity: inView ? 1 : 0 },
    config: { duration: 500 },
  };

  return { ref, style };
};

const FeatureVideo = () => {
  const defaultMainVideo =
    "https://www.youtube.com/embed/NGEdEEU3jzs?si=zcoWpQeGQBnX1vcp";

const initialVideos = useMemo(
  () => [
    {
      id: "wacuLI6d9B8",
      thumbnail: "https://img.youtube.com/vi/wacuLI6d9B8/mqdefault.jpg",
    },
    {
      id: "Dy1BI3Nw6yU",
      thumbnail: "https://img.youtube.com/vi/Dy1BI3Nw6yU/mqdefault.jpg",
    },
    {
      id: "BjZWoASxPhY",
      thumbnail: "https://img.youtube.com/vi/BjZWoASxPhY/mqdefault.jpg",
    },
    {
      id: "OQEy489ntwA",
      thumbnail: "https://img.youtube.com/vi/OQEy489ntwA/mqdefault.jpg",
    },
  ],
  []
);


  const [mainVideo, setMainVideo] = useState(defaultMainVideo);
  const [otherVideos, setOtherVideos] = useState(initialVideos);

  const handleSwap = (index) => {
    const clicked = otherVideos[index];
    const currentMainID = mainVideo.split("/embed/")[1]?.split("?")[0];

    setMainVideo(`https://www.youtube.com/embed/${clicked.id}`);
    const updatedVideos = [...otherVideos];
    updatedVideos[index] = {
      id: currentMainID,
      thumbnail: `https://img.youtube.com/vi/${currentMainID}/mqdefault.jpg`,
    };
    setOtherVideos(updatedVideos);
  };

  // Animation hooks
  const mainTitleAnim = useSlideIn("y", 100);
  const textContentAnim = useSlideIn("x", -100);
  const videoBlockAnim = useSlideIn("y", 100);
  const thumbnailsAnim = useSlideIn("x", -100);

  return (
    <div className="w-full mt-20 min-h-[70vh] relative">
      <div className="px-4 md:px-10 lg:px-12">
        <Suspense fallback={<p className="text-center text-lg">Loading animation...</p>}>
          <animated.p
            style={mainTitleAnim.style}
            className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold textPurpleGradient"
          >
            Ex
            <span className="border-b-4 border-[#543a5d]">plore Feature Vide</span>os
          </animated.p>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 items-center justify-between">
            {/* Text */}
            <animated.div
              ref={textContentAnim.ref}
              style={textContentAnim.style}
              className="lg:w-2/4 flex flex-col gap-4 items-start w-full  lg:mt-0"
            >
              <p className="textPurpleGradient font-bold lg:text-2xl text-xl">
                Watch Our Videos
              </p>
              <p className="text-[#5D6169]">
                 Zenstudy excels in providing quality education through its YouTube channel, featuring well-crafted videos with excellent graphics. Our UPSC playlist stands out for its value, delivery, and examination-oriented content. We're making education imaginative to ensure engaging and effective learning.
              </p>
              <Link
                to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="custom-btn-2">
                  <span className="custom-btn-2-bg"></span>
                  <span className="custom-btn-2-text">Watch Now</span>
                </button>
              </Link>
            </animated.div>

            {/* Video Section */}
            <animated.div
              ref={videoBlockAnim.ref}
              style={videoBlockAnim.style}
              className="lg:w-2/4 flex flex-col gap-4 w-full p-0 lg:p-10 md:p-10"
            >
              {/* Main Video */}
              <div className="w-full h-[30vh] lg:h-[50vh]">
                <iframe
                  src={mainVideo}
                  title="Main Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Thumbnails */}
              <animated.div
                ref={thumbnailsAnim.ref}
                style={thumbnailsAnim.style}
                className="flex justify-between items-center w-full lg:flex-row flex-wrap gap-1"
              >
                {otherVideos.map((video, index) => (
                  <div
                    key={video.id}
                    className="relative lg:w-[23%] w-[48%] cursor-pointer"
                    onClick={() => handleSwap(index)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={`Video ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25 hover:bg-opacity-0 transition duration-200 rounded" />
                  </div>
                ))}
              </animated.div>
            </animated.div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(FeatureVideo);
