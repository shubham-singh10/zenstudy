import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const FeatureVideo = () => {
  const [mainVideo, setMainVideo] = useState(
    "https://www.youtube.com/embed/AG864au506w?si=GVRC4EWr-zkyDivQ"
  );
  const [otherVideos, setOtherVideos] = useState([
    "https://www.youtube.com/embed/J6TplwoZ9vs?si=X-9zaftr5RlDbSdg",
    "https://www.youtube.com/embed/BXTyVqhgx7g?si=SrKRvCQxodnJTbhf",
    "https://www.youtube.com/embed/QDEEF3SEISI?si=6KEthpl3TP8qwaDA",
    "https://www.youtube.com/embed/5yUspRCx-kI?si=Y-XVNg1AVlNRsbyk",
  ]);

  const handleSwap = (index) => {
    const newMainVideo = otherVideos[index];
    const newOtherVideos = [...otherVideos];
    newOtherVideos[index] = mainVideo;
    setMainVideo(newMainVideo);
    setOtherVideos(newOtherVideos);
  };

  // Intersection observers
  const { ref: refMainVideo, inView: inViewMainVideo } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refOtherVideos, inView: inViewOtherVideos } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animations
  const slideUp = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: inViewMainVideo ? 0 : 100, opacity: inViewMainVideo ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideLeft = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewOtherVideos ? 0 : -100, opacity: inViewOtherVideos ? 1 : 0 },
    config: { duration: 500 },
  });
  // const slideRight = useSpring({
  //   from: { x: 100, opacity: 0 },
  //   to: { x: inViewOtherVideos ? 0 : 100, opacity: inViewOtherVideos ? 1 : 0 },
  //   config: { duration: 500 },
  // });

  return (
    <div className="w-full mt-10 min-h-[70vh] relative">
      

      <div className="px-4 md:px-10 lg:px-12">
        <animated.div style={slideUp}>
          <p className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold text-[#054BB4]">
            Ex
            <span className="border-b-4 border-[#054BB4]">
              plore Feature Vide
            </span>
            os
          </p>
        </animated.div>
        <div className="flex items-center flex-col-reverse justify-between lg:flex-row gap-10 lg:gap-0">
          <animated.div
            style={slideLeft}
            className="lg:w-2/4 flex flex-col gap-4 items-start w-full mt-[150px] lg:mt-[0px]"
          >
            <p className="text-[#054BB4] font-bold lg:text-3xl text-2xl">
              Watch Our Videos
            </p>
            <p>
              Zenstudy excels in providing quality education through its Youtube
              channel, featuring well-crafted videos with excellent graphics.
              Our engaging content includes a specialized and dedicated UPSC
              playlist, which stands out for its educational value, content
              delivery, and is streamlined as per the examination demand. Our
              team is trying every day to make education imaginative ensuring
              the students receive an enriching and dynamic educational
              experience.
            </p>
            <Link
              to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu"
              target="blank"
            >
            <button className="custom-btn-2">
            <span className="custom-btn-2-bg"></span>
            <span className="custom-btn-2-text">Watch Now</span>
          </button>
            </Link>
          </animated.div>
          <animated.div
            style={slideUp}
            className="lg:w-2/4 flex flex-col gap-4 w-full p-0 lg:p-10 md:p-10"
          >
            <animated.div
              ref={refMainVideo}
              className="w-full h-[30vh] lg:h-[50vh]"
            >
              <iframe
                src={mainVideo}
                title="Main Video"
                frameBorder="0"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </animated.div>
            <animated.div
              ref={refOtherVideos}
              className="flex justify-between items-center w-full h-[20vh] lg:flex-row flex-wrap gap-1"
            >
              {otherVideos.map((video, index) => (
                <div key={index} className="relative lg:w-[23%] h-full w-[48%]">
                  <iframe
                    src={video}
                    title={`Video ${index}`}
                    className="w-full h-full"
                    allowFullScreen
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
export default FeatureVideo;
