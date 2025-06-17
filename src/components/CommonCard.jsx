"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

function CommonCard({ course, link, mentorLink, linknew, differentClass }) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [contentVisible, setContentVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

   const {user} = useAuth()

     useEffect(() => {
     
       if (user) {
         try {
           setCurrentUser(user?._id);
         } catch (error) {
           console.error("Error decoding user:", error);
         }
       }
     }, [user]);


  useEffect(() => {
    if (course.imageUrl) {
      // Preload the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setImageSrc(course.imageUrl);
        setImageLoaded(true);
        // Add a small delay before showing content for a smoother transition
        setTimeout(() => {
          setContentVisible(true);
        }, 100);
      };
      img.onerror = () => {
        // Fallback to default image if loading fails
        setImageSrc(`/assets/upcoming.webp`);
        setImageLoaded(true);
        setTimeout(() => {
          setContentVisible(true);
        }, 100);
      };
      img.src = course.imageUrl;
    } else {
      setImageLoaded(true);
      setTimeout(() => {
        setContentVisible(true);
      }, 100);
    }
  }, [course.imageUrl]);



  const isUpcoming = course.other1 === "upcoming";
  const newPage = course.title?.includes("UPSC Foundation Batch");
  const mentor = course.title?.includes("Personalised Mentorship Programme");
  const freeCourse = course.isFree;

  return (
    <div
      className={`${
        differentClass
          ? `${differentClass} space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4`
          : "max-w-xs space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4"
      } course-card transition-all duration-500 ${
        contentVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-4"
      }`}
    >
      <div className="relative">
        {/* Blurred Placeholder (Visible Until Image Loads) */}
        <div
          className={`absolute inset-0 w-full h-52 bgGradient-purple-light rounded-2xl transition-opacity duration-700 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          } shimmer`}
        />

        <img
          src={imageSrc || "/placeholder.svg"}
          crossOrigin="anonymous"
          alt={course.title || "Course Thumbnail"}
          className={`w-full h-52 rounded-2xl object-contain transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="px-2 py-4">
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="font-bold text-sm textPurple  truncate">
            {course.title}
          </div>
          <div className="px-3 py-1 text-sm font-medium textGold bgGredient-green  w-fit rounded-tr-xl rounded-bl-xl shadow-sm">
            {course.language?.name}
          </div>
        </div>
      </div>

      <div className="flex flex-row px-0 lg:px-1 md:px-2 pt-4 justify-between items-center border-t-2">
        {course.isFree ? (
          <p className="px-3 py-1 bg-green-100 text-green-600 font-semibold rounded-full text-sm shadow-sm">
            Free Course
          </p>
        ) : course.value ? (
          <p className="textPurple  font-bold text-lg">
            {" "}
            <span className="line-through text-gray-400 text-sm mr-1">
              {" "}
              ₹ {course.value}
            </span>{" "}
            ₹ {course.price} {(course.title?.toLowerCase().includes("personalised mentorship programme") || course.title?.toLowerCase().includes("upsc foundation batch")) && <span className="text-xs text-gray-500">/month</span>}
          </p>
        ) : (
          <p className="textPurple  font-bold text-xl"> ₹ {course.price}</p>
        )}

        {isUpcoming ? (
          <p className="text-red-600 font-bold text-sm">Coming Soon</p>
        ) : freeCourse ? (
          <button
            className="custom-btn"
            onClick={() =>
             currentUser ? navigate(`/watch-course-free/${course._id}`) : navigate("/sign-In")
            }
          >
            <span className="custom-btn-bg"></span>
            <span className="custom-btn-text text-xs">{currentUser ? "Watch Course" : "Login to watch"}</span>
          </button>
        ) : newPage ? (
          <button
            className="custom-btn"
            onClick={() =>
              navigate(`/${linknew}/${course.title.replace(/\s+/g, "-")}`, {
                state: { courseId: course._id },
              })
            }
          >
            <span className="custom-btn-bg"></span>
            <span className="custom-btn-text text-xs">View Details</span>
          </button>
        ) : mentor ? (
          <button
            className="custom-btn"
            onClick={() =>
              navigate(`/${mentorLink}/${course.title.replace(/\s+/g, "-")}`, {
                state: { courseId: course._id },
              })
            }
          >
            <span className="custom-btn-bg"></span>
            <span className="custom-btn-text text-xs">View Details</span>
          </button>
        ) : (
          <button
            className="custom-btn"
            onClick={() =>
              navigate(`/${link}/${course.title.replace(/\s+/g, "-")}`, {
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
