import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CommonCard({ course, link, differentClass }) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (course.imageUrl) {
      setImageSrc(course.imageUrl);
    }
  }, [course.imageUrl]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/course/${course._id}/getReviews`
        );
        // console.log('Response: ', response.data)
        setAverageRating(response.data.averageRating);
        setReviewsCount(response.data.reviews.length);
      } catch (error) {
        console.log("Error fetching reviews", error);
      }
    };

    fetchAverageRating();
  }, [course]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const isUpcoming = course.other1 === "upcoming";
  const isLiveClass =
    course.title.includes("Mentorship") ||
    course.title.includes("Answer Writing Program for UPSC Success");
  return (
    <div className={` ${differentClass ? `${differentClass} space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4` : 'max-w-xs space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4'}`}>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-2xl">
            <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
          </div>
        )}
        <img
          src={imageSrc}
          crossOrigin="anonymous"
          alt="Thumbnail"
          className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setLoading(false)}
        />
      </div>

      <div className="px-2 py-4">
        <div className="font-bold text-sm mb-1 text-blue-600">
          {course.title}
        </div>

        {isUpcoming ? (
          <p className="text-gray-600 text-xs mt-2">Expected: October 2024</p>
        ) : (
          <p className="text-gray-600 text-xs mt-1">
            Created at: {formatDate(course.createdAt)}
          </p>
        )}
      </div>

      {!isLiveClass && (
        <div className="flex items-center space-x-1 mt-1">

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
              const fullStars = Math.floor(averageRating);
              const hasHalfStar = averageRating % 1 !== 0;

              if (index < fullStars) {
                // Full star
                return (
                  <svg
                    key={index}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
                  </svg>
                );
              } else if (index === fullStars && hasHalfStar) {
                // Half star
                return (
                  <svg
                    key={index}
                    className="w-5 h-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <defs>
                      <linearGradient id="half">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="lightGray" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z"
                      fill="url(#half)"
                    />
                  </svg>
                );
              } else {
                // Empty star
                return (
                  <svg
                    key={index}
                    className="w-5 h-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
                  </svg>
                );
              }
            })}
          </div>
          <div className=" text-gray-500 text-xs ">
            {averageRating}/5 ({reviewsCount} reviews)
          </div>
        </div>
      )}

      <div className="flex flex-row px-6 pt-4 justify-between items-center border-t-2">
      
      {course.value ? (<p className="text-blue-600 font-bold text-xl"> <span className='line-through text-gray-400 text-sm mr-1'> ₹ {course.value}</span> ₹ {course.price}</p>):
      ( <p className="text-blue-600 font-bold text-xl"> ₹ {course.price}</p>)}

        {isUpcoming ? (
          <p className="text-red-600 font-bold text-sm">Coming Soon</p>
        ) : (
          <button
            className="custom-btn"
            onClick={() => navigate(`/${link}/${course._id}`)}
          >
            <span className="custom-btn-bg"></span>
            <span className="custom-btn-text text-sm">View Details</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CommonCard;
