import React from "react";
import { BiCalendar } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CoursePageSkeleton = () => {
  return (
    <div className="-mt-3 overflow-auto h-screen flex flex-wrap bg-gray-50">
      {/* Top Banner Skeleton */}
      <div className="w-full flex justify-center items-center relative">
        <Skeleton height={144} width="100%" className="lg:h-full md:h-40 h-36" />
      </div>

      {/* Tabs Section Skeleton */}
      <div className="w-full h-14 bg-white sticky top-0 z-10 shadow-lg flex justify-start lg:px-36 items-center lg:space-x-8 px-2 scrollable-tabs">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Skeleton key={index} width={80} height={24} className="mx-2" />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row w-full lg:mx-28">
        {/* Left Section */}
        <div className="w-full lg:w-[60%] bg-purple-50 p-2 md:p-3 lg:p-6">
          {/* Video Section Skeleton */}
          <div className="py-8">
            <Skeleton height={384} width="100%" className="rounded-lg" />
          </div>

          {/* About Section Skeleton */}
          <div className="py-8">
            <Skeleton width={200} height={36} className="mb-6" />

            {/* Course Overview Card Skeleton */}
            <div className="bgGradient-purple-light rounded-xl p-6 mb-8 border border-purple-100 shadow-sm">
              <Skeleton width={180} height={28} className="mb-4" />
              <Skeleton count={3} className="mb-2" />
              
              <div className="mt-4 bg-white rounded-lg p-4 border border-blue-100 flex items-center space-x-3">
                <Skeleton circle width={48} height={48} className="flex-shrink-0" />
                <div className="w-full">
                  <Skeleton width={120} height={16} className="mb-1" />
                  <Skeleton width={150} height={20} />
                </div>
              </div>
            </div>

            <Skeleton width={200} height={36} className="mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-start">
                  <Skeleton circle width={24} height={24} className="mr-3 flex-shrink-0" />
                  <Skeleton width="90%" height={20} />
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Section Skeleton */}
          <div className="py-8">
            <Skeleton width={180} height={32} className="mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="rounded-lg">
                  <div className="p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Skeleton width={150} height={24} />
                      <Skeleton width={20} height={20} circle />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Skeleton width={80} height={16} />
                      <div className="flex items-center">
                        <BiCalendar className="text-gray-300 mr-2 h-4 w-4" />
                        <Skeleton width={180} height={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Skeleton width={100} height={36} className="mt-4" />
          </div>

          {/* Special Offer Skeleton */}
          <div className="bgGredient-purple-lr rounded-xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="w-full md:w-2/3">
                <Skeleton width={180} height={32} className="mb-2" baseColor="#efdb78" highlightColor="#cc9a04" />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton circle width={20} height={20} className="mr-2" baseColor="#efdb78" highlightColor="#cc9a04" />
                    <Skeleton width="80%" height={16} baseColor="#efdb78" highlightColor="#cc9a04" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton circle width={20} height={20} className="mr-2" baseColor="#efdb78" highlightColor="#cc9a04" />
                    <Skeleton width="60%" height={16} baseColor="#efdb78" highlightColor="#cc9a04" />
                  </div>
                </div>
              </div>
              <Skeleton width={120} height={48} className="mt-4 md:mt-0 rounded-lg" baseColor="#efdb78" highlightColor="#cc9a04" />
            </div>
          </div>

          {/* FAQ Section Skeleton */}
          <div className="py-8">
            <Skeleton width={240} height={36} className="mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-purple-100 border rounded-lg">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <Skeleton width="80%" height={24} />
                      <Skeleton width={20} height={20} circle />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More Details Section Skeleton */}
          <div className="py-4">
            <Skeleton width={180} height={36} className="mb-4" />
          </div>

          {/* Class Features Skeleton */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Skeleton circle width={40} height={40} className="mr-3" />
                  <Skeleton width={150} height={28} />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton circle width={20} height={20} className="mr-2 mt-1" />
                      <Skeleton width="90%" height={16} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Subjects Covered Skeleton */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center mb-4">
              <Skeleton circle width={40} height={40} className="mr-3" />
              <Skeleton width={180} height={28} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} height={40} className="rounded-lg" />
              ))}
            </div>
          </div>

          {/* Why Choose Us Skeleton */}
          <div className="mt-8 bgGredient-green rounded-xl p-6 text-white">
            <Skeleton width={180} height={32} className="mb-4" baseColor="#efdb78" highlightColor="#cc9a04" />
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-start">
                  <Skeleton circle width={28} height={28} className="mr-3 mt-1" baseColor="#efdb78" highlightColor="#cc9a04" />
                  <Skeleton width="90%" height={16} baseColor="#efdb78" highlightColor="#cc9a04" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Skeleton width={280} height={48} className="rounded-lg" baseColor="#efdb78" highlightColor="#cc9a04" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[40%] bg-purple-50 p-2 md:p-5 lg:p-10">
          <div className="sticky top-20 bg-white border border-gray-200 shadow-lg rounded-lg p-6">
            {/* Image Section Skeleton */}
            <Skeleton height={200} width="100%" className="mb-4 rounded-lg" />

            {/* Course Title Skeleton */}
            <div className="flex flex-row justify-between items-center mb-4">
              <Skeleton width={180} height={24} />
              <Skeleton width={80} height={24} className="rounded-full" />
            </div>

            {/* Pricing Section Skeleton */}
            <div className="flex flex-col md:flex-row lg:flex-row md:justify-between lg:justify-between lg:items-center mb-6">
              <Skeleton width={120} height={28} className="mb-2 sm:mb-0" />
              <Skeleton width={80} height={24} className="rounded-md" />
            </div>

            {/* Apply Coupon Link Skeleton */}
            <Skeleton width={180} height={16} className="mb-3" />

            {/* CTA Button Skeleton */}
            <Skeleton height={48} width="100%" className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePageSkeleton;
