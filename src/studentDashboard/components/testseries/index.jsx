import React, { useEffect, useState } from "react";
import { TestsCard } from "./TestsCard";
import { TestsRules } from "./TestsRules";
import { TestQuestionsPage } from "./TestsQuestions";
import TestList from "./TestList";
import TestResult from "./TestResult";
import Loading from "../../../Loading";
import { useAuth } from "../../../context/auth-context";
import { useLocation, useNavigate } from "react-router-dom";

const TestSeriesIndex = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const testDetail = location.state?.testData;

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setCurrentView("testList");
  };

  const handleTestSeries = (test) => {
    // console.log("test", test);
    setSelectedSeries(test);
    setCurrentView("rules");
  };

  const handleTestSeriesResult = (test) => {
    setSelectedSeries(test);
    setCurrentView("testResult");
  };
  const handleStartTest = () => {
    setCurrentView("test");
  };

  useEffect(() => {
    if (testDetail) {
      setSelectedTest(testDetail);
      setCurrentView("testList");

      // Clear state so refresh/back won’t keep it
      navigate(location.pathname, { replace: true });
    }
  }, [testDetail, location.pathname, navigate]);

  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      if (!user?._id) return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/payment/purchaseCourse`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?._id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test series");
        }

        const data = await response.json();
        // console.log("Response_Data", data);

        if (isMounted) {
          setTestSeries(data.purchasedTestSeries);
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
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (currentView === "list") {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold textPurpleGradient mb-4">
              Available Test Series
            </h1>
            <p className="text-lg textPurple">
              Select a test series to begin your assessment
            </p>
          </div>

          {/* Test Series List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testSeries && testSeries.length > 0 ? (
              testSeries.map((test) => (
                <TestsCard
                  key={test.test_series._id}
                  test={test.test_series}
                  onProceed={() => handleTestSelect(test)}
                />
              ))
            ) : (
              /* No Test Available Message */
              <div className="w-full col-span-2 flex flex-col items-center bg-red-300 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800">
                  No Test Series Available
                </h2>
                <p className="text-gray-600 text-center mt-2">
                  No test series are currently scheduled. Please check back
                  later for upcoming tests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "rules" && selectedSeries) {
    return (
      <TestsRules
        test={selectedSeries}
        onStart={handleStartTest}
        onBack={() => setCurrentView("testList")}
      />
    );
  }

  if (currentView === "testList" && selectedTest) {
    return (
      <TestList
        series={selectedTest.test_series || selectedTest}
        onBack={() => setCurrentView("list")}
        onProceed={handleTestSeries}
        onResult={handleTestSeriesResult}
      />
    );
  }

  if (currentView === "testResult" && selectedSeries) {
    return (
      <TestResult
        series={selectedSeries}
        onBack={() => setCurrentView("testList")}
      />
    );
  }

  return <TestQuestionsPage series={selectedTest} test={selectedSeries} />;
};

export default TestSeriesIndex;
