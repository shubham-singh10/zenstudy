import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen gap-1">
            <div className="animate-spin rounded-full h-28 w-28 border-b-2 border-gray-900"></div>
            <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
    );
};

export default Loading;
