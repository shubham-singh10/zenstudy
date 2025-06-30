import axios from "axios";
import React, { useState, useRef, Fragment, useEffect } from "react";
import { Loader } from "../../../components/loader/Loader";

const MonthlyAffairs = () => {
  const currentMonth = new Date().getMonth() + 1; 
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const monthCardRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthName, setMonthName] = useState(null);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchCA = async () => {
      setIsLoading(true);
      setCurrentAffairs([]);

      try {
        const sendData = {
          month: selectedMonth,
          year: selectedYear,
        };
        // console.log("send", sendData);

        const response = await axios.post(
          `${process.env.REACT_APP_API}zenstudy/api/image/getAffairswithMonth`,
          sendData
        );

        const data = response.data;

        if (data.message === "Success") {
          const mainData = data.data;
          setCurrentAffairs(mainData);
          
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCA();
  }, [selectedMonth, selectedYear]); // Trigger fetch when selectedDate or view changes

  // Month list with styling
   const months = [
    { name: "JAN", color: "bg-purple-300", monthNo: 1 },
    { name: "FEB", color: "bg-blue-600", monthNo: 2 },
    { name: "MAR", color: "bg-sky-300", monthNo: 3 },
    { name: "APR", color: "bg-blue-500", monthNo: 4 },
    { name: "MAY", color: "bg-rose-200", monthNo: 5 },
    { name: "JUN", color: "bg-violet-300 ", monthNo: 6 },
    { name: "JUL", color: "bg-gray-200", monthNo: 7 },
    { name: "AUG", color: "bg-green-300", monthNo: 8 },
    { name: "SEP", color: "bg-purple-300", monthNo: 9 },
    { name: "OCT", color: "bg-rose-400", monthNo: 10 },
    { name: "NOV", color: "bg-green-300", monthNo: 11 },
    { name: "DEC", color: "bg-sky-300", monthNo: 12 },
  ];

  // const formatDate = (date) => {
  //   const options = { day: "numeric", month: "long", year: "numeric" }; // Format for Jan, 2024
  //   const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
  //     new Date(date)
  //   );
  //   return formattedDate;
  // };

  // Handle month click and scroll into view
  const handleMonthClick = (monthNo, monthName) => {
    setSelectedMonth(monthNo);
    setMonthName(monthName);

    setTimeout(() => {
      if (monthCardRef.current) {
        monthCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  return (
    <div className="p-4">
      {/* Header */}
        <div className="flex items-center justify-center mb-14">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold textPurpleGradient">
          Choose Month And Year:
        </h1>
        <div className="ml-4 bgGredient-purple p-1 rounded-lg ">
          <label
            htmlFor="year"
            className="text-lg font-medium text-white"
          ></label>
          <select
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="lg:p-2 md:p-2 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#543a5d]"
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
            className={`w-32 h-20  ${ selectedMonth === month.monthNo && "scale-125 border-2 border-[#efdb78]"} rounded-lg shadow-lg textGreen font-bold text-xl hover:scale-105 transition-all duration-300 bg-transparent border-2 border-[#543a5d]`}
          >
          
            {month.name}
          </button>
        ))}
      </div>
      {selectedMonth && (
              <Fragment>
                {/* Check if data exists for the selected month */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-10 md:p-6 lg:p-14"
                  ref={monthCardRef}
                >
                  {isLoading ? (
                  
                    <Loader fill="black" />
                  
                  ) : currentAffairs.length > 0 ? (
                    currentAffairs.map((data, idx) => (
                      <div
                        key={idx}
                        className="relative w-full bg-white border-2 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {/* Card Content */}
                        <div className="flex flex-col items-center gap-4">
                          {/* Month and Year */}
                          <div className="bgGredient-purple-lr text-white font-semibold text-lg px-6 py-4 rounded-md shadow">
                          {new Date(data.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).replace(",", "")}
                          </div>
                          <p className="text-gray-600 text-sm text-center">
                            Access the latest current affairs for {new Date(data.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).replace(",", "")}.
                          </p>
                        </div>
      
                        {/* View PDF Button (hidden by default, visible on hover) */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl">
                          <button
                            className="px-6 py-3 bg-white textGreen font-semibold rounded-lg bg-gradient-to-r hover:from-[#343e25] hover:to-[#5d6e53]  hover:text-white transition duration-300 shadow-md"
                            onClick={() => window.open(data.pdfUrl, "_blank")}
                          >
                            View PDF
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback when no data is available
                    <div className="bg-white border-2 rounded-xl p-6 w-full shadow-xl transform transition-all duration-300 hover:scale-105">
                      <div className="flex flex-row gap-4 mb-4">
                        <div className="bgGredient-purple-lr p-4 text-white font-semibold rounded-md shadow-md">
                          {monthName}, {selectedYear}
                        </div>
                        <div className="flex flex-col justify-center sm:ml-4">
                          <h3 className="font-bold text-xl textPurple mb-2">
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

export default MonthlyAffairs;
