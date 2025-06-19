import React, { useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

// Reusable slide animation hook
const useSlideIn = (direction = "y", offset = 100) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const style = useSpring({
    from: { [direction]: offset, opacity: 0 },
    to: { [direction]: inView ? 0 : offset, opacity: inView ? 1 : 0 },
    config: { duration: 500 },
  });

  return { ref, style };
};

const FeatureVideo = () => {
  const defaultMainVideo =
    "https://www.youtube.com/embed/AG864au506w?si=GVRC4EWr-zkyDivQ";

  const initialVideos = useMemo(
    () => [
      "https://www.youtube.com/embed/J6TplwoZ9vs?si=X-9zaftr5RlDbSdg",
      "https://www.youtube.com/embed/BXTyVqhgx7g?si=SrKRvCQxodnJTbhf",
      "https://www.youtube.com/embed/QDEEF3SEISI?si=6KEthpl3TP8qwaDA",
      "https://www.youtube.com/embed/5yUspRCx-kI?si=Y-XVNg1AVlNRsbyk",
    ],
    []
  );

  const [mainVideo, setMainVideo] = useState(defaultMainVideo);
  const [otherVideos, setOtherVideos] = useState(initialVideos);

  const handleSwap = (index) => {
    const newMainVideo = otherVideos[index];
    const newOtherVideos = [...otherVideos];
    newOtherVideos[index] = mainVideo;
    setMainVideo(newMainVideo);
    setOtherVideos(newOtherVideos);
  };

  // Animations
  const mainTitleAnim = useSlideIn("y", 100);
  const textContentAnim = useSlideIn("x", -100);
  const videoBlockAnim = useSlideIn("y", 100);
  const thumbnailsAnim = useSlideIn("x", -100);

  return (
    <div className="w-full lg:-mt-36 md:-mt-36 -mt-52 min-h-[70vh] relative">
      <div className="px-4 md:px-10 lg:px-12">
        <animated.p
          style={mainTitleAnim.style}
          className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold textPurpleGradient"
        >
          Ex
          <span className="border-b-4 border-[#543a5d]">plore Feature Vide</span>os
        </animated.p>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 items-center justify-between">
          {/* Text Content */}
          <animated.div
            ref={textContentAnim.ref}
            style={textContentAnim.style}
            className="lg:w-2/4 flex flex-col gap-4 items-start w-full mt-[150px] lg:mt-0"
          >
            <p className="textPurpleGradient font-bold lg:text-3xl text-2xl">
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

          {/* Main Video and Thumbnails */}
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

            {/* Video Thumbnails */}
            <animated.div
              ref={thumbnailsAnim.ref}
              style={thumbnailsAnim.style}
              className="flex justify-between items-center w-full lg:flex-row flex-wrap gap-1"
            >
              {otherVideos.map((video, index) => (
                <div
                  key={index}
                  className="relative lg:w-[23%] w-[48%] "
                >
                  <iframe
                    src={video}
                    title={`Video ${index}`}
                    className="w-full "
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                  <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => handleSwap(index)}
                  ></div>
                </div>
              ))}
            </animated.div>
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeatureVideo);
