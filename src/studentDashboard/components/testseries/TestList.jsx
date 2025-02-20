import React, { useEffect, useState } from "react";
import { BiBarChart, BiBookOpen, BiTrophy } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import Loading from "../../../Loading";
import { useAuth } from "../../../context/auth-context";

function TestList({ series, onBack, onProceed, onResult }) {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ✅ Filter completed tests for the current user
  const userCompletedTests = series.completedTests.filter(
    (series) => series.userId === user?._id
  );

  const check = ({ id }) => {
    const TestCompleted = series.completedTests.filter(
      (test) => test.userId === user?._id && test.testSeriesId === id
    );
    return TestCompleted.length > 0 ? "completed" : "incomplete";
  };

  const checkSubmit = ({ id }) => {
    const TestCompleted = series.completedTests.filter(
      (test) => test.userId === user?._id && test.testSeriesId === id
    );

    if (TestCompleted.length > 0 && TestCompleted[0]?.submittedAt) {
      const formattedDate = new Date(
        TestCompleted[0].submittedAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return formattedDate;
    }

    return null; // Return null if no submission date is found
  };

  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/main/test-series/${series._id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test series");
        }

        const data = await response.json();

        console.log("Response_Data: ", data);
        if (isMounted) {
          setTestSeries(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching test series:", error);
        if (isMounted) setLoading(false);
      }
    };

    getTestSeries();

    return () => {
      isMounted = false;
    };
  }, [series]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Back to Test Series
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 md:h-64">
            <img
              src={
                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200"
              }
              alt={series.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{series.title}</h1>
              <p className="text-gray-200">{series.shortDescription}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Progress: {userCompletedTests?.length}/{series.totalTests}{" "}
                  Tests
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${
                        (userCompletedTests.length / series.totalTests) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {testSeries.map((test) => (
                <div
                  key={test._id}
                  className="lg:p-6 md:p-6 p-3 hover:shadow-md transition-shadow border-2"
                >
                  <div className="flex lg:flex-row md:flex-row flex-col items-center justify-between">
                    <div>
                    <div className="flex items-center flex-wrap lg:gap-2 md:gap-2 gap-1">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                    {test.title}{" "}
                    </h3>
                    <div className="text-xs text-purple-400 font-semibold">
                          {check({ id: test._id }) === "completed" && (
                            <>(Submitted at: {checkSubmit({ id: test._id })})</>
                          )}
                        </div>
                    </div>
                      <div className="flex flex-wrap mt-2 items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaClock className="h-4 w-4 mr-1" />
                          {Math.floor(test.duration / 60)}m {test.duration % 60}
                          s
                        </span>
                        <span className="flex items-center">
                          <BiBookOpen className="h-4 w-4 mr-1" />
                          {test.questions.length} questions
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                               ${
                                 test.difficulty === "Basic"
                                   ? "bg-green-100 text-green-800"
                                   : test.difficulty === "Medium"
                                   ? "bg-yellow-100 text-yellow-800"
                                   : test.difficulty === "Moderate"
                                   ? "bg-blue-100 text-blue-800"
                                   : "bg-purple-100 text-purple-800"
                               }`}
                        >
                          {test.difficulty}
                        </span>
                      </div>
                    </div>
                    {check({ id: test._id }) === "completed" ? (
                      <button
                        onClick={() => onResult(test)}
                        className="inline-flex lg:mt-0 md:mt-0 mt-4 items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        <BiTrophy className="mr-2 h-4 w-4" />
                        View Result
                      </button>
                    ) : (
                      <button
                        onClick={() => onProceed(test)}
                        className="inline-flex lg:mt-0 md:mt-0 mt-4 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        disabled={test.questions.length === 0}
                      >
                        <BiBarChart className="mr-2 h-4 w-4" />
                        Start Test
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestList;
