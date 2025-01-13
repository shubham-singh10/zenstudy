import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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


  const isUpcoming = course.other1 === "upcoming";
  return (
    <div
      className={` ${
        differentClass
          ? `${differentClass} space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4`
          : "max-w-xs space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4"
      }`}
    >
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
          className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
        />
      </div>

      <div className="px-2 py-4">
        <div className="flex flex-row justify-between items-center gap-2 ">
          <div className="font-bold text-sm text-blue-600 truncate">
            {course.title}
          </div>
          <div className="px-3 py-1 w-auto text-sm font-medium text-gray-700 bg-gray-100 rounded-full shadow-sm">
            {course.language.name}
          </div>
        </div>

      </div>

      
      <div className="flex flex-row px-6 pt-4 justify-between items-center border-t-2">
        {course.value ? (
          <p className="text-blue-600 font-bold text-lg">
            {" "}
            <span className="line-through text-gray-400 text-sm mr-1">
              {" "}
              ₹ {course.value}
            </span>{" "}
            ₹ {course.price}
          </p>
        ) : (
          <p className="text-blue-600 font-bold text-xl"> ₹ {course.price}</p>
        )}

        {isUpcoming ? (
          <p className="text-red-600 font-bold text-sm">Coming Soon</p>
        ) : (
          <button
            className="custom-btn"
            onClick={() =>
              navigate(`/${link}/${course.title.replace(/\s+/g, '-')}`, {
                state: { courseId: course._id },
              })
            }            
          >
            <span className="custom-btn-bg"></span>
            <span className="custom-btn-text text-xs">View Details</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CommonCard;
