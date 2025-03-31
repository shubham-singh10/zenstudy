import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";




const ExploreArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();




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




  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/post/getposts`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setArticles(data.posts.slice(0, 4)); // Get the first 4 articles
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };




    fetchArticles();
  }, []);




  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="text-4xl font-bold animate-pulse">Zenstudy</div>
      </div>
    );
  }




  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold text-red-600">
          Error: {error.message}. Please refresh the page.
        </div>
      </div>
    );
  }




  return (
    <div className="w-full min-h-screen md:mb-10 lg:mb-20 relative">

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
              {articles[0] && (
                <div className="relative w-[98%] h-[58%] bg-gray-500 rounded-tl-2xl">
                  <img
                    className="w-full h-full object-cover rounded-tl-2xl"
                    src={articles[0].image}
                    alt={articles[0].title}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                    <p className="lg:text-xl md:text-lg text-sm font-semibold text-center">
                      {articles[0].title}
                    </p>
                    <button
                      className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full"
                      onClick={() =>
                        navigate("/article-details", {
                          state: { postId: articles[0]._id },
                        })
                      }
                    >
                      Visit <FaExternalLinkAlt className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
              {articles[1] && (
                <div className="relative w-[98%] h-[38%] bg-gray-500 rounded-bl-2xl">
                  <img
                    className="w-full h-full object-cover rounded-bl-2xl"
                    src={articles[1].image}
                    alt={articles[1].title}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                    <p className="lg:text-xl md:text-lg text-sm font-semibold text-center">
                      {articles[1].title}
                    </p>
                    <button
                      className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full"
                      onClick={() =>
                        navigate("/article-details", {
                          state: { postId: articles[1]._id },
                        })
                      }
                    >
                      Visit <FaExternalLinkAlt className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-2/4 h-full flex flex-col justify-between items-end">
              {articles[2] && (
                <div className="relative w-[98%] h-[38%] bg-gray-500 rounded-tr-2xl rounded-br-2xl">
                  <img
                    className="w-full h-full object-cover rounded-tr-2xl"
                    src={articles[2].image}
                    alt={articles[2].title}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                    <p className="lg:text-xl md:text-lg text-sm font-semibold text-center">
                      {articles[2].title}
                    </p>
                    <button
                      className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full"
                      onClick={() =>
                        navigate("/article-details", {
                          state: { postId: articles[2]._id },
                        })
                      }
                    >
                      Visit <FaExternalLinkAlt className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
              {articles[3] && (
                <div className="relative w-[98%] h-[58%] bg-gray-500 rounded-br-2xl">
                  <img
                    className="w-full h-full object-cover rounded-br-2xl"
                    src={articles[3].image}
                    alt={articles[3].title}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300 ease-in-out flex flex-col justify-center items-center text-white z-10">
                    <p className="lg:text-xl md:text-lg text-sm font-semibold text-center">
                      {articles[3].title}
                    </p>
                    <button
                      className="flex px-4 py-1 bg-[#054BB4] gap-1 items-center justify-center rounded-full"
                      onClick={() =>
                        navigate("/article-details", {
                          state: { postId: articles[3]._id },
                        })
                      }
                    >
                      Visit <FaExternalLinkAlt className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
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
              UPSC preparation requires depth of understanding of issues.
              We at Zenstudy are creating content that would have in depth analysis and relationships between various issues.</p>




            <p className="lg:w-[90%] w-full">The Aim is to Go beyond traditional limitations of information accumulation that UPSC does not recommend. We carefully choose topics and issues that have broad range and deeper international among various socio economic goals of our great nation.
              By reading our articles we will gain vast superior intellect that would ease your preparation due to the natural flow of topics reducing the burden of remembering information.
            </p>
            <Link to="/article" className="px-8 py-2 bg-[#054BB4] text-white rounded-full">
              Visit All
            </Link>
          </animated.div>
        </div>
      </div>
    </div>
  );
};




export default ExploreArticles;