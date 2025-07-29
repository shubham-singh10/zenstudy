import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiPlay,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../../context/auth-context";
import WatchCourseSkeleton from "./WatchCourseSkeleton";
import { DashVideoPlayer } from "../DashVideoPlayer";

const WatchCourseFree = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [expandedModules, setExpandedModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [videoOtp, setVideoOtp] = useState("");
  const [videoPlayback, setVideoPlayback] = useState("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const [selectedVideoDesc, setSelectedVideoDesc] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, content: "" });
  const [sLoading, setsLoading] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseName, setcourseName] = useState("");

  // Fetching user reviews using useCallback to prevent unnecessary re-renders
  const fetchReviews = useCallback(
    async (courseId) => {
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
          setHasSubmittedReview(true);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    [user?._id]
  );

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/course/coursedetail/${id}`
        );
        setCourses(response.data.coursedetail?.modules || []);
        console.log("Fetched courses:", response.data.coursedetail?.modules);
        setcourseName(response.data.coursedetail?.title || "");
        if (response.data.coursedetail._id) {
          fetchReviews(response.data.coursedetail._id);
          // Simulating fetching materials
          setMaterials([
            { id: 1, name: "Course Syllabus", type: "pdf" },
            { id: 2, name: "Supplementary Reading", type: "pdf" },
            { id: 3, name: "Practice Exercises", type: "docx" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        navigate("/mycourse");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate, fetchReviews]);

  useEffect(() => {
    if (courses.length > 0) {
      const introModule =
        courses.find(
          (module) => module.moduleTitle.toLowerCase() === "introduction"
        ) || courses[0];
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
      }
    }
  }, [courses]);

  const handleVideoClick = (video) => {
    setVideoOtp(video.videoCode);
    setVideoPlayback(video.playBackInfo);
    setSelectedVideoTitle(video.videoTitle);
    setSelectedVideoDesc(video.videoDescription || "");
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
    setsLoading(true);
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
    } finally {
      setsLoading(false);
      fetchReviews(id);
    }
  };

  if (loading) return <WatchCourseSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/free-resources")}
          className="mb-6 px-4 py-2 bgGredient-purple text-white rounded-full hover:scale-105 transition-colors flex items-center space-x-2 shadow-md"
        >
          <FiArrowLeft size={20} />
          <span>Back to Courses</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              
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
                {["about", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium transition-colors flex-grow sm:flex-grow-0 ${
                      activeTab === tab
                        ? "bgGredient-purple text-white rounded-2xl"
                        : "text-gray-600 hover:bg-purple-100 rounded-lg"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "about" && (
                  <p className="text-gray-600 leading-relaxed">
                    {selectedVideoDesc}
                  </p>
                )}
                {activeTab === "notes" && (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Take notes here..."
                      className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-[#543a5d] focus:border-transparent"
                    />
                  </div>
                )}
                {activeTab === "materials" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Course Materials</h3>
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg"
                      >
                        <FiFileText className="textPurple" />
                        <span>{material.name}</span>
                        <span className="text-xs textPurple uppercase">
                          {material.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "qa" && (
                  <p className="textPurple italic">Q&A feature coming soon!</p>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
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
                                !hasSubmittedReview &&
                                setUserReview((prev) => ({
                                  ...prev,
                                  rating: star,
                                }))
                              }
                              className={`focus:outline-none ${
                                hasSubmittedReview ? "cursor-not-allowed" : ""
                              }`}
                              disabled={hasSubmittedReview}
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
                            !hasSubmittedReview &&
                            setUserReview((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#543a5d] focus:border-transparent"
                          rows={3}
                          disabled={hasSubmittedReview}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bgGredient-purple text-white rounded-lg hover:scale-105 transition-colors shadow-md"
                        disabled={hasSubmittedReview || sLoading}
                      >
                        {sLoading ? "Please wait..." : "Submit Review"}
                      </button>
                    </form>

                    <hr className="my-4" />
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
                              <div className="font-medium text-gray-800">
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
                          <p className="text-gray-700 mt-2">
                            {review.reviewContent}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
              <div className="bgGradient-purple-light px-6 py-4 flex items-center justify-between rounded-t-lg shadow-sm">
                <h2 className="text-lg font-semibold textPurple flex items-center gap-2">
                  📘 Course Content
                </h2>
                <span className="text-sm italic textPurple">
                  ({courseName})
                </span>
              </div>

              <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {courses.map((module, index) => (
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
                            ? " textLight"
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
                              ? "textLight"
                              : "text-gray-500"
                          }`}
                        />
                      ) : (
                        <FiChevronRight
                          size={20}
                          className={`${
                            selectedModule === module.moduleTitle
                              ? "textLight"
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
                                  : "hover:bg-purple-100 bg-purple-50 text-gray-700"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchCourseFree;
