import React, { useState } from "react";


const FeatureVideo = () => {
  const [mainVideo, setMainVideo] = useState(
    "https://www.youtube.com/embed/GEmeo2uMAnA?si=Oqai2O3hcVVgipYR"
  );
  const [otherVideos, setOtherVideos] = useState([
    "https://www.youtube.com/embed/ThstiF2Q5VU?si=dVdvaFHfGwkmSo5S",
    "https://www.youtube.com/embed/Z6Jx_vvbSag?si=2vswzWpq674VMeD6",
    "https://www.youtube.com/embed/tsJXyeKFlto?si=qOLj7aDck_zSApjm",
    "https://www.youtube.com/embed/1vf6AyPuzGE?si=nDvsbK1dCRz8VPrX",
  ]);


  const handleSwap = (index) => {
    const newMainVideo = otherVideos[index];
    const newOtherVideos = [...otherVideos];
    newOtherVideos[index] = mainVideo;
    setMainVideo(newMainVideo);
    setOtherVideos(newOtherVideos);
  };


  return (
    <>
      <div className="w-full min-h-[70vh]">
        <div className="px-12">
          <div>
            <p className="lg:text-4xl md:text-3xl text-2xl font-bold mb-5 text-center">
              Explore Feature Video
            </p>
          </div>
          <div className="flex items-center justify-between flex-col lg:flex-row gap-5 lg:gap-0">
            <div className="lg:w-2/4 flex flex-col gap-4 items-start w-full">
              <p className="text-[#054BB4] font-bold lg:text-3xl text-2xl">
                Watch Our Videos
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                voluptates dolore quisquam possimus dolores, ipsam cupiditate
                animi qui saepe repellendus quos eligendi porro, magni odit
                accusamus quo necessitatibus quaerat delectus!
              </p>
              <button className="px-6 py-2 bg-[#054BB4] text-white rounded-full">
                Watch Now
              </button>
            </div>
            <div className="lg:w-2/4 flex flex-col gap-4 w-full">
              <div className="w-full h-[50vh]">
                <iframe
                  src={mainVideo}
                  title="video2"
                  frameBorder="0"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex justify-between items-center w-full h-[20vh]  lg:flex-row flex-wrap gap-1">
                {otherVideos.map((video, index) => (
                  <div
                    key={index}
                    className="relative lg:w-[23%] h-full w-[48%]"
                  >
                    <iframe
                      src={video}
                      title="video1"
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                    <div
                      className="absolute inset-0 z-10 cursor-pointer"
                      onClick={() => handleSwap(index)}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default FeatureVideo;