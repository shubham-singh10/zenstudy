import React, { useEffect, useState } from 'react'
import { TestsCard } from './TestsCard'
import { TestsRules } from './TestsRules';
import { TestQuestionsPage } from './TestsQuestions';
import Loading from '../../../Loading';

const TestSeriesIndex = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTest, setSelectedTest] = useState(null);
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true)

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setCurrentView('rules');
  };
  const handleStartTest = () => {
    setCurrentView('test');
  };

  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {

        const response = await fetch(
          `${process.env.REACT_APP_API2}zenstudy/api/main/test-series`,
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
  }, []);


  if (loading) {
    return <Loading />
  }

  if (currentView === 'list') {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Test Series</h1>
            <p className="text-lg text-gray-600">Select a test series to begin your assessment</p>
          </div>

          {/* Test Series List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testSeries && testSeries.length > 0 ? (
              testSeries.map((test) => (
                test?.status === "s" && <TestsCard
                  key={test._id}
                  test={test}
                  onProceed={() => handleTestSelect(test)}
                />
              ))
            ) : (
              /* No Test Available Message */
              <div className="w-full col-span-2 flex flex-col items-center bg-red-300 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800">No Test Series Available</h2>
                <p className="text-gray-600 text-center mt-2">
                  No test series are currently scheduled. Please check back later for upcoming tests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    )
  }

  if (currentView === 'rules' && selectedTest) {
    return (
      <TestsRules
        test={selectedTest}
        onStart={handleStartTest}
        onBack={() => setCurrentView('list')}
      />
    );
  }

  return (
    <TestQuestionsPage
      test={selectedTest}
    />
  )
}

export default TestSeriesIndex