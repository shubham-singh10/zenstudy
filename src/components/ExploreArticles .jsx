import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const ExploreArticles = () => {
  // Use react-intersection-observer to detect when elements are in view
  const { ref: refSlideUp, inView: inViewSlideUp } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refSlideLeft, inView: inViewSlideLeft } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refSlideRight, inView: inViewSlideRight } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const SlideUp = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: inViewSlideUp ? 0 : 100, opacity: inViewSlideUp ? 1 : 0 },
    config: { duration: 500 },
  });

  const SlideLeft = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewSlideLeft ? 0 : -100, opacity: inViewSlideLeft ? 1 : 0 },
    config: { duration: 500 },
  });

  const SlideRight = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewSlideRight ? 0 : 100, opacity: inViewSlideRight ? 1 : 0 },
    config: { duration: 500 },
  });

  const images = [
    {
      src: "https://images.pexels.com/photos/25473496/pexels-photo-25473496/free-photo-of-a-dark-stairway-with-a-light-shining-on-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Image 1",
      title: "Article Title 1",
    },
    {
      src: "https://images.pexels.com/photos/27009726/pexels-photo-27009726/free-photo-of-two-people-sitting-at-a-table-on-a-boat.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Image 2",
      title: "Article Title 2",
    },
    {
      src: "https://images.pexels.com/photos/26341034/pexels-photo-26341034/free-photo-of-a-view-of-a-canyon-with-a-river-running-through-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Image 3",
      title: "Article Title 3",
    },
    {
      src: "https://images.pexels.com/photos/26629241/pexels-photo-26629241/free-photo-of-a-black-and-white-photo-of-a-store-front.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Image 4",
      title: "Article Title 4",
    },
  ];




  return (
    <div className="w-full min-h-screen md:mb-10 lg:mb-20 relative">
      <div className="absolute -z-50 lg:top-[-70px] lg:right-[0px] top-[-10px] right-[0px] lg:w-[300px] lg:h-[300px] w-[200px] h-[200px] bg-gray-100 text-white flex items-center justify-end px-4 rounded-full"></div>




      <div className="lg:px-12 md:p-4 p-4">
        <animated.div ref={refSlideUp} style={SlideUp}>
          <p className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold text-[#054BB4]">
            Ex
            <span className="border-b-4 border-[#054BB4]">
              plore Recent Articl
            </span>
            es
          </p>
        </animated.div>




        <div className="flex lg:flex-row flex-col">
          <animated.div
            ref={refSlideUp}
            style={SlideUp}
            className="lg:w-[60vw] h-[70vh] flex w-full"
          >
            <div className="w-2/4 h-full flex flex-col justify-between">
              <div className="relative w-[98%] h-[58%] bg-gray-500 rounded-tl-2xl">
                <img
                  className="w-full h-full object-cover rounded-tl-2xl"
                  src={images[0].src}
                  alt={images[0].alt}
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                  <p className="lg:text-xl md:text-lg text-sm font-semibold">
                    {images[0].title}
                  </p>
                  <button className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full">
                    Visit <FaExternalLinkAlt className="ml-2" />
                  </button>
                </div>
              </div>
              <div className="relative w-[98%] h-[38%] bg-gray-500 rounded-bl-2xl">
                <img
                  className="w-full h-full object-cover rounded-bl-2xl"
                  src={images[1].src}
                  alt={images[1].alt}
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                  <p className="lg:text-xl md:text-lg text-sm font-semibold">
                    {images[1].title}
                  </p>
                  <button className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full">
                    Visit <FaExternalLinkAlt className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-2/4 h-full flex flex-col justify-between items-end">
              <div className="relative w-[98%] h-[38%] bg-gray-500 rounded-tr-2xl rounded-br-2xl">
                <img
                  className="w-full h-full object-cover rounded-tr-2xl"
                  src={images[2].src}
                  alt={images[2].alt}
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                  <p className="lg:text-xl md:text-lg text-sm font-semibold">
                    {images[2].title}
                  </p>
                  <button className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full">
                    Visit <FaExternalLinkAlt className="ml-2" />
                  </button>
                </div>
              </div>
              <div className="relative w-[98%] h-[58%] bg-gray-500 rounded-br-2xl">
                <img
                  className="w-full h-full object-cover rounded-br-2xl"
                  src={images[3].src}
                  alt={images[3].alt}
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                  <p className="lg:text-xl md:text-lg text-sm font-semibold">
                    {images[3].title}
                  </p>
                  <button className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full">
                    Visit <FaExternalLinkAlt className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </animated.div>
          <animated.div
            ref={refSlideLeft}
            style={SlideLeft}
            className="lg:w-[35vw] mt-10 md:mt-10 lg:mt-0 flex flex-col lg:items-end justify-center gap-5 w-full items-start"
          >
            <p className="lg:text-3xl text-2xl font-bold text-[#054BB4]">
              Explore Articles
            </p>
            <p className="lg:w-[90%] w-full">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Provident nobis architecto odit doloremque placeat. Praesentium
              eius vel deleniti libero doloribus laborum aperiam ut, eaque
              quidem quam. Voluptatum obcaecati minima debitis!
            </p>
            <button className="px-8 py-2 bg-[#054BB4] text-white rounded-full">
              Visit All
            </button>
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default ExploreArticles;