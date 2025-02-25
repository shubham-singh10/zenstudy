import React from "react"
import { BiTimer } from "react-icons/bi"
import { FiBook, FiCheckCircle, FiChevronsRight } from "react-icons/fi"

export function TestSeriesCard({ test, onPreview }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      <div className="relative">
        <img src={test.image || "/placeholder.svg"} alt={test.title} className="w-full h-48 object-cover" />
        {test.includedInCourse && (
          <div className="absolute top-4 right-4 bg-indigo-500 px-3 py-1 rounded-full text-white text-sm font-medium">
            Included in Course
          </div>
        )}
      </div>

      <div className="p-6">
        {test.includedInCourse && <div className="text-sm font-medium text-indigo-600 mb-2">{test.courseName}</div>}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{test.title}</h3>
        <p className="text-gray-600 mb-4">{test.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <FiBook className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="text-sm text-gray-600">{test.tests.length} Tests</span>
          </div>
          <div className="flex items-center">
            <BiTimer className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="text-sm text-gray-600">{test.totalQuestions} Questions</span>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-indigo-900 mb-3">What you'll get:</h4>
          <ul className="space-y-2">
            {test.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-indigo-700">
                <FiCheckCircle className="w-4 h-4 mr-2 text-indigo-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPreview}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            Preview Tests
            <FiChevronsRight className="w-4 h-4" />
          </button>
          {!test.includedInCourse && (
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
              Buy Now ₹{test.price}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

