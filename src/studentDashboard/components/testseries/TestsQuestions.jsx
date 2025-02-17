import React, { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { GoTrophy } from "react-icons/go";
import { IoCheckmarkDone } from "react-icons/io5";
import Loading from "../../../Loading";
import { useAuth } from "../../../context/auth-context";

const questions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: 1
    },
    {
        id: 4,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        id: 5,
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correctAnswer: 2
    },
    {
        id: 6,
        question: "Which country is home to the Great Barrier Reef?",
        options: ["Brazil", "Australia", "Indonesia", "Thailand"],
        correctAnswer: 1
    },
    {
        id: 7,
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correctAnswer: 3
    },
    {
        id: 8,
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1
    },
    {
        id: 9,
        question: "What is the main component of the Sun?",
        options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
        correctAnswer: 2
    },
    {
        id: 10,
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Silver", "Iron", "Oxygen"],
        correctAnswer: 3
    }
];

export const TestQuestionsPage = ({ test }) => {
    const [questions, setquestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const [loading, setLoading] = useState(true)
    const { user } = useAuth();
    
    const handleAnswerSelect = (optionIndex) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };


    const calculateScore = () => {
        return selectedAnswers.reduce((score, answer, index) => {
            return score + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
    };

    const handleSubmit = useCallback(async (autoSubmit) => {
        if (autoSubmit === "NO" && selectedAnswers.includes(-1)) {
            alert("Please answer all questions before submitting!");
            return;
        }
        const submissionData = {
            userId: user?._id,
            testSeriesId: test._id,
            answers: questions.map((q, index) => ({
                questionId: q._id,
                selectedOption: selectedAnswers[index] !== -1 ? selectedAnswers[index] : -1
            }))
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API2}zenstudy/api/main/test-series-result`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer YOUR_USER_TOKEN_HERE`, // Replace with actual token
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();
            console.log("Submission Response:", result);

            setShowResults(true);
            setTimeLeft(-1);
        } catch (error) {
            console.error("Error submitting test:", error);
        }
        setShowResults(true);
        setTimeLeft(-1)
    }, [selectedAnswers]);

    // useEffect(() => {
    //     if (timeLeft > 0 && !showResults) {
    //         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    //         return () => clearTimeout(timer);
    //     } else if (timeLeft === 0 && !showResults) {
    //         alert("Time is up! The test is being submitted.");
    //         handleSubmit("yes");
    //     }
    // }, [timeLeft, showResults, handleSubmit]);

    useEffect(() => {
        let isMounted = true;

        const getTestSeries = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API2}zenstudy/api/main/test-series/${test._id}/questions`,
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
                    console.log("Response_Data: ", data)
                    setquestions(data)
                    setSelectedAnswers(Array(data.length).fill(-1))
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
    }, [test])

    if (loading) {
        return (<Loading />)
    }

    if (showResults) {
        const score = calculateScore();
        const correctAnswers = score;
        const wrongAnswers = selectedAnswers.filter((ans, index) => ans !== -1 && ans !== questions[index].correctAnswer).length;
        const skippedAnswers = selectedAnswers.filter(ans => ans === -1).length;
        const percentage = (score / questions.length) * 100;

        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <GoTrophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Results</h1>
                        <div className="text-5xl font-bold text-indigo-600 mb-4">{percentage}%</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-green-50 p-4 rounded-lg flex items-center">
                            <FiCheckCircle className="w-8 h-8 text-green-500 mr-3" />
                            <div>
                                <p className="text-sm text-green-600">Correct</p>
                                <p className="text-2xl font-bold text-green-700">{correctAnswers}</p>
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg flex items-center">
                            <FiXCircle className="w-8 h-8 text-red-500 mr-3" />
                            <div>
                                <p className="text-sm text-red-600">Wrong</p>
                                <p className="text-2xl font-bold text-red-700">{wrongAnswers}</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
                            <FiXCircle className="w-8 h-8 text-yellow-500 mr-3" />
                            <div>
                                <p className="text-sm text-yellow-600">Skipped</p>
                                <p className="text-2xl font-bold text-yellow-700">{skippedAnswers}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Take Test Again
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Question {currentQuestion + 1} of {questions.length}</h2>
                        <div className="text-sm font-medium text-gray-500">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} min left
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {selectedAnswers.filter(a => a !== -1).length} of {questions.length} answered
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {questions[currentQuestion].question}
                        </h3>
                        <div className="space-y-3">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswers[currentQuestion] === index
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className={`flex items-center gap-1 px-6 py-2 rounded-lg font-medium ${currentQuestion === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                }`}
                        >
                            <FiArrowLeft className="h-5 w-5" /> Previous
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={() => handleSubmit("NO")}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex gap-1 items-center"
                            >
                                <IoCheckmarkDone className="h-5 w-5" /> Submit Test
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={
                                    selectedAnswers[currentQuestion] === -1
                                }
                                className={`flex gap-1 items-center px-6 py-2 rounded-lg font-medium ${selectedAnswers[currentQuestion] === -1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                            >
                                Next <FiArrowRight className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <div
                        className={`mt-4 ${selectedAnswers[currentQuestion] === -1
                            ? "text-red-500"
                            : "text-green-500"
                            } rounded-xl`}
                    >
                        <p>
                            <strong>Selected Answer:</strong>{" "}
                            {questions[currentQuestion].options[selectedAnswers[currentQuestion]] || "Not Answered"}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex flex-wrap gap-2">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (selectedAnswers[index] !== -1 || index <= currentQuestion) {
                                        setCurrentQuestion(index);
                                    }
                                }}
                                disabled={selectedAnswers[index] === -1 && index > currentQuestion}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selectedAnswers[index] !== -1
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    } ${currentQuestion === index ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                                    } ${selectedAnswers[index] === -1 && index > currentQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

