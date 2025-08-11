import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth-context";

function LiveClass() {
  const [meetingData, setMeetingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgloading, setimgLoading] = useState(true);
  const [loadingMeetingId, setLoadingMeetingId] = useState(null);
  const [userId, setUserId] = useState(null)
  const {user} = useAuth()
  
  useEffect(()=>{
    if(user){
      setUserId(user?._id)
    }
  },[user])

  const fetchMeetingDetails = useCallback(
    async (purchasedCourses) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/meeting/getMeeting`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
  
        const meetingData = response.data;
        console.log("Meeting Data:", meetingData);
        
        // Filter meetings based on purchased course IDs
        const filteredMeetings = meetingData?.filter((meeting) =>
          purchasedCourses.some(
            (purchase) => purchase.course?._id === meeting.courseId._id
          )
        );
  
        // Add image URLs for filtered meetings
        const imageData = filteredMeetings?.map((meeting) => ({
          ...meeting,
          imageUrl: meeting.thumbnailS3 || "../assets/about1.webp", // Default image if none provided
        }));
  
        setMeetingData(imageData || []);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    },
    [] // No external dependencies needed
  );
  
  const getPurchasedCourses = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/payment/purchaseCourse`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
  
      if (response.status === 204) {
        return [];
      }
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      return data.purchaseCourses || [];
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
      return [];
    }
  }, [userId]);
  
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const purchasedCourses = await getPurchasedCourses();
        await fetchMeetingDetails(purchasedCourses);
      } finally {
        setLoading(false);
      }
    };
  
    initializeData();
  }, [fetchMeetingDetails, getPurchasedCourses]);


  const onSubmit2 = async (id) => {
    setLoadingMeetingId(id);
    try {
      window.location.replace(
        `https://live.zenstudy.in/?key=${id}&user=${userId}`
      );
    } catch (error) {
      console.error("Error redirecting:", error);
    } 
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-4xl font-bold animate-pulse">Zenstudy</div>
        </div>
      ) : meetingData.length === 0 ? (
        <p className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl textdark">
          No meetings scheduled.
        </p>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center">
          {meetingData
            .sort((a, b) => {
              const currentTime = new Date();
              const isLiveA =
                currentTime >= new Date(a.startTime) &&
                currentTime <= new Date(a.endTime);
              const isLiveB =
                currentTime >= new Date(b.startTime) &&
                currentTime <= new Date(b.endTime);

              if (isLiveA && !isLiveB) return -1;
              if (!isLiveA && isLiveB) return 1;
              return 0;
            })
            .map((meeting) => {
              const currentTime = new Date();
              const startTime = new Date(meeting.startTime);
              const endTime = new Date(meeting.endTime);
              const isLive =
                currentTime >= startTime && currentTime <= endTime;
                // console.log("Meeting:", startTime);

              return (
                <div
                  className="max-w-xs space-y-4 rounded-2xl overflow-hidden shadow-lg m-4 p-4"
                  key={meeting._id}
                >
                  <div className="relative">
                    {imgloading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-2xl">
                        <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
                      </div>
                    )}
                    <img
                      src={meeting?.imageUrl || "../assets/about1.webp"}
                      crossOrigin="anonymous"
                      alt="Thumbnail"
                      className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${imgloading ? "opacity-0" : "opacity-100"
                        }`}
                      onLoad={() => setimgLoading(false)}
                    />
                  </div>

                  <div className="px-2">
                    <div className="font-bold text-sm textPurple">
                      {meeting.courseId.title}
                    </div>
                  </div>
                  <div className="px-2 flex justify-between">
                    <div className="font-bold text-sm textPurple">
                      {new Date(meeting.startTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeZone: "UTC"
                      })}
                    </div>

                    <div className="font-bold text-sm">
                      {new Date(meeting.startTime).toLocaleString("en-US", {
                        timeStyle: "short",
                        timeZone: "UTC"
                      })}
                      -
                      {new Date(meeting.endTime).toLocaleString("en-US", {
                        timeStyle: "short",
                        timeZone: "UTC"
                      })}
                    </div>
                  </div>

                  <div>
                    {isLive ? (
                      loadingMeetingId === meeting._id ? (
                        <button
                          disabled
                          className="w-full bg-red-600 cursor-not-allowed text-white text-center py-2 rounded-lg"
                        >
                          Please Wait...
                        </button>
                      ) : (
                        <button
                          onClick={() => onSubmit2(meeting._id)}
                          className="w-full bgGredient-purple animate-glow hover:scale-105 text-white text-center py-2 rounded-lg"
                        >
                          Join Live
                        </button>
                      )
                    ) : (
                      <div className="disabled w-full bg-red-600 text-white text-center py-2 rounded-lg">
                        Not Started
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default LiveClass;
