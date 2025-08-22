import React, { useEffect, useState } from "react";
import { PreviewTest } from "./PreviewTest";
import { TestSeriesCard } from "./TestSeriesCard";
import { Loader } from "../loader/Loader";
import { useAuth } from "../../context/auth-context";
import ResourceSkeleton from "../../studentDashboard/components/free-resources/resource-skeleton";

const TestSeriesIndex = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testSeries, setTestSeries] = useState([]);
  const { user } = useAuth();

  const handlePreview = (test) => {
    setSelectedTest(test);
    setCurrentView("preview");
  };

  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/main/test-series-master/${user?._id}`,
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
        console.log("dataaaa", data);
        const ImgData = data.map((item) => ({
          ...item, // Spread the current item (not data)
          imageUrl: `${item.image}`,
        }));

        if (isMounted) {
          setTestSeries(ImgData);
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

  if (currentView === "preview" && selectedTest) {
    return (
      <PreviewTest
        test={selectedTest}
        onBack={() => {
          setCurrentView("list");
          setSelectedTest(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className=" px-40 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ResourceSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
       {testSeries.length > 0 && <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Test Series
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Comprehensive practice tests for your exam preparation
          </p>
        </div>}

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testSeries.length > 0 ? (
            testSeries.map((test) => (
              <TestSeriesCard
                key={test._id}
                test={test}
                onPreview={() => handlePreview(test)}
              />
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center bg-gray-100 p-8 rounded-xl shadow-md">
             
              <h2 className="text-xl font-semibold text-gray-700">
                No Test Series Available
              </h2>
              <p className="text-gray-500 mt-2 text-center">
                Currently there are no test series assigned to you. Please check
                back later or contact support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSeriesIndex;
