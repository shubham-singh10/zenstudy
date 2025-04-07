import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const WatchCourseSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back button skeleton */}
        <Skeleton className="w-40 h-10 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Video + Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="w-3/4 h-6" />

            <div className="bg-white rounded-xl shadow-md">
              <div className="flex space-x-2 border-b px-4 py-3">
                {[...Array(2)].map((_, idx) => (
                  <Skeleton key={idx} className="w-24 h-8 rounded-lg" />
                ))}
              </div>
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-4" />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md sticky top-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4 flex justify-between items-center">
                <Skeleton className="w-1/2 h-5" />
                <Skeleton className="w-1/4 h-4" />
              </div>

              <div className="p-4 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-5/6 h-8 ml-4" />
                    <Skeleton className="w-4/5 h-8 ml-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchCourseSkeleton;
