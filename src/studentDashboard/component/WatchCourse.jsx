import React, { Fragment, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

const WatchCourse = () => {
  const [selectedTab, setSelectedTab] = useState("About Video");
  const [loadingState, setLoadingState] = useState({
    pageLoading: true,
    buttonLoading: false,
  });
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [videoOtp, setvideoOtp] = useState(null);
  const [videoPlayback, setVideoPlayback] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [selectedVideoDesc, setSelectedVideoDesc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const TABS = {
    ABOUT: "About Video",
    QA: "Q&A",
    REVIEWS: "Reviews",
  };
  const tabs = [TABS.ABOUT, TABS.QA, TABS.REVIEWS];
  const token = Cookies.get("access_tokennew");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewForm, setReviewForm] = useState(undefined);
  const [AllReview, setAllReview] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  let userId = null;

  if (token) {
    try {
      userId = token;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const getUserData = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/user/userdetail/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }
      const resData = await response.json();
      console.log("user data", resData.userdetail);
      setUserData(resData.userdetail);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Fetch User Data",
        text: "We encountered an issue while retrieving your information. Please try again later or contact support if the issue persists.",
        footer: `<a href="/contact">Need Help?</a>`,
        confirmButtonText: "Okay",
        confirmButtonColor: "#d33",
      });
    }
  };

  //Call getUser Data
  useEffect(() => {
    if (userId) {
      getUserData(userId);
    }
  }, [userId]);

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
            body: JSON.stringify({ id }), // id from useParams
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
        console.log("MyCourse_purchase", data.response);

        setCourseId(data?.response?.course._id);
        setCourses(data.response?.modules);

        if (data?.response?.course._id) {
          fetchReviews(data.response.course._id);
        }
      } catch (error) {
        console.error("Error:", error);
        // Redirect to mycourse on error
        navigate("/mycourse");
      } finally {
        setLoadingState((prev) => ({ ...prev, pageLoading: false }));
      }
    };

    //Fetch Reviews
    const fetchReviews = async (courseId) => {
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

        const userReview = reviews.find(
          (review) => review.userId._id === token
        );
        setAllReview(reviews);
        setRating(userReview?.rating || 0);
        setReviewForm(userReview?.rating || undefined);
        setReviewContent(userReview?.reviewContent || "");
      } catch (error) {
        console.log("Error fetching reviews");
      }
    };

    myCourse();
  }, [id, navigate, token, loadingState.buttonLoading]);

  //********************* Module Change Effect ***********************************************//

  useEffect(() => {
    if (courses.length > 0) {
      const introductionModule = courses.find(
        (module) => module.moduleTitle.toLowerCase() === "introduction"
      );
      const firstModule = introductionModule || courses[0];
      const firstVideo = firstModule.videos[0];
      if (firstVideo) {
        setvideoOtp(firstVideo.videoCode);
        setVideoPlayback(firstVideo.playBackInfo);

        setSelectedVideoTitle(firstVideo.videoTitle);
        setSelectedVideoDesc(firstVideo?.videoDescription);
      }
    }
  }, [courses]);


    // Modal for phone verification
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      if (userData && userData.status.phoneStatus !== "verified") {
        setShowModal(true);
      }
    }, [userData]);
  
    const closeModal = () => {
      navigate("/profile");
    };


  if (loadingState.pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
      </div>
    );
  }

  const handleVideoClick = (playBackInfo, videoCode, videoTitle, videoDesc) => {
    setVideoPlayback(playBackInfo);
    setvideoOtp(videoCode);

    setSelectedVideoTitle(videoTitle);
    setSelectedVideoDesc(videoDesc);
  };

  // Review Submit API
  const submitReview = async (e) => {
    e.preventDefault();
    setLoadingState((prev) => ({ ...prev, buttonLoading: true }));
    try {
      await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/course/${courseId}/reviews`,
        {
          userId: token,
          reviewContent,
          rating,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Comment successfully!",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, buttonLoading: false }));
    }
  };

  // Star Render
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <svg
          key={index}
          className={`w-8 h-8 cursor-pointer ${
            starValue <= (hoverRating || rating)
              ? "text-yellow-400"
              : "text-gray-300"
          } ${rating > 0 ? "cursor-default" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
        </svg>
      );
    });
  };

  //User Star Render
  const UserStars = (userStar) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <svg
          key={index}
          className={`w-5 h-5  ${
            starValue <= userStar ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
        </svg>
      );
    });
  };

  return (
    <Fragment>
    {showModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300 scale-100 hover:scale-105">
    <h2 className="text-3xl font-semibold text-white mb-4">Phone Number Not Verified Yet!</h2>
    <p className="text-gray-200 mb-6">
      Please verify your phone number before proceeding to watch the course.
    </p>
    <button
      className="bg-white float-right w-[20%] text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition duration-200"
      onClick={closeModal}
    >
      OK
    </button>
  </div>
</div>
    )}

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
                  title={selectedVideoTitle}
                  src={`https://player.vdocipher.com/v2/?otp=${videoOtp}&playbackInfo=${videoPlayback}`}
                  className="w-full aspect-video rounded-md"
                  allowFullScreen={true}
                  allow="encrypted-media"
                ></iframe>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap justify-start md:justify-center gap-4 md:gap-8 border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-t-lg text-sm md:text-lg font-medium transition-colors duration-300 ${
                        selectedTab === tab
                          ? "bg-blue-100 text-blue-600 border-b-2 border-blue-500"
                          : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500"
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {selectedTab === "About Video" && (
                    <div className="bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-lg shadow-md">
                      <p className="text-lg font-semibold">About This Video</p>
                      <p className="text-sm mt-2">
                        {selectedVideoDesc ||
                          "No description available for this video."}
                      </p>
                    </div>
                  )}

                  {selectedTab === "Q&A" && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-md">
                      <p className="text-lg font-semibold">
                        Our Q&A feature is under development!
                      </p>
                      <p className="text-sm mt-2">
                        It will be live soon. Thanks for your patience!
                      </p>
                    </div>
                  )}

                  {selectedTab === "Reviews" &&
                    (reviewForm === undefined ? (
                      <form
                        onSubmit={submitReview}
                        className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-lg mx-auto space-y-6 border border-gray-200"
                      >
                        {/* Form Header */}
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                          Share Your Review
                        </h2>

                        {/* Star Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Your Rating
                          </label>
                          <div className="flex items-center space-x-2 mt-2">
                            {renderStars()}
                          </div>
                        </div>

                        {/* Review Content */}
                        <div>
                          <label
                            htmlFor="reviewContent"
                            className="block text-sm font-medium text-gray-600"
                          >
                            Your Review
                          </label>
                          <textarea
                            id="reviewContent"
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            placeholder="Write about your experience with this course..."
                            rows="5"
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        {rating !== undefined && (
                          <div>
                            {loadingState.buttonLoading ? (
                              <button
                                disabled={true}
                                className="w-full bg-red-600 flex justify-center items-center text-white font-semibold py-3 rounded-lg shadow-md"
                              >
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
                                Submitting...
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                Submit Review
                              </button>
                            )}
                          </div>
                        )}
                      </form>
                    ) : (
                      <div className="space-y-4 bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-gray-800">
                          All Reviews
                        </h3>

                        {AllReview.length > 0 ? (
                          <div className="space-y-2">
                            {AllReview.map((comment) => (
                              <div
                                key={comment._id}
                                className="bg-white border border-gray-200 p-4 rounded-lg shadow-md flex items-start gap-4"
                              >
                                <img
                                  src={comment.imageUrl}
                                  crossOrigin="anonymous"
                                  alt={`${comment.userId.name} avatar`}
                                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      {comment.userId.name}
                                    </h4>
                                    <div className="flex">
                                      {UserStars(comment.rating)}
                                    </div>
                                  </div>
                                  <p className="text-gray-600 text-sm mt-2">
                                    {comment.reviewContent}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-md">
                            <p className="text-gray-500 text-center">
                              No reviews yet. Be the first to share your
                              thoughts!
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="bg-white shadow-lg rounded-lg overflow-y-auto max-h-[60vh] scrollable-content">
                {courses.length > 0 &&
                  courses.map((module, index) => (
                    <details
                      key={index}
                      className="mb-4"
                      open={
                        module.moduleTitle.toLowerCase() === "introduction" ||
                        (index === 0 &&
                          !courses.some(
                            (m) =>
                              m.moduleTitle.toLowerCase() === "introduction"
                          ))
                      }
                    >
                      <summary className="w-full text-left bg-blue-600 text-white font-semibold p-4 cursor-pointer hover:bg-blue-700 transition duration-200 rounded-t-lg">
                        {module.moduleTitle}
                      </summary>
                      <div className="bg-gray-50 border-t border-gray-200">
                        {module.videos.map((video, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer transition ${
                              selectedVideoTitle === video.videoTitle
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-700"
                            }`}
                            onClick={() =>
                              handleVideoClick(
                                video.playBackInfo,
                                video.videoCode,
                                video.videoTitle,
                                video?.videoDescription
                              )
                            }
                          >
                            <span className="truncate">{video.videoTitle}</span>
                            {selectedVideoTitle === video.videoTitle && (
                              <span className="text-blue-500 font-semibold">
                                Playing
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          </div>
        </div>
    </Fragment>
  );
};

export default WatchCourse;
