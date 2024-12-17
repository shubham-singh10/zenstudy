import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";
import { Loader } from "./loader/Loader";

function CurrentAffair() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("daily");  // Default to 'daily' view

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate2 = `${selectedDate
    .getDate()
    .toString()
    .padStart(2, "0")}-${(selectedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${selectedDate.getFullYear()}`;

  // Fetch Current Affairs Data based on the selected date and view (Monthly/Daily)
  useEffect(() => {
    const fetchCA = async () => {
      setIsLoading(true);
      setCurrentAffairs([]);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/zenstudy/api/image/getAffairswithDate`,
          { date: formattedDate2 }
        );

        const data = response.data;
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
  }, [selectedDate, view]); // Trigger fetch when selectedDate or view changes

  // Handle view change (Monthly/Daily)
  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <Fragment>
      <div className="p-4 sm:p-6 md:p-12 min-h-screen bg-gray-50">
        {/* View Buttons */}
        <div className="flex flex-row gap-6 my-4 justify-center">
          <button
            className={`w-[50%] font-semibold rounded-md py-3 border-2 ${view === "monthly" ? "border-green-500 text-green-500" : "border-gray-500 text-gray-500"} bg-white shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300 ease-in-out`}
            onClick={() => handleViewChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={`w-[50%] font-semibold rounded-md py-3 border-2 ${view === "daily" ? "border-blue-500 text-blue-500" : "border-gray-500 text-gray-500"} bg-white shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out`}
            onClick={() => handleViewChange("daily")}
          >
            Daily
          </button>
        </div>

        {/* Current Affairs Content */}
        <div className="flex lg:flex-row flex-col-reverse md:flex-row lg:p-10 md:p-6 p-4 justify-between gap-6">
          <div className="flex flex-col gap-4 w-full">
            {isLoading ? (
              <Loader fill="black" />
            ) : currentAffairs && currentAffairs.length > 0 ? (
              currentAffairs.map((data, index) => (
                <div key={index} className="relative group perspective w-full">
                  {/* Card Wrapper */}
                  <div className="relative w-full min-h-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">
                    {/* Front Side */}
                    <div className="backface-hidden  bg-white border-2 rounded-xl p-6 shadow-md flex flex-row gap-4">
                      <div className="bg-green-500 flex justify-center items-center p-2 px-4 text-white font-semibold rounded-md shadow">
                        {formattedDate}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">{data.title}</h3>
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
              <div className="bg-white border-2 rounded-xl p-6 w-full shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="flex flex-row gap-4 mb-4">
                  <div className="bg-red-500 p-4 text-white font-semibold rounded-md shadow-md">
                    {formattedDate}
                  </div>
                  <div className="flex flex-col justify-center sm:ml-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      No Data Found
                    </h3>
                    <p className="text-gray-600">
                      No current affairs are available for the selected date.
                      Please try another date.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="relative flex flex-col mx-auto mt-6 items-center w-[30%]">
            <button
              className="font-semibold px-8 py-3 border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Select Date
            </button>
            {showDatePicker && (
              <div className="absolute mt-4 z-10 shadow-lg p-8 sm:p-8 rounded-md bg-white">
                <div
                  className="absolute top-0 right-0 p-2 cursor-pointer"
                  onClick={() => setShowDatePicker(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600 hover:text-gray-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  inline
                  className="rounded-md border-2 border-gray-300 shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CurrentAffair;
