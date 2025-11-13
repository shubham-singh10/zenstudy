import React from "react";
import { BiTimer } from "react-icons/bi";
import { FiBook, FiCheckCircle, FiChevronRight } from "react-icons/fi";

export function TestSeriesCard({ test, onPreview }) {
  // 🔹 Tracker function
  const handleCardClick = () => {
    onPreview(); // existing functionality
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // card click bhi trigger na ho

    onPreview();
  };

  return (
    <div
      onClick={handleCardClick} // 🔹 pure card clickable
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl cursor-pointer"
    >
      <div className="relative">
        <img src={test.imageUrl} alt={test.title} crossOrigin="anonymous" />
        {test.includedInCourse ? (
          <div className="absolute top-2 right-2 bgGredient-green px-2 py-1 rounded-full textGold text-xs font-medium">
            Included in Course
          </div>
        ) : (
          <div className="absolute top-2 right-2 bgGredient-green px-2 py-1 rounded-full textGold text-xs font-medium">
            Standalone Series
          </div>
        )}
      </div>

      <div className="p-4">
        {test.includedInCourse && (
          <div className="text-xs font-medium textPurple mb-2">
            {test.courses[0]?.title}
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800 mb-2">{test.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{test.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <FiBook className="w-4 h-4 textPurple mr-2" />
            <span className="text-xs text-gray-600">
              {test.totalTests} Tests
            </span>
          </div>
          <div className="flex items-center">
            <BiTimer className="w-4 h-4 textPurple mr-2" />
            <span className="text-xs text-gray-600">
              {test.totalQuestions} Questions
            </span>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 mb-4">
          <h4 className="font-semibold textPurple mb-2 text-sm">
            What you'll get:
          </h4>
          <ul className="space-y-2">
            {test.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-xs textPurple">
                <FiCheckCircle className="w-3 h-3 mr-2 textPurple flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {test.includedInCourse ? (
              <div className="text-xs text-gray-600">Included with course</div>
            ) : (
              <>
                <span className="text-xl font-bold text-gray-900">
                  {test.isFree ? "Free" : `₹ ${test.price}`}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleButtonClick} // 🔹 button click alag tracker
          className="w-full bgGredient-purple-lr text-white py-2 px-4 rounded-lg font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
        >
          Preview Tests
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
