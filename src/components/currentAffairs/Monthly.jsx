import React, { useState, useRef, Fragment } from 'react';

export const Monthly = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const monthCardRef = useRef(null); // Reference for scrolling

  // Month list with styling
  const months = [
    { name: 'JAN', color: 'bg-yellow-300' },
    { name: 'FEB', color: 'bg-blue-600' },
    { name: 'MAR', color: 'bg-sky-300' },
    { name: 'APR', color: 'bg-blue-500' },
    { name: 'MAY', color: 'bg-gray-200' },
    { name: 'JUN', color: 'bg-slate-700 text-white' },
    { name: 'JUL', color: 'bg-gray-200' },
    { name: 'AUG', color: 'bg-yellow-300' },
    { name: 'SEP', color: 'bg-purple-300' },
    { name: 'OCT', color: 'bg-rose-400' },
    { name: 'NOV', color: 'bg-green-300' },
    { name: 'DEC', color: 'bg-yellow-300' },
  ];

  // Month data with multiple entries
  const monthData = {
    JAN: [
      { title: 'Event 1', description: 'January Event 1 details' },
      { title: 'Event 2', description: 'January Event 2 details' },
      { title: 'Event 3', description: 'January Event 3 details' },
      { title: 'Event 4', description: 'January Event 4 details' },
    ],
    FEB: [
      { title: 'Event 1', description: 'February Event 1 details' },
      { title: 'Event 2', description: 'February Event 2 details' },
    ],
    MAR: [
      { title: 'Event 1', description: 'March Event 1 details' },
      { title: 'Event 2', description: 'March Event 2 details' },
      { title: 'Event 3', description: 'March Event 3 details' },
    ],
    APR: [
      { title: 'Event 1', description: 'April Event 1 details' },
      { title: 'Event 2', description: 'April Event 2 details' },
      { title: 'Event 3', description: 'April Event 3 details' },
      { title: 'Event 4', description: 'April Event 4 details' },
    ],
    MAY: [
      { title: 'Event 1', description: 'May Event 1 details' },
      { title: 'Event 2', description: 'May Event 2 details' },
      { title: 'Event 3', description: 'May Event 3 details' },
    ],
    JUN: [
      { title: 'Event 1', description: 'June Event 1 details' },
      { title: 'Event 2', description: 'June Event 2 details' },
      { title: 'Event 3', description: 'June Event 3 details' },
      { title: 'Event 4', description: 'June Event 4 details' },
    ],
    JUL: [
      { title: 'Event 1', description: 'July Event 1 details' },
      { title: 'Event 2', description: 'July Event 2 details' },
    ],
    AUG: [
      { title: 'Event 1', description: 'August Event 1 details' },
      { title: 'Event 2', description: 'August Event 2 details' },
      { title: 'Event 3', description: 'August Event 3 details' },
    ],
    SEP: [
      { title: 'Event 1', description: 'September Event 1 details' },
      { title: 'Event 2', description: 'September Event 2 details' },
    ],
    OCT: [
      { title: 'Event 1', description: 'October Event 1 details' },
      { title: 'Event 2', description: 'October Event 2 details' },
      { title: 'Event 3', description: 'October Event 3 details' },
      { title: 'Event 4', description: 'October Event 4 details' },
    ],
    NOV: [
      { title: 'Event 1', description: 'November Event 1 details' },
      { title: 'Event 2', description: 'November Event 2 details' },
    ],
    DEC: [
      { title: 'Event 1', description: 'December Event 1 details' },
      { title: 'Event 2', description: 'December Event 2 details' },
      { title: 'Event 3', description: 'December Event 3 details' },
    ],
  };
  

  // Handle month click and scroll into view
  const handleMonthClick = (monthName) => {
    setSelectedMonth(monthName);

    setTimeout(() => {
      if (monthCardRef.current) {
        monthCardRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Monthly View</h1>

      {/* Month Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center">
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => handleMonthClick(month.name)}
            className={`w-32 h-12 rounded-lg shadow-lg text-black font-bold text-xl hover:scale-105 transition-all duration-300 ${month.color}`}
          >
            {month.name}
          </button>
        ))}
      </div>

     
      {selectedMonth && (
        <Fragment>
          {/* Check if data exists for the selected month */}
          <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-10  md:p-6 lg:p-14" ref={monthCardRef}>
          {monthData[selectedMonth]?.length > 0 ? (
            monthData[selectedMonth].map((data, idx) => (
              <div key={idx} className=" relative group perspective w-full">
                {/* Card Wrapper */}
                <div className="relative w-full min-h-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">
                  {/* Front Side */}
                  <div className="backface-hidden bg-white border-2 rounded-xl p-6 shadow-md flex flex-row gap-4">
                    <div className="bg-green-500 flex justify-center items-center p-2 px-4 text-white font-semibold rounded-md shadow">
                      {selectedMonth}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {data.title}
                      </h3>
                      <p className="text-gray-600">{data.description}</p>
                    </div>
                  </div>
      
                  {/* Back Side */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex justify-center items-center transform rotate-y-180 backface-hidden">
                    <button
                      className="px-4 py-2 bg-white text-blue-500 font-semibold rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
                      onClick={() => window.open(data.pdfUrls, "_blank")}
                    >
                      View PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback when no data is available
            <div className="bg-white border-2 rounded-xl p-6 w-full shadow-xl transform transition-all duration-300 hover:scale-105">
              <div className="flex flex-row gap-4 mb-4">
                <div className="bg-red-500 p-4 text-white font-semibold rounded-md shadow-md">
                  {selectedMonth}
                </div>
                <div className="flex flex-col justify-center sm:ml-4">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    No Data Found
                  </h3>
                  <p className="text-gray-600">
                    No current affairs are available for the selected month.
                    Please try another month.
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        </Fragment>
      )}

      
      </div>
  );
};
