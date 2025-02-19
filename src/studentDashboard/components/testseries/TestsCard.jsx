import React from "react";
import { BiBook, BiBookOpen, BiTrophy } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

export const TestsCard = ({ test, onProceed }) => {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
      onClick={onProceed}
    >
      <div className="relative h-48 md:h-64">
        <img
          src={
            "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200"
          }
          alt={test.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute  bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl z-50 font-bold mb-2">{test.title}</h1>
          <p className="text-gray-200">{test.shortDescription}</p>
        </div>
       {test.includedInCourse && <div className="absolute top-0 right-0 p-2 bg-gradient-to-r from-black/100 to-transparent text-white rounded-bl-xl">
          <div className="flex items-center gap-2 mb-3">
            <FaGraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-200">
              {test?.courses[0]?.title}
            </span>
          </div>
        </div>}
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <BiBookOpen className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="text-sm text-gray-600">
              {" "}
              {test.totalTests} Test
            </span>
          </div>
          <div className="flex items-center">
            <BiTrophy className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="text-sm text-gray-600">
              {test.completedTests.length} Completed
            </span>
          </div>
        </div>

        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              percentage %
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${test.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
