import React, { Fragment, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const WatchCourse = () => {
  const [selectedTab, setSelectedTab] = useState("About Video");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [url, setUrl] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [selectedVideoDesc, setSelectedVideoDesc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const tabs = ["About Video"
    // , "Q&A", "Reviews"
  ];
  const [meetingId, setmeetingId] = useState(null)
  const [meetloading, setMeetLoading] = useState(false);
  const token = Cookies.get("access_tokennew");

  useEffect(() => {
    const myCourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/payment/watchCourse`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),  // id from useParams
          }
        );

        if (response.status === 204) {
          // Redirect if no courses found
          navigate("/mycourse");
          return;
        }

        if (!response.ok) {
          // Handle network errors or invalid response
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // console.log("MyCourse_purchase", data.response);

        setCourses(data.response?.modules);
        setmeetingId(data.response.course.meetingId);
        setLoading(false);

      } catch (error) {
        console.error("Error:", error);
        // Redirect to mycourse on error
        navigate("/mycourse");
      }
    };

    myCourse();
  }, [id, navigate]);

  //************************************ Meeting Function Start ***************************************************************//


  const onSubmit2 = async (id) => {
    setMeetLoading(true);
    // window.location.replace(`http://localhost:3001?key=${id}&user=${token}`)
    // window.location.replace(`https://live.zenstudy.in/?key=${id}&user=${token}`)
    window.location.replace(`https://live-zenstudy.vercel.app/?key=${id}&user=${token}`)
  };


  //************************************ Meeting Function End   ***************************************************************//

  useEffect(() => {
    if (courses.length > 0) {
      const introductionModule = courses.find(
        (module) => module.moduleTitle.toLowerCase() === "introduction"
      );
      const firstModule = introductionModule || courses[0];
      const firstVideo = firstModule.videos[0];
      if (firstVideo) {
        setUrl(firstVideo.videoUrl);
        setSelectedVideoTitle(firstVideo.videoTitle);
        setSelectedVideoDesc(firstVideo?.videoDescription);
      }
    }
  }, [courses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
      </div>
    );
  }

  const handleVideoClick = (videoUrl, videoTitle, videoDesc) => {
    setUrl(videoUrl);
    setSelectedVideoTitle(videoTitle);
    setSelectedVideoDesc(videoDesc);
  };

  return (
    <div className="container mx-auto p-4">
      <button
        className="px-6 py-2 bg-blue-600 rounded-full mb-4 text-white flex justify-center items-center gap-2"
        onClick={() => navigate("/mycourse")}
      >
        <IoIosArrowBack /> Back
      </button>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Video Section */}
        <div className="lg:w-2/3">
          <div>
            <iframe
              src={`${url}`}
              frameBorder="0"
              className="top-0 left-0 h-[70vh] w-[100%]"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title="zenstudy"
            ></iframe>
          </div>
          <div className="mt-4">
            <div className="flex space-x-8 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`text-lg p-2 ${selectedTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                    }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {selectedTab === "About Video" && (
                <div>
                  <p className="text-gray-700">{selectedVideoDesc}</p>
                </div>
              )}
              {selectedTab === "Q&A" && <div>Q&A Content</div>}
              {selectedTab === "Reviews" && <div>Reviews Content</div>}
            </div>
          </div>
        </div>
        {/* Course Content Section */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <h2 className="text-2xl font-bold mb-4">Course Content</h2>
          {courses.length > 0 &&
            courses.map((module, index) => (
              <details
                key={index}
                className="mb-4 bg-white shadow rounded-lg"
                open={
                  module.moduleTitle.toLowerCase() === "introduction" ||
                  (index === 0 &&
                    !courses.some(
                      (m) => m.moduleTitle.toLowerCase() === "introduction"
                    ))
                }
              >
                <summary className="w-full text-left bg-blue-600 text-white font-bold p-4 cursor-pointer rounded-t-lg">
                  {module.moduleTitle}
                </summary>
                <div className="border-t border-gray-200 rounded-b-lg overflow-hidden">
                  {module.videos.map((video, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 border-t ${selectedVideoTitle === video.videoTitle
                        ? "text-blue-500"
                        : ""
                        }`}
                      onClick={() =>
                        handleVideoClick(
                          video.videoUrl,
                          video.videoTitle,
                          video?.videoDescription
                        )
                      }
                    >
                      <span className="hover:cursor-pointer">
                        {video.videoTitle}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
        </div>
      </div>

      {/* Meeting join button */}
      {meetingId && (
        <button
          onClick={() => onSubmit2(meetingId)}
          disabled={meetloading}
          className={`flex justify-end ${meetloading
            ? "bg-red-500 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700 animate-glow"
            } text-white z-50 rounded-full fixed bottom-0 right-10 mb-6 text-xl py-2 px-8`}
        >
          {meetloading ? (
            <Fragment>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                ></path>
              </svg>
              Please wait...
            </Fragment>
          ) : (
            "Join Live"
          )}
        </button>
      )}


      <div id="zmmtg-root">
        {/* Zoom Meeting SDK Component View Rendered Here */}
      </div>
      {/* Meeting join button */}
    </div>
  );
};

export default WatchCourse;
