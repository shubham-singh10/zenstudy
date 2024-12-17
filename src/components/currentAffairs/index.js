import React, { useState } from 'react';
import Daily from './Daily';
import { Monthly } from './Monthly';

const CurrentAffairsN = () => {
  // State to keep track of the selected view (daily or monthly)
  const [selectedView, setSelectedView] = useState('daily'); // Default is 'daily'

  // Handle the view change when a button is clicked
  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  return (
    <div className="p-4 sm:p-6 md:p-12 min-h-screen bg-white">
      <div className="flex flex-row gap-6 my-4 justify-center">
        {/* Monthly Button */}
        <button
          className={`w-[50%] font-semibold rounded-md py-3 border-2 ${selectedView === "monthly" ? "bg-green-500  text-white" : "bg-white border-green-500 text-green-500 " }  shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300 ease-in-out`}
          onClick={() => handleViewChange('monthly')} // Set view to 'monthly'
        >
          Monthly
        </button>

        {/* Daily Button */}
        <button
          className={`w-[50%] font-semibold rounded-md py-3 border-2 ${selectedView === "daily" ? " border-blue-500 text-white bg-blue-500 shadow-lg" : " border-blue-500 text-blue-500 bg-white shadow-lg" } hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out`}
          onClick={() => handleViewChange('daily')} // Set view to 'daily'
        >
          Daily
        </button>
      </div>

      {/* Display Daily or Monthly Component based on selected view */}
      {selectedView === 'daily' && <Daily />}
      {selectedView === 'monthly' && <Monthly />}
    </div>
  );
}

export default CurrentAffairsN;
