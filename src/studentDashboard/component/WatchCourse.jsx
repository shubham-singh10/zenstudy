import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ZoomMtg } from "@zoom/meetingsdk";
import "./main.css";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const WatchCourse = () => {
  const [selectedTab, setSelectedTab] = useState("About Video");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [url, setUrl] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [selectedVideoDesc, setSelectedVideoDesc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const tabs = ["About Video"];

  const [formData, setFormData] = useState({
    meetingNumber: "",
  });
  const [meetloading, setMeetLoading] = useState(false);

  console.log("meet", formData);
  
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
            body: JSON.stringify({ id }),
          }
        );
        if (response.status === 204) {
          setCourses([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("MyCourse_purchase", data.response);
        setCourses(data.response?.modules);
        setLoading(false);
        setFormData({...formData, meetingNumber:data.response.course.meetingId.meetingNumber})
      } catch (error) {
        //console.log("Error:", error);
        setLoading(false);
        navigate("/mycourse");
      }
    };

    myCourse();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMeetLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API2}zenstudy/api/meeting/join`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meetingNumber: formData.meetingNumber }),
        }
      );

      if (response.status === 204) {
        console.log("No meeting found for this meeting number.");
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status code: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.meetingData) {
        let jdata = data.meetingData;

        // Add participant to the meeting
        const participantResponse = await fetch(
          `${process.env.REACT_APP_API2}zenstudy/api/meeting/addParticipant`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              meetingId: jdata._id,
              participantsuser: formData.userId,
            }),
          }
        );

        if (!participantResponse.ok) {
          throw new Error(
            `Failed to add participant. Status code: ${participantResponse.status}`
          );
        }
        const participant = await participantResponse.json();
        console.log("Participant", participant.participantName);
        startMeeting(
          jdata.signature,
          jdata.meetingNumber,
          jdata.password,
          participant.participantName
        );
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
    } finally {
      setMeetLoading(false);
    }
  };

  var userEmail = "";
  var registrantToken = "";
  var zakToken = "";
  const startMeeting = (signature, meetingNumber, password, username) => {
    document.getElementById("zmmtg-root").style.display = "block";

    console.log("Starting meeting with details:", {
      signature,
      meetingNumber,
      password,
      userName: username,
    });

    ZoomMtg.init({
      leaveUrl: "https://zenstudy-delta.vercel.app/",
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY,
          meetingNumber: meetingNumber,
          passWord: password,
          userName: username,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

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
                  className={`text-lg p-2 ${
                    selectedTab === tab
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
                      className={`flex items-center p-2 border-t ${
                        selectedVideoTitle === video.videoTitle
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
      

      <Link
        to="https://wa.me/919810246095"
        target="blank"
        className="flex justify-end bg-blue-600  hover:bg-blue-700  text-white z-50 rounded-full fixed bottom-0 right-10 mb-6 text-xl animate-bounce ..."
      >
        <button className="py-2 px-8">Join Live</button>
      </Link>

      <div id="zmmtg-root">
        {/* Zoom Meeting SDK Component View Rendered Here */}
      </div>
      
    </div>
  );
};

export default WatchCourse;
