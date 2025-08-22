import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FiBook, FiFileText, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ResourceCard({
  courseId,
  title,
  description,
  imageUrl,
  language,
  buttonText,
  type,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case "course":
        return <FiBook className="h-5 w-5" />;
      case "test":
        return <FiFileText className="h-5 w-5" />;
      case "currentAffairs":
        return <FiTrendingUp className="h-5 w-5" />;
      default:
        return <FiBook className="h-5 w-5" />;
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg group cursor-pointer"
      onClick={() => navigate(`/watch-course-free/${courseId}`)}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={imageUrl || "/placeholder.svg"}
          crossOrigin="anonymous"
          alt={title}
          className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <span className="absolute top-3 right-3 z-10 bgGredient-gold text-white text-xs font-medium px-2.5 py-1 rounded-tr-xl rounded-bl-xl">
          {language?.name || "English"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Icon + Title */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full text-lg textPurple shadow-sm">
              {getIcon()}
            </div>
            <h3 className="font-semibold text-sm sm:text-md textPurple ">
              {title}
            </h3>
          </div>

          {/* Badge */}
          <span className="px-3 py-0.5 bgGredient-gold textLight font-semibold text-md rounded-full shadow-sm">
            Free
          </span>
        </div>

        <p className="textdark text-sm mb-4 line-clamp-2">{description}</p>

        {/* Button style but no separate onClick */}
        <div className="flex items-center justify-center gap-2 w-full bgGredient-purple-lr hover:scale-105 text-white py-2 px-4 rounded-md transition-transform">
          <FaPlay /> {buttonText}
        </div>
      </div>
    </div>
  );
}
