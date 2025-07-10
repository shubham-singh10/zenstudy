import React, { useState } from 'react';
import Daily from './Daily';
import { Monthly } from './Monthly';

const CurrentAffairsN = () => {
  const [selectedView, setSelectedView] = useState('daily');

  // 🔥 Handle button click and track with Facebook Pixel
  const handleViewChange = (view) => {
    setSelectedView(view);

    // ✅ Pixel tracking
    if (window.fbq) {
      fbq('trackCustom', 'CurrentAffairsViewChange', {
        viewType: view, // 'daily' or 'monthly'
        location: window.location.pathname,
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-12 min-h-screen bg-white">
      <div className="flex flex-row gap-6 my-4 justify-center">

        {/* Daily Button */}
        <button
          className={`w-[50%] font-semibold rounded-md py-3 border-2 ${
            selectedView === 'daily'
              ? 'border-[#543a5d] text-white bgGredient-purple shadow-lg'
              : 'border-[#543a5d] textPurple bg-white shadow-lg'
          } bg-gradient-to-r hover:from-[#935aa6] hover:to-[#543a5d] hover:text-white transition-all duration-300 ease-in-out`}
          onClick={() => handleViewChange('daily')}
        >
          Daily
        </button>

        {/* Monthly Button */}
        <button
          className={`w-[50%] font-semibold rounded-md py-3 border-2 ${
            selectedView === 'monthly'
              ? 'bgGredient-purple text-white'
              : 'bg-white border-[#543a5d] textPurple'
          } shadow-lg bg-gradient-to-r hover:from-[#935aa6] hover:to-[#543a5d] hover:text-white transition-all duration-300 ease-in-out`}
          onClick={() => handleViewChange('monthly')}
        >
          Monthly
        </button>

      </div>

      {/* Display selected component */}
      {selectedView === 'daily' && <Daily />}
      {selectedView === 'monthly' && <Monthly />}
    </div>
  );
};

export default CurrentAffairsN;
