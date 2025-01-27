import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FiArrowLeft, FiChevronDown, FiChevronRight, FiClock, FiFileText, FiPlay, FiStar } from 'react-icons/fi';

const WatchCourseNew = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [expandedModules, setExpandedModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [videoOtp, setVideoOtp] = useState('');
  const [videoPlayback, setVideoPlayback] = useState('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [selectedVideoDesc, setSelectedVideoDesc] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, content: '' });
  const [notes, setNotes] = useState('');
  const [materials, setMaterials] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const token = Cookies.get('access_tokennew');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}zenstudy/api/payment/watchCourse`, { id });
        setCourses(response.data.response?.modules || []);
        if (response.data.response?.course._id) {
          fetchReviews(response.data.response.course._id);
          // Simulating fetching materials
          setMaterials([
            { id: 1, name: 'Course Syllabus', type: 'pdf' },
            { id: 2, name: 'Supplementary Reading', type: 'pdf' },
            { id: 3, name: 'Practice Exercises', type: 'docx' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        navigate('/mycourse');
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  useEffect(() => {
    if (courses.length > 0) {
      const introModule = courses.find(module => module.moduleTitle.toLowerCase() === 'introduction') || courses[0];
      if (introModule.videos.length > 0) {
        const firstVideo = introModule.videos[0];
        setVideoOtp(firstVideo.videoCode);
        setVideoPlayback(firstVideo.playBackInfo);
        setSelectedVideoTitle(firstVideo.videoTitle);
        setSelectedVideoDesc(firstVideo.videoDescription || '');
      }
    }
  }, [courses]);

  const fetchReviews = async (courseId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}zenstudy/api/course/${courseId}/getReviews`);
      const reviews = response.data.reviews.map((review) => ({
        ...review,
        imageUrl: review.userId.avatar.startsWith("http")
          ? review.userId.avatar
          : `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${review.userId.avatar}`,
      }));
      setReviews(reviews);
      const userReview = response.data.reviews.find(review => review.userId._id === token);
      if (userReview) {
        setUserReview({ rating: userReview.rating, content: userReview.reviewContent });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleVideoClick = (video) => {
    setVideoOtp(video.videoCode);
    setVideoPlayback(video.playBackInfo);
    setSelectedVideoTitle(video.videoTitle);
    setSelectedVideoDesc(video.videoDescription || '');
  };

  const toggleModule = (moduleId, moduleTitle) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
    setSelectedModule(moduleTitle); // Set the module title here
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API}zenstudy/api/course/${id}/reviews`, {
        userId: token,
        reviewContent: userReview.content,
        rating: userReview.rating,
      });
      fetchReviews(id);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/mycourse')}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
        >
          <FiArrowLeft size={20} />
          <span>Back to My Courses</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <iframe
                title={selectedVideoTitle}
                src={`https://player.vdocipher.com/v2/?otp=${videoOtp}&playbackInfo=${videoPlayback}`}
                className="w-full h-full"
                allowFullScreen
                allow="encrypted-media"
              ></iframe>
            </div>

            <h1 className="lg:text-xl text-lg font-bold text-gray-800">{selectedVideoTitle}</h1>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex flex-wrap border-b">
                {['about', 'notes', 'materials', 'qa', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium transition-colors flex-grow sm:flex-grow-0 ${activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <p className="text-gray-600 leading-relaxed">{selectedVideoDesc}</p>
                )}
                {activeTab === 'notes' && (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Take notes here..."
                      className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                {activeTab === 'materials' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Course Materials</h3>
                    {materials.map((material) => (
                      <div key={material.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FiFileText className="text-blue-500" />
                        <span>{material.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{material.type}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'qa' && (
                  <p className="text-gray-600 italic">Q&A feature coming soon!</p>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {userReview === 0 && (
                      <form onSubmit={submitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                                className="focus:outline-none"
                              >
                                <FiStar
                                  className={`w-8 h-8 ${star <= userReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                          <textarea
                            id="review"
                            value={userReview.content}
                            onChange={(e) => setUserReview(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                          Submit Review
                        </button>
                      </form>
                    )}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="bg-gray-50 rounded-lg p-4 shadow">
                          <div className="flex items-center mb-2">
                            <img
                              src={review.imageUrl}
                              crossOrigin="anonymous"
                              alt={`${review.userId.name} avatar`}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-800">{review.userId.name}</div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FiStar
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{review.reviewContent}</p>
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
              <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Course Content</h2>
              <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
              {courses.map((module, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => toggleModule(module._id, module.moduleTitle)}
                    className={`${selectedModule === module.moduleTitle ? "bg-blue-400" : ""} w-full px-4 py-3 flex items-center border-2 justify-between text-left rounded-lg `}
                  >
                    <span className={`font-medium  ${selectedModule === module.moduleTitle ? " text-white" : "text-gray-800"}`}>
                      {module.moduleTitle}
                    </span>
                    {expandedModules.includes(module._id) ? (
                      <FiChevronDown size={20} className={`${selectedModule === module.moduleTitle ? "text-white" :"text-gray-500" }`} />
                    ) : (
                      <FiChevronRight size={20} className={`${selectedModule === module.moduleTitle ? "text-white" :"text-gray-500" }`} />
                    )}
                  </button>
                  {expandedModules.includes(module._id) && (
                    <div className="mt-2 space-y-2">
                      {module.videos.map((video, vIndex) => (
                        <button
                          key={vIndex}
                          onClick={() => handleVideoClick(video)}
                          className={`w-full px-4 py-2 flex items-center border-2 justify-between text-left rounded-lg transition-colors ${selectedVideoTitle === video.videoTitle ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 bg-blue-50 text-gray-700'
                            }`}
                        >
                          <div className="flex items-center">
                            <FiPlay size={16} className={`mr-2 ${selectedVideoTitle === video.videoTitle ? 'text-blue-600' : 'text-gray-400 '}`} />
                            <span className="text-sm">{video.videoTitle}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FiClock size={12} className="mr-1" />
                            <span>{formatDuration(video.duration)}</span>
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

export default WatchCourseNew;
