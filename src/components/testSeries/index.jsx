import React, { useEffect, useState } from 'react'
import { PreviewTest } from './PreviewTest'
import { TestSeriesCard } from './TestSeriesCard'
import { Loader } from '../loader/Loader'
import { useAuth } from '../../context/auth-context'


const TestSeriesIndex = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testSeries, setTestSeries] = useState([]);
  const { user } = useAuth();

  const handlePreview = (test) => {
    setSelectedTest(test);
    setCurrentView('preview');
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

        const ImgData = data.map((item) => ({
          ...item, // Spread the current item (not data)
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/gettestSeriesImage/${item.image}`,
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


  if (currentView === 'preview' && selectedTest) {
    return (
      <PreviewTest
        test={selectedTest}
        onBack={() => {
          setCurrentView('list');
          setSelectedTest(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader fill="#000" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Test Series</h1>
          <p className="text-base sm:text-lg text-gray-600">Comprehensive practice tests for your exam preparation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testSeries.map(test => (
            <TestSeriesCard
              key={test._id}
              test={test}
              onPreview={() => handlePreview(test)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestSeriesIndex
