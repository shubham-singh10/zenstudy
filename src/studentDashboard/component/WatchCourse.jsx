import React, { Fragment, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const WatchCourse = () => {
  const [selectedTab, setSelectedTab] = useState("About Video");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [url, setUrl] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [selectedVideoDesc, setSelectedVideoDesc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const tabs = ["About Video", "Q&A", "Reviews"];
  const [meetingId, setmeetingId] = useState(null);
  const [meetloading, setMeetLoading] = useState(false);
  const token = Cookies.get("access_tokennew");
  const [reviewContent, setReviewContent] = useState("");
  const [AllReview, setAllReview] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
        // console.log("MyCourse_purchase", data.response);

        setCourseId(data?.response?.course._id);
        setCourses(data.response?.modules);
        setmeetingId(data.response.course.meetingId);
        setLoading(false);

        if (data?.response?.course._id) {
          fetchReviews(data.response.course._id);
        }
      } catch (error) {
        console.error("Error:", error);
        // Redirect to mycourse on error
        navigate("/mycourse");
      }
    };

    const fetchReviews = async (courseId) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/course/${courseId}/getReviews`
        );
        const reviews = response.data.reviews;
         console.log("All reviews:", reviews);
        setAllReview(reviews);
        const userReview = reviews.find((review) => review.userId === token);
        // console.log("User-specific rating:", userReview);
        setRating(userReview?.rating || 0);
        setReviewContent(userReview?.reviewContent || "");
      } catch (error) {
        console.log("Error fetching reviews");
      }
    };

    myCourse();
  }, [id, navigate, token]);

  //************************************ Meeting Function Start ***************************************************************//

  const onSubmit2 = async (id) => {
    setMeetLoading(true);
    // window.location.replace(`http://localhost:3001?key=${id}&user=${token}`)
    window.location.replace(
      `https://live.zenstudy.in/?key=${id}&user=${token}`
    );
    // window.location.replace(`https://live-zenstudy.vercel.app/?key=${id}&user=${token}`)
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

  const submitReview = async (e) => {
    e.preventDefault();
    // console.log('Course_Id: ', id)
    // console.log('User_Id: ', token)
    // console.log('Rating: ', rating)
    // console.log('Comment: ', reviewContent)
    try {
      await axios.post(
        `${process.env.REACT_APP_API}zenstudy/api/course/${courseId}/reviews`,
        {
          userId: token,
          reviewContent,
          rating,
        }
      );
      alert("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

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
          onClick={() => rating === 0 && setRating(starValue)}
          onMouseEnter={() => rating === 0 && setHoverRating(starValue)}
          onMouseLeave={() => rating === 0 && setHoverRating(0)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
        </svg>
      );
    });
  };

  const UserStars = (userStar) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <svg
          key={index}
          className={`w-5 h-5  ${
            starValue <= ( userStar)
              ? "text-yellow-400"
              : "text-gray-300"
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

              {selectedTab === "Reviews" && 
                (
                rating === 0 ? (<form
                  onSubmit={submitReview}
                  className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto space-y-4"
                >
                  {rating === 0 ? (
                    <h2 className="text-lg font-semibold text-gray-700">
                      Leave a Review
                    </h2>
                  ) : (
                    <h2 className="text-lg font-semibold text-gray-700">
                      Thankyou for your review !
                    </h2>
                  )}
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1">
                    {renderStars()}
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
                      disabled={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="Share your experience with this course"
                      rows="4"
                      required
                    />
                  </div>
                  {/* Submit Button */}
                  {rating === 0 && (
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Submit Review
                    </button>
                  )}
                </form>) : (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">All Reviews</h3>
                    <div className="space-y-4">
                    {AllReview.map((comment) => (
                        <div key={comment._id} className="flex items-start space-x-4 border-b pb-4">
                            <img
                                src={'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg'}
                                alt={`${comment.name} avatar`}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                            <div className="flex gap-2 items-center"><h3 className="font-semibold text-gray-800">user name</h3>
                            <div className="flex">{UserStars(comment.rating)}</div>
                            </div>
                                <p className="text-gray-600 text-sm">{comment.reviewContent}</p>
                            </div>
                        </div>
                    ))}
                    {AllReview.length === 0 && <p className="text-gray-500">No comments yet.</p>}
                </div>
                  </div>
                )
              ) 
            }
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

      {/* Meeting join button */}
      {meetingId && (
        <button
          onClick={() => onSubmit2(meetingId)}
          disabled={meetloading}
          className={`flex justify-end ${
            meetloading
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
      {/* Meeting join button */}
    </div>
  );
};

export default WatchCourse;
