import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const CourseCardSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="max-w-xs space-y-1 rounded-2xl overflow-hidden shadow-lg m-4 p-4 bg-gray-100">
            <div className="relative">
              <Skeleton height={208} width="100%" className="rounded-2xl" />
            </div>

            <div className="px-2 py-4">
              <div className="flex flex-row justify-between items-center gap-2">
                <Skeleton width={120} height={20} />
                <Skeleton width={60} height={24} className="rounded-full" />
              </div>
            </div>

            <div className="flex flex-row px-0 lg:px-6 md:px-2 pt-4 justify-between items-center border-t-2">
              <Skeleton width={80} height={24} />
              <Skeleton width={100} height={36} className="rounded-full" />
            </div>
          </div>
        ))}
    </>
  )
}

export default CourseCardSkeleton