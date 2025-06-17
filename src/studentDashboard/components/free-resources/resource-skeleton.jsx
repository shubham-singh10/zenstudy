export default function ResourceSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-video">
                <div className="absolute inset-0 bg-purple-200 animate-pulse" />
            </div>
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-purple-200 animate-pulse" />
                    <div className="h-6 w-3/4 bg-purple-200 animate-pulse rounded" />
                </div>
                <div className="h-4 w-full bg-purple-200 animate-pulse rounded mb-2" />
                <div className="h-4 w-5/6 bg-purple-200 animate-pulse rounded mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="h-4 w-full bg-purple-200 animate-pulse rounded" />
                    <div className="h-4 w-full bg-purple-200 animate-pulse rounded" />
                    <div className="h-4 w-full bg-purple-200 animate-pulse rounded" />
                    <div className="h-4 w-full bg-purple-200 animate-pulse rounded" />
                </div>
                <div className="h-10 w-full bg-purple-200 animate-pulse rounded" />
            </div>
        </div>
    )
}