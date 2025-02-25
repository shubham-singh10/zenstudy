import React, { useEffect, useState } from 'react'
import { PreviewTest } from './PreviewTest'
import { TestSeriesCard } from './TestSeriesCard'
import Loading from '../../Loading'

const testSeries = [
    {
        id: "1",
        title: "Complete General Knowledge Test Series 2024",
        description:
            "Master general knowledge with our comprehensive test series covering history, science, geography, and current affairs.",
        totalQuestions: 1000,
        price: 999,
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
        features: [
            "25 Full-length practice tests",
            "5000+ practice questions",
            "Detailed performance analytics",
            "Topic-wise analysis",
            "Live doubt resolution",
            "Mobile-friendly interface",
            "Download PDFs for offline practice",
        ],
        tests: [
            {
                id: "t1",
                title: "History of India",
                questions: 50,
                duration: 60,
                difficulty: "Medium",
                topics: ["Ancient India", "Medieval India", "Modern India"],
            },
            {
                id: "t2",
                title: "Geography Mastery",
                questions: 40,
                duration: 45,
                difficulty: "Easy",
                topics: ["Physical Geography", "Indian Geography", "World Geography"],
            },
            {
                id: "t3",
                title: "Science & Technology",
                questions: 60,
                duration: 75,
                difficulty: "Hard",
                topics: ["Physics", "Chemistry", "Biology", "Technology"],
            },
        ],
        courseName: "UPSC Civil Services Foundation Course",
        courseId: "upsc-101",
        includedInCourse: true,
    },
    {
        id: "2",
        title: "Current Affairs Booster Series",
        description: "Stay updated with the latest happenings around the world with our current affairs test series.",
        totalQuestions: 500,
        price: 499,
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200",
        features: [
            "10 Monthly tests",
            "2500+ practice questions",
            "Weekly current affairs PDFs",
            "Daily news analysis",
            "Personalized performance reports",
        ],
        tests: [
            {
                id: "ca1",
                title: "January Current Affairs",
                questions: 50,
                duration: 30,
                difficulty: "Medium",
                topics: ["National", "International", "Sports", "Economy"],
            },
            {
                id: "ca2",
                title: "February Current Affairs",
                questions: 50,
                duration: 30,
                difficulty: "Medium",
                topics: ["National", "International", "Sports", "Economy"],
            },
        ],
        includedInCourse: false,
    },
]

const TestSeriesIndex = () => {
    const [currentView, setCurrentView] = useState("list")
    const [selectedTest, setSelectedTest] = useState(null)
    const [testSeriess, setTestSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    const handlePreview = (test) => {
        setSelectedTest(test)
        setCurrentView("preview")
    }

    useEffect(() => {
        let isMounted = true;

        const getTestSeries = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API}zenstudy/api/main/test-series-master`,
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

                console.log(data);
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

    if(loading) {
        return <Loading />
    }

    if (currentView === "preview" && selectedTest) {
        return (
            <PreviewTest
                test={selectedTest}
                onBack={() => {
                    setCurrentView("list")
                    setSelectedTest(null)
                }}
            />
        )
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Test Series</h1>
                    <p className="text-xl text-gray-600">Enhance your preparation with our comprehensive test series</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testSeries.map((test) => (
                        <TestSeriesCard key={test.id} test={test} onPreview={() => handlePreview(test)} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TestSeriesIndex
