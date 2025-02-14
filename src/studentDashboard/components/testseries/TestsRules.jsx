import React, { useEffect, useState } from 'react'
import { BiBook } from 'react-icons/bi'
import { FiAlertCircle, FiAward, FiClock, FiXCircle } from 'react-icons/fi'
import { LuCheckCircle2 } from 'react-icons/lu'
import Loading from '../../../Loading'

export const TestsRules = ({ test, onStart, onBack }) => {
    const [score, setscore] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;

        const getTestSeries = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API2}zenstudy/api/main/test-series-score/${test._id}`,
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
                    setscore(data);
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
    }, [test]);

    if (loading) {
        return (<Loading />)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center mb-8">
                    <FiAward className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{test.title}</h1>
                    <p className="text-gray-600">Please read the following rules carefully before starting the test</p>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-indigo-900 mb-3">Test Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <FiClock className="w-5 h-5 text-indigo-500 mr-2" />
                                <span>Duration: {test.duration} minutes</span>
                            </div>
                            <div className="flex items-center">
                                <BiBook className="w-5 h-5 text-indigo-500 mr-2" />
                                <span>Total Questions: {test.questions.length}</span>
                            </div>
                            <div className="flex items-center">
                                <LuCheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                <span>Correct Answer: +{score?.correctPoints} marks</span>
                            </div>
                            <div className="flex items-center">
                                <FiXCircle className="w-5 h-5 text-red-500 mr-2" />
                                <span>Wrong Answer: {score?.incorrectPoints} mark</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Important Rules</h2>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <FiAlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                                <p className="text-gray-600">Once you start the test, the timer cannot be paused or reset.</p>
                            </div>
                            <div className="flex items-start">
                                <FiAlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                                <p className="text-gray-600">You must complete all questions within the allocated time.</p>
                            </div>
                            <div className="flex items-start">
                                <FiAlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                                <p className="text-gray-600">You can review and change your answers before final submission.</p>
                            </div>
                            <div className="flex items-start">
                                <FiAlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                                <p className="text-gray-600">Unattempted questions will be marked as {score?.unattemptedPoints}.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Back to Tests
                    </button>
                    <button
                        onClick={onStart}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Start Test
                    </button>
                </div>
            </div>
        </div>
    )
}
