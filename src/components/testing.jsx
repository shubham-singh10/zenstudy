import React from 'react';

function Testing() {
  return (
    <div className="flex h-screen overflow-auto">
      {/* Sticky Sidebar */}
      <div className="w-1/3 h-screen sticky top-0 bg-gray-200 p-4">
        <h2 className="text-xl font-bold">Sticky Sidebar</h2>
        <p>This section stays in place when scrolling.</p>
      </div>

      {/* Scrollable Content */}
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold">Scrollable Content</h2>
        <div className="space-y-6">
          {[...Array(50)].map((_, index) => (
            <p key={index} className="p-2 border-b">
              This is content line {index + 1}. Keep scrolling to test sticky behavior.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testing;
