import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";

// Main CurrentAffair component
function CurrentAffair() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [CurrentAffairs, setCurrentAffairs] = useState([]);
  
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Format the date

  const formattedDate2 = `${selectedDate.getDate().toString().padStart(2, "0")}-${(selectedDate.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${selectedDate.getFullYear()}`;

  console.log("dare", formattedDate2);
  
  useEffect(()=>{
    
    const fetchCA = async()=>{
      setCurrentAffairs([])
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}/zenstudy/api/image/getAffairswithDate`,{
          date: formattedDate2
        });
        const data = response.data;
        if(data.message === "Success"){
          setCurrentAffairs(data.data);
        }
        console.log("res", data);
        
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchCA();
  },[selectedDate])

  console.log("ca", CurrentAffairs);
  

  return (
    <Fragment>
      <div className="p-4 sm:p-6 md:p-12 min-h-screen bg-gray-50">
        <div className="flex flex-row gap-6 my-4 justify-center">
          <button className=" w-[50%] font-semibold rounded-md py-3 border-2 border-green-500 text-green-500 bg-white shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300 ease-in-out">
            Monthly
          </button>
          <button className="w-[50%] font-semibold rounded-md py-3 border-2 border-blue-500 text-blue-500 bg-white shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out">
            Daily
          </button>
        </div>

        <div className="flex lg:flex-row flex-col-reverse md:flex-row  lg:p-10 md:p-6 p-4  justify-between gap-6">

        <div className="flex flex-col gap-4">
          {(CurrentAffairs && CurrentAffairs.length > 0) ? (CurrentAffairs.map((data, index)=>(
              <div className=" bg-white border-2 rounded-xl p-6 w-full  shadow-xl transform transition-all duration-300 hover:scale-105">
              <div className="flex flex-row gap-4 mb-4">
                <div className="bg-green-500 p-4 text-white font-semibold rounded-md shadow-md">
                  {formattedDate}
                </div>
                <div className="flex flex-col justify-center sm:ml-4">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">TODAY'S CA ON GO</h3>
                  <p className="text-gray-600">
                    Read our weekly current affairs tailored just for you and get
                    the latest updates.
                  </p>
                </div>
              </div>
            </div>
          ))):(
            <div>No data found</div>
          )}
          </div>

          <div className="relative flex flex-col mx-auto  mt-6 items-center w-[30%] ">
            <button
              className="font-semibold px-8 py-3 border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Select Date
            </button>
            {showDatePicker && (
              <div className="absolute mt-4 z-10 shadow-lg p-8 sm:p-8 rounded-md bg-white">
                <div className="absolute top-0 right-0 p-2 cursor-pointer" onClick={() => setShowDatePicker(false)}>
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
                    setShowDatePicker(false); // Close the DatePicker after selecting the date
                  }}
                  inline // Displays the calendar directly
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
