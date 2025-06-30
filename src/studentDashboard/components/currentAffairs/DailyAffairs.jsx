import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";
import { Loader } from "../../../components/loader/Loader";

function DailyAffairs() {
  const [selectedDate, setSelectedDate] = useState(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
          `${process.env.REACT_APP_API}zenstudy/api/image/getAffairswithDate`,
          { date: formattedDate2 }
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
  }, [selectedDate, formattedDate2]);

  return (
    <Fragment>
      <div>
        {/* Current Affairs Content */}
        <div className="flex lg:flex-row flex-col-reverse md:flex-row lg:p-10 md:p-6 p-4 justify-between gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
            {isLoading ? (
              <Loader fill="black" />
            ) : currentAffairs && currentAffairs.length > 0 ? (
              currentAffairs.map((data, index) => (
                <div
                key={index}
                className="relative w-full bg-gradient-to-r from-gray-100 to-white border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Card Title */}
                <h2 className="text-xl font-bold textPurple mb-4">
                  Daily Current Affairs
                </h2>
              
                {/* Card Content */}
                <div className="flex flex-col items-center gap-4">
                  <div className="bgGredient-purple-lr text-white flex justify-center items-center w-full px-6 py-4 font-semibold rounded-lg shadow-md">
                    {formattedDate}
                  </div>
                  <p className="textdrak text-sm text-center">
                    Stay updated with the latest current affairs for your competitive exams.
                  </p>
                </div>
              
                {/* View PDF Button (hidden by default, visible on hover) */}
                <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <button
                    className="px-6 py-3 bg-white textGreen font-semibold rounded-lg bg-gradient-to-r hover:from-[#343e25] hover:to-[#5d6e53] hover:text-white transition duration-300 shadow-md"
                    onClick={() => window.open(data.pdfUrl, "_blank")}
                  >
                    View PDF
                  </button>
                </div>
              </div>
              ))
            ) : (
              <div className="bg-purple-50 border-2 rounded-xl p-6 w-full shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="flex flex-row gap-4 mb-4">
                  <div className="bgGredient-purple p-4 text-white font-semibold rounded-md shadow-md">
                    {formattedDate}
                  </div>
                  <div className="flex flex-col justify-center sm:ml-4">
                    <h3 className="font-bold text-xl textPurple mb-2">
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
              className="font-semibold px-8 py-3 border-2 border-[#543a5d] bgGredient-purple-lr text-white rounded-md shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
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
                  maxDate={new Date()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default DailyAffairs;
