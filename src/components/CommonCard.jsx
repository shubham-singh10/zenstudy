import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

function CommonCard({ course, link, mentorLink, linknew, differentClass }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const isUpcoming = course.other1 === "upcoming";
  const newPage = course.title?.includes("UPSC Foundation Batch");
  const mentor = course.title?.includes("Personalised Mentorship Programme");
  const freeCourse = course.isFree;
  const userId = user?._id;

  const courseTitle = course.title || "Untitled Course";
  const languageName = course.language || "Unknown";
  const slug = courseTitle.replace(/\s+/g, "-");

  // FB Pixel: Track card view only once per render
  useEffect(() => {
    if (imageLoaded && !hasTrackedView && window.fbq) {
      fbq("trackCustom", "CourseCardViewed", {
        courseId: course._id,
        title: courseTitle,
        language: languageName,
        isFree: freeCourse,
      });
      setHasTrackedView(true);
    }
  }, [imageLoaded, hasTrackedView, course._id, courseTitle, languageName, freeCourse]);

  const navigateTo = () => {
    // FB Pixel: Track card click
    if (window.fbq) {
      fbq("trackCustom", "CourseCardClicked", {
        courseId: course._id,
        title: courseTitle,
        language: languageName,
        isFree: freeCourse,
        isLoggedIn: !!userId,
      });
    }

    if (freeCourse) {
      return userId
        ? navigate(`/watch-course-free/${course._id}`)
        : navigate("/sign-In");
    }

    const path = newPage
      ? `/${linknew}/${slug}`
      : mentor
      ? `/${mentorLink}/${slug}`
      : `/${link}/${slug}`;

    navigate(path, { state: { courseId: course._id } });
  };

  return (
    <div
      className={`${
        differentClass || "max-w-xs"
      } space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4 course-card`}
    >
      <div className="relative">
        {/* Blurred Placeholder */}
        <div
          className={`absolute inset-0 w-full h-52 bgGradient-purple-light rounded-2xl transition-opacity duration-700 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          } shimmer`}
        />

        <img
          src={course.thumbnailS3}
          alt={courseTitle}
          loading="lazy"
          crossOrigin="anonymous"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-52 rounded-2xl object-contain transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="px-2 py-4">
        <div className="flex justify-between items-center gap-2">
          <p className="font-bold text-sm textPurple truncate">{courseTitle}</p>
          <p className="px-3 py-1 text-sm font-medium textGold bgGredient-green w-fit rounded-tr-xl rounded-bl-xl shadow-sm">
            {languageName}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t-2 px-0 lg:px-1 md:px-2">
        {/* Price Info */}
        {freeCourse ? (
          <span className="px-3 py-1 bg-green-100 text-green-600 font-semibold rounded-full text-sm shadow-sm">
            Free Course
          </span>
        ) : course.value ? (
          <p className="textPurple font-bold text-lg">
            <span className="line-through text-gray-400 text-sm mr-1">
              ₹ {course.value}
            </span>
            ₹ {course.price}
            {(mentor || newPage) && (
              <span className="text-xs text-gray-500">/month</span>
            )}
          </p>
        ) : (
          <p className="textPurple font-bold text-xl">₹ {course.price}</p>
        )}

        {/* CTA */}
        {isUpcoming ? (
          <span className="text-red-600 font-bold text-sm">Coming Soon</span>
        ) : (
          <button className="custom-btn" onClick={navigateTo}>
            <span className="custom-btn-bg"></span>
            <span className="custom-btn-text text-xs">
              {freeCourse && !userId ? "Login to watch" : "View Details"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(CommonCard);
