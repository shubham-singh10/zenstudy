import React, { useEffect, useState } from 'react'
import { PreviewTest } from './PreviewTest'
import { TestSeriesCard } from './TestSeriesCard'
import { Loader } from '../loader/Loader'
import { useAuth } from '../../context/auth-context'

const testSeries = [
    {
        id: "1",
        title: "Complete General Knowledge Test Series 2024",
        description: "Master general knowledge with our comprehensive test series covering history, science, geography, and current affairs.",
        totalQuestions: 1000,
        price: 999,
        coursePrice: 2499,
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
        features: [
          "25 Full-length practice tests",
          "5000+ practice questions",
          "Detailed performance analytics",
          "Topic-wise analysis",
          "Live doubt resolution",
          "Mobile-friendly interface",
          "Download PDFs for offline practice"
        ],
        highlights: [
          "Comprehensive coverage of all topics",
          "Questions from previous year papers",
          "Expert-curated content",
          "Regular updates with new questions"
        ],
        learningOutcomes: [
          "Master fundamental concepts",
          "Improve time management skills",
          "Develop exam-taking strategies",
          "Identify and strengthen weak areas"
        ],
        tests: [
          {
            id: "t1",
            title: "History of India",
            questions: 50,
            duration: 60,
            difficulty: "Medium",
            topics: ["Ancient India", "Medieval India", "Modern India"],
            completionRate: 85,
            avgScore: 72
          },
          {
            id: "t2",
            title: "Geography Mastery",
            questions: 40,
            duration: 45,
            difficulty: "Easy",
            topics: ["Physical Geography", "Indian Geography", "World Geography"],
            completionRate: 92,
            avgScore: 78
          },
          {
            id: "t3",
            title: "Science & Technology",
            questions: 60,
            duration: 75,
            difficulty: "Hard",
            topics: ["Physics", "Chemistry", "Biology", "Technology"],
            completionRate: 68,
            avgScore: 65
          }
        ],
        courseName: "UPSC Civil Services Foundation Course",
        courseId: "upsc-101",
        lastUpdated: "2024-03-15",
        validityDays: 365
      },
      {
        id: "2",
        title: "Advanced Mathematics Test Series",
        description: "Comprehensive mathematics test series covering algebra, calculus, geometry, and more. Perfect for competitive exam preparation.",
        totalQuestions: 800,
        price: 799,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        features: [
          "20 Full-length practice tests",
          "4000+ practice questions",
          "Step-by-step solutions",
          "Performance tracking",
          "Topic-wise tests",
          "Difficulty-based practice"
        ],
        highlights: [
          "Covers all major competitive exam topics",
          "Detailed solutions for each question",
          "Progressive difficulty levels",
          "Focus on problem-solving techniques"
        ],
        learningOutcomes: [
          "Build strong problem-solving skills",
          "Master advanced mathematical concepts",
          "Improve calculation speed",
          "Learn exam-specific techniques"
        ],
        tests: [
          {
            id: "m1",
            title: "Advanced Algebra",
            questions: 40,
            duration: 60,
            difficulty: "Hard",
            topics: ["Polynomials", "Complex Numbers", "Matrices"],
            completionRate: 75,
            avgScore: 68
          },
          {
            id: "m2",
            title: "Calculus Fundamentals",
            questions: 35,
            duration: 45,
            difficulty: "Medium",
            topics: ["Differentiation", "Integration", "Applications"],
            completionRate: 82,
            avgScore: 70
          }
        ],
        lastUpdated: "2024-03-10",
        validityDays: 180
      }
]

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
              `${process.env.REACT_APP_API2}zenstudy/api/main/test-series-master/${user?._id}`,
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
            
            console.log("img",ImgData);

            console.log(data);
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
