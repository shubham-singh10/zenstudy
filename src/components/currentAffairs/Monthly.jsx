import axios from 'axios';
import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Loader } from '../loader/Loader';

export const Monthly = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const monthCardRef = useRef(null); 
  const [selectedYear, setSelectedYear] = useState(2024);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthName, setMonthName]= useState(null);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchCA = async () => {
      setIsLoading(true);
      setCurrentAffairs([]);

      try {
        const sendData  = {
          month:selectedMonth,
          year : selectedYear,
        }
        console.log("send", sendData);
        
        const response = await axios.post(
          `${process.env.REACT_APP_API}/zenstudy/api/image/getAffairswithMonth`,
          sendData
        );

        const data = response.data;
        console.log("data", data);
        
        if (data.message === "Success") {
          const mainData = data.data;

          // Update pdfUrls dynamically
          const filterData = mainData.map(item => ({
            ...item,
            pdfUrls: `${process.env.REACT_APP_API}/zenstudy/api/image/getpdf/${item.pdfUrl}`,
          }));

          console.log("Filtered Data:", filterData);
          setCurrentAffairs(filterData);
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCA();
  }, [selectedMonth, selectedYear]); // Trigger fetch when selectedDate or view changes


  // Month list with styling
  const months = [
    { name: 'JAN', color: 'bg-yellow-300', monthNo: 1 },
    { name: 'FEB', color: 'bg-blue-600', monthNo: 2},
    { name: 'MAR', color: 'bg-sky-300', monthNo: 3},
    { name: 'APR', color: 'bg-blue-500', monthNo: 4},
    { name: 'MAY', color: 'bg-gray-200', monthNo: 5},
    { name: 'JUN', color: 'bg-slate-700 text-white', monthNo: 6},
    { name: 'JUL', color: 'bg-gray-200', monthNo: 7},
    { name: 'AUG', color: 'bg-yellow-300', monthNo: 8},
    { name: 'SEP', color: 'bg-purple-300', monthNo: 9},
    { name: 'OCT', color: 'bg-rose-400', monthNo: 10},
    { name: 'NOV', color: 'bg-green-300', monthNo: 11},
    { name: 'DEC', color: 'bg-yellow-300', monthNo: 12},
  ];

  const formatDate = (date) => {
    const options = {day:'numeric', month: 'long', year: 'numeric' }; // Format for Jan, 2024
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    console.log(formattedDate);
    return formattedDate;
  }

  // Handle month click and scroll into view
  const handleMonthClick = (monthNo,monthName) => {
    setSelectedMonth(monthNo);
    setMonthName(monthName)

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
      <div className="flex items-center justify-center mb-14">
      <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-blue-600">Choose Month And Year:</h1>
      <div className="ml-4 bg-blue-500 p-1 rounded-lg ">
        <label htmlFor="year" className="text-lg font-medium text-white">
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
          className="lg:p-2 md:p-2 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>
    </div>

      {/* Month Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center">
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => handleMonthClick(month.monthNo, month.name)}
            className={`w-32 h-20  rounded-lg shadow-lg text-black font-bold text-xl hover:scale-105 transition-all duration-300 ${month.color}`}
          >
            {month.name}
          </button>
        ))}
      </div>

     
      {selectedMonth && (
        <Fragment>
          {/* Check if data exists for the selected month */}
          <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-10  md:p-6 lg:p-14" ref={monthCardRef}>
          {isLoading ? (
                        <Loader fill="black" />
                      ) :currentAffairs.length > 0 ? (
            currentAffairs.map((data, idx) => (
              <div key={idx} className=" relative group perspective w-full">
                {/* Card Wrapper */}
                <div className="relative w-full min-h-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">
                  {/* Front Side */}
                  <div className="backface-hidden justify-center bg-white border-2 rounded-xl p-6 shadow-md flex flex-row gap-4">
                      <div className="bg-green-500 flex justify-center items-center w-full px-6 py-6 text-white font-semibold rounded-md shadow">
                        {formatDate(data.date)}
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
                {monthName}, {selectedYear}
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
