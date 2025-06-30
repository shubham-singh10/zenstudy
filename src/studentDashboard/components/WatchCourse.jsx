import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiFileText,
  FiImage,
  FiPlay,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../context/auth-context";
import { DashVideoPlayer } from "./DashVideoPlayer";
import { FaFilePdf } from "react-icons/fa";

const WatchCourse = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [expandedModules, setExpandedModules] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [videoOtp, setVideoOtp] = useState("");
  const [videoPlayback, setVideoPlayback] = useState("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const [selectedVideoDesc, setSelectedVideoDesc] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, content: "" });
  const [notes, setNotes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filterNotes, setFilterNotes] = useState([])
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState({
    course: false,
    reviews: false,
  });

  const fetchReviews = useCallback(
    async (courseId) => {
      setLoading((prev) => ({ ...prev, reviews: true }));
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/course/${courseId}/getReviews`
        );
        const reviews = response.data.reviews.map((review) => ({
          ...review,
          imageUrl: review.userId.avatar.startsWith("http")
            ? review.userId.avatar
            : `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${review.userId.avatar}`,
        }));
        setReviews(reviews);
        const userReview = response.data.reviews.find(
          (review) => review.userId._id === user?._id
        );
        if (userReview) {
          setUserReview({
            rating: userReview.rating,
            content: userReview.reviewContent,
          });
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading((prev) => ({ ...prev, reviews: false }));
      }
    },
    [user?._id]
  );

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading((prev) => ({ ...prev, course: true }));
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}zenstudy/api/payment/watchCourse`,
          { id }
        );
        setCoursesData(response.data.response?.modules || []);       
        setNotes(response.data.response?.notes || []);
        // console.log('Course data:', response.data.response );
        setMaterials(response.data.response?.course?.materials || []);
        console.log('Materials:', response.data.response?.course?.materials);
        if (response.data.response?.course._id) {
          await fetchReviews(response.data.response.course._id);
          
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        // navigate("/mycourse");
      } finally {
        setLoading((prev) => ({ ...prev, course: false }));
      }
    };

    fetchCourseData();
  }, [id, navigate, fetchReviews]);

  useEffect(() => {
    if (coursesData.length > 0) {
      const introModule =
        coursesData.find(
          (module) => module.moduleTitle.toLowerCase() === "introduction"
        ) || coursesData[0];
      // Filter videos with status "ready"
      const readyVideos = introModule.videos.filter(
        (video) => video.status === "ready"
      );
      if (readyVideos.length > 0) {
        const firstVideo = readyVideos[0];
        setVideoOtp(firstVideo.videoCode);
        setVideoPlayback(firstVideo.playBackInfo);
        setSelectedVideoTitle(firstVideo.videoTitle);
        setSelectedVideoDesc(firstVideo.videoDescription || "");
         setFilterNotes(()=> {
      const filteredNotes = notes.filter((note) => note.videoId === firstVideo._id);
      return filteredNotes;
    })
      }
    }
  }, [coursesData, notes]);

  const handleVideoClick = (video) => {
    setVideoOtp(video.videoCode);
    setVideoPlayback(video.playBackInfo);
    setSelectedVideoTitle(video.videoTitle);
    setSelectedVideoDesc(video.videoDescription || "");
    setFilterNotes(()=> {
      const filteredNotes = notes.filter((note) => note.videoId === video._id);
      return filteredNotes;
    })
  };




  const toggleModule = (moduleId, moduleTitle) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
    setSelectedModule(moduleTitle); // Set the module title here
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/course/${id}/reviews`,
        {
          userId: user?._id,
          reviewContent: userReview.content,
          rating: userReview.rating,
        }
      );
      fetchReviews(id);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/mycourse")}
          className="mb-6 px-4 py-2 bgGredient-purple-lr text-white rounded-full hover:scale-105 transition-colors flex items-center space-x-2 shadow-md"
        >
          <FiArrowLeft size={20} />
          <span>Back to My Courses</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              {
                // <iframe
                //   title={selectedVideoTitle}
                //   src={`https://player.vdocipher.com/v2/?otp=${videoOtp}&playbackInfo=${videoPlayback}`}
                //   className="w-full h-full"
                //   allowFullScreen
                //   allow="encrypted-media"
                // ></iframe>
              }

              <DashVideoPlayer
                videopath={videoOtp}
                thumbnailUrl={videoPlayback}
              />
            </div>

            <h1 className="lg:text-xl text-lg font-bold textPurple">
              {selectedVideoTitle}
            </h1>

            {/* Tabs */}
            <div className="bg-purple-50 rounded-xl shadow-md overflow-hidden">
              <div className="flex flex-wrap border-b">
                

                {["about", "reviews", "notes", "materials", "qa"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium transition-colors flex-grow sm:flex-grow-0 ${
                      activeTab === tab
                        ? "bgGredient-purple text-white rounded-2xl"
                        : "textPurple hover:bg-purple-100 rounded-lg"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {loading.reviews ? (
                <div className="p-6 text-center">
                  <p className="textPurple">Loading...</p>
                </div>
              ) : (
                <div className="p-6">
                  {activeTab === "about" && (
                    <p className="textPurple leading-relaxed">
                      {selectedVideoDesc}
                    </p>
                  )}
                  {activeTab === "notes" && (
                    filterNotes.length > 0 ?(
                      filterNotes.map((notes, index)=>(
                      <div key={index} className="border-2 border-dashed mb-2 border-[#543a5d] rounded-lg p-4 flex  flex-wrap gap-2 items-center lg:justify-between md:justify-between justify-center">                      
                      <div className="flex items-center space-x-3">
                        <FiFileText className="textPurple h-8 w-8" />
                      <div>
                        <h3 className="font-semibold text-sm">{notes.title}</h3>
                        <p className="textPurple text-sm">Added on {new Date(notes.createdAt).toLocaleDateString()}</p>
                      </div>
                      </div>
                      <div className="lg:w-auto md:w-auto w-full flex justify-center">
                        <button onClick={()=> window.open(notes.fileUrl)} className=" flex gap-2 justify-center items-center px-4 py-2 bgGredient-purple-lr hover:scale-105 rounded-lg text-sm lg:w-auto md:w-auto w-full text-white">View <span><FiEye className="text-white"/></span></button>
                      </div>
                    </div>) ) ): (
                      <p className="textPurple italic">
                        No notes available for this video.
                      </p>                      
                    )
                  )                 
                  }
                  {activeTab === "materials" && (
                     materials.length > 0 ?(
                      materials.map((material, index)=>(
                      <div key={index} className="border-2 border-dashed mb-2 border-[#543a5d] rounded-lg p-4 flex  flex-wrap gap-2 items-center lg:justify-between md:justify-between justify-center">                      
                      <div className="flex items-center space-x-3">
                        {material.type === 'image' ? (
                          <FiImage className="text-purple-500 h-8 w-8" />
                        ) : material.type === 'pdf' ? (
                          <FaFilePdf className="text-green-500 h-8 w-8" />
                        ) : (
                          <FiFileText className="text-blue-500 h-8 w-8" />
                        )}
                        
                      <div>
                        <h3 className="font-semibold text-sm">{material.title}</h3>
                        <p className="textPurple text-sm">Added on </p>
                      </div>
                      </div>
                      <div className="lg:w-auto md:w-auto w-full flex justify-center">
                        <button onClick={()=> window.open(material.file)}  className="flex justify-center items-center gap-2 px-4 py-2 bgGredient-purple-lr hover:scale-105 rounded-lg text-sm lg:w-auto md:w-auto w-full text-white">{material.type === 'document' ? "Downlaod" :"View"} <span>{material.type === 'document' ? <FiDownload className="text-white"/> : <FiEye className="text-white"/> }</span></button>
                      </div>
                    </div>) ) ): (
                      <p className="textPurple italic">
                        No Material available for this Course.
                      </p>                      
                    )
                  )}
                  {activeTab === "qa" && (
                    <p className="textPurple italic">
                      Q&A feature coming soon!
                    </p>
                  )}
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {userReview !== 0 && (
                        <form onSubmit={submitReview} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium textPurple mb-1">
                              Your Rating
                            </label>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setUserReview((prev) => ({
                                      ...prev,
                                      rating: star,
                                    }))
                                  }
                                  className="focus:outline-none"
                                >
                                  <FiStar
                                    className={`w-8 h-8 ${
                                      star <= userReview.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="review"
                              className="block text-sm font-medium textPurple mb-1"
                            >
                              Your Review
                            </label>
                            <textarea
                              id="review"
                              value={userReview.content}
                              onChange={(e) =>
                                setUserReview((prev) => ({
                                  ...prev,
                                  content: e.target.value,
                                }))
                              }
                              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#543a5d] focus:border-transparent"
                              rows={3}
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full px-4 py-2 bgGredient-purple text-white rounded-lg hover:scale-105 transition-colors shadow-md"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review._id}
                            className="bg-gray-50 rounded-lg p-4 shadow"
                          >
                            <div className="flex items-center mb-2">
                              <img
                                src={review.imageUrl}
                                crossOrigin="anonymous"
                                alt={`${review.userId.name} avatar`}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                              />
                              <div>
                                <div className="font-medium textPurple">
                                  {review.userId.name}
                                </div>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="textPurple mt-2">
                              {review.reviewContent}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
              <h2 className="text-xl font-bold p-4 bgGradient-purple-light textPurple border-b">
                Course Content
              </h2>
              {loading.course ? (
                <div className="p-6 text-center">
                  <p className="textPurple">Loading...</p>
                </div>
              ) : (
                <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                  {coursesData.map((module, index) => (
                    <div key={index} className="mb-4">
                      <button
                        onClick={() =>
                          toggleModule(module._id, module.moduleTitle)
                        }
                        className={`${
                          selectedModule === module.moduleTitle
                            ? "bgGredient-purple text-white"
                            : "bgGradient-purple-light textPurple hover:bg-purple-100"
                        } w-full px-4 py-3 flex items-center border-2 justify-between text-left rounded-lg `}
                      >
                        <span
                          className={`font-medium  ${
                            selectedModule === module.moduleTitle
                              ? " text-white"
                              : "textPurple"
                          }`}
                        >
                          {module.moduleTitle}
                        </span>
                        {expandedModules.includes(module._id) ? (
                          <FiChevronDown
                            size={20}
                            className={`${
                              selectedModule === module.moduleTitle
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        ) : (
                          <FiChevronRight
                            size={20}
                            className={`${
                              selectedModule === module.moduleTitle
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        )}
                      </button>
                      {expandedModules.includes(module._id) && (
                        <div className="mt-2 space-y-2">
                          {module.videos
                            .filter((video) => video.status === "ready")
                            .map((video, vIndex) => (
                              <button
                                key={vIndex}
                                onClick={() => handleVideoClick(video)}
                                className={`w-full px-4 py-2 flex items-center border-2 justify-between text-left rounded-lg transition-colors ${
                                  selectedVideoTitle === video.videoTitle
                                    ? "bg-purple-100 textPurple"
                                    : "hover:bg-purple-100 bg-purple-50 textPurple"
                                }`}
                              >
                                <div className="flex items-center">
                                  <FiPlay
                                    size={16}
                                    className={`mr-2 ${
                                      selectedVideoTitle === video.videoTitle
                                        ? "textPurple"
                                        : "text-gray-400 "
                                    }`}
                                  />
                                  <span className="text-sm">
                                    {video.videoTitle}
                                  </span>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;
