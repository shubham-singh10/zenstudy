import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function LiveClass() {
  const [meetingData, setMeetingData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgloading, setimgLoading] = useState(true);
  const [loadingMeetingId, setLoadingMeetingId] = useState(null); // Track the specific meeting loading
  const token = Cookies.get("access_tokennew");

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API2}zenstudy/api/meeting/getMeeting`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        const imageData = data?.map((meeting) => ({
          ...meeting,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${meeting.courseId.thumbnail}`,
        }));

        setMeetingData(imageData);
      } catch (error) {
        let errorMessage = "An error occurred. Please try again.";
        if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          errorMessage =
            "No response from server. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();
  }, []);

  const onSubmit2 = async (id) => {
    setLoadingMeetingId(id); // Set the current meeting as loading
    try {
      window.location.replace(
        `https://live.zenstudy.in/?key=${id}&user=${token}`
      );
    } catch (error) {
      console.error("Error redirecting:", error);
    } finally {
      setLoadingMeetingId(null); // Reset loading state if needed
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : meetingData.length === 0 ? (
        <p className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl text-gray-500">
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
                      className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${
                        imgloading ? "opacity-0" : "opacity-100"
                      }`}
                      onLoad={() => setimgLoading(false)}
                    />
                  </div>

                  <div className="px-2">
                    <div className="font-bold text-sm text-blue-600">
                      {meeting.courseId.title}
                    </div>
                  </div>
                  <div className="px-2 flex justify-between">
                    <div className="font-bold text-sm text-blue-600">
                      {new Date(meeting.startTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                      })}
                    </div>

                    <div className="font-bold text-sm">
                      {new Date(meeting.startTime).toLocaleString("en-US", {
                        timeStyle: "short",
                      })}
                      -
                      {new Date(meeting.endTime).toLocaleString("en-US", {
                        timeStyle: "short",
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
                          className="w-full bg-blue-600 animate-glow text-white text-center py-2 rounded-lg"
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
