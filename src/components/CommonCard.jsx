"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function CommonCard({ course, link, linknew, differentClass }) {
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [reviewsCount, setReviewsCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (course.imageUrl) {
      // Preload the image
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImageSrc(course.imageUrl)
        setImageLoaded(true)
        // Add a small delay before showing content for a smoother transition
        setTimeout(() => {
          setContentVisible(true)
        }, 100)
      }
      img.onerror = () => {
        // Fallback to default image if loading fails
        setImageSrc(`/assets/upcoming.webp`)
        setImageLoaded(true)
        setTimeout(() => {
          setContentVisible(true)
        }, 100)
      }
      img.src = course.imageUrl
    } else {
      setImageLoaded(true)
      setTimeout(() => {
        setContentVisible(true)
      }, 100)
    }
  }, [course.imageUrl])

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}zenstudy/api/course/${course._id}/getReviews`)
        setAverageRating(response.data.averageRating)
        setReviewsCount(response.data.reviews.length)
      } catch (error) {
        console.log("Error fetching reviews", error)
      }
    }

    fetchAverageRating()
  }, [course])

  const isUpcoming = course.other1 === "upcoming"
  const newPage = course.title?.includes("UPSC Foundation Batch")

  return (
    <div
      className={`${
        differentClass
          ? `${differentClass} space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4`
          : "max-w-xs space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4"
      } course-card transition-all duration-500 ${
        contentVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
      }`}
    >
      <div className="relative">
        {/* Blurred Placeholder (Visible Until Image Loads) */}
        <div
          className={`absolute inset-0 w-full h-52 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl transition-opacity duration-700 ${
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
          <div className="font-bold text-sm text-blue-600 truncate">{course.title}</div>
          <div className="px-3 py-1 w-auto text-sm font-medium text-gray-700 bg-gray-100 rounded-full shadow-sm">
            {course.language?.name}
          </div>
        </div>
      </div>

      <div className="flex flex-row px-0 lg:px-6 md:px-2 pt-4 justify-between items-center border-t-2">
        {course.value ? (
          <p className="text-blue-600 font-bold text-lg">
            {" "}
            <span className="line-through text-gray-400 text-sm mr-1"> ₹ {course.value}</span> ₹ {course.price}
          </p>
        ) : (
          <p className="text-blue-600 font-bold text-xl"> ₹ {course.price}</p>
        )}

        {isUpcoming ? (
          <p className="text-red-600 font-bold text-sm">Coming Soon</p>
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
  )
}

export default CommonCard