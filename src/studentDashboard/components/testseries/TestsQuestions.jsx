import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiSkipForward,
  FiXCircle,
} from "react-icons/fi";
import { GoTrophy } from "react-icons/go";
import { IoCheckmarkDone } from "react-icons/io5";
import Loading from "../../../Loading";
import { useAuth } from "../../../context/auth-context";
import Swal from "sweetalert2";

export const TestQuestionsPage = ({ test, series }) => {
  const [questions, setquestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testloading, setTestLoading] = useState(false);
  const { user } = useAuth();
  const timerRef = useRef(null);
  const timeLeftRef = useRef(0);

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
  const submitTest = useCallback(async () => {
    const submissionData = {
      userId: user?._id,
      testSeriesId: test._id,
      testSeriedMasterId: series.test_series._id,
      answers: questions.map((q, index) => ({
        questionId: q._id,
        selectedOption:
          selectedAnswers[index] !== -1 ? selectedAnswers[index] : -1,
      })),
    };

    try {
      setTestLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API}zenstudy/api/main/test-series-result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const result = await response.json();
      console.log("Test Result: ", result);
      setTestResult(result.resultSummary);
      setShowResults(true);
      setTimeLeft(-1);
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setTestLoading(false);
    }
  }, [questions, selectedAnswers, test, user, series]);

  const handleSubmit = useCallback(async (autoSubmit) => {
      const skippedQuestions = selectedAnswers.filter(ans => ans === -1).length;

      if (autoSubmit === "NO" && skippedQuestions > 0) {
          Swal.fire({
              title: "Some Questions Are Skipped!",
              text: `You have ${questions.length} questions, and you skipped ${skippedQuestions}. Are you sure you want to submit?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, Submit Test",
              cancelButtonText: "No, Go Back",
          }).then((result) => {
              if (result.isConfirmed) {
                  submitTest();
              }
          });
      } else {
          submitTest();
      }
  }, [selectedAnswers, questions.length, submitTest]);

  useEffect(() => {
      if (!test) return;

      const initialTime = test?.duration ? test.duration * 60 : 120 * 60;
      setTimeLeft(initialTime);
      timeLeftRef.current = initialTime;

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
          if (timeLeftRef.current > 0) {
              timeLeftRef.current -= 1;
              setTimeLeft(timeLeftRef.current);
          } else {
              clearInterval(timerRef.current);
              Swal.fire({
                  title: "Time is Up!",
                  text: "Your test time has ended. Submitting now...",
                  icon: "warning",
                  confirmButtonText: "OK",
              }).then(() => {
                  handleSubmit("YES");
              });
          }
      }, 1000);

      return () => clearInterval(timerRef.current);
  }, [test, handleSubmit]);

  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/main/test-series/${test._id}/questions`,
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
          // console.log("Response_Data: ", data)
          setquestions(data);
          setSelectedAnswers(Array(data.length).fill(-1));
          setLoading(false);
          console.log("Test Questions: ", data);
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
    return <Loading />;
  }

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = score;
    const wrongAnswers = selectedAnswers.filter(
      (ans, index) => ans !== -1 && ans !== questions[index].correctAnswer
    ).length;
    const skippedAnswers = selectedAnswers.filter((ans) => ans === -1).length;
    // const percentage = ((score / questions.length) * 100).toFixed(2);

    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto bg-purple-50 rounded-xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <GoTrophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Test Results
            </h1>
            <div className="text-5xl font-bold textPurple mb-4">
              {testResult.scorePercentage}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg flex items-center">
              <FiCheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-green-600">Correct</p>
                <p className="text-2xl font-bold text-green-700">
                  {correctAnswers}
                </p>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg flex items-center">
              <FiXCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-red-600">Wrong</p>
                <p className="text-2xl font-bold text-red-700">
                  {wrongAnswers}
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
              <FiXCircle className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-yellow-600">Skipped</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {skippedAnswers}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bgGredient-green textGold py-3 rounded-lg font-semibold hover:scale-105 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-purple-50 rounded-xl shadow-lg p-6 sm:p-8 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold textPurple">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div
              className={`text-sm font-medium ${
                timeLeft <= 30
                  ? "text-red-500 font-bold animate-pulse"
                  : "text-gray-500"
              }`}
            >
              {timeLeft > 60 ? (
                <>
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")} min left
                </>
              ) : (
                <>
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")} seconds left
                </>
              )}
            </div>

            <div className="text-sm font-medium text-gray-500">
              {selectedAnswers.filter((a) => a !== -1).length} of{" "}
              {questions.length} answered
            </div>
          </div>

          <div className="mb-6">
            <h3
              className="text-lg font-medium textPurple mb-4"
              dangerouslySetInnerHTML={{
                __html: questions[currentQuestion].question,
              }}
            ></h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-[#543a5d] bg-purple-50 textPurple"
                      : "border-gray-200 hover:border-[#543a5d] hover:bg-purple-50"
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
              className={`flex items-center gap-1 px-6 py-2 rounded-lg font-medium ${
                currentQuestion === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bgGredient-green textGold hover:scale-105"
              }`}
            >
              <FiArrowLeft className="h-5 w-5" /> Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => handleSubmit("NO")}
                disabled={testloading}
                className="px-6 py-2 bgGredient-purple text-white rounded-lg font-medium hover:scale-105 flex gap-1 items-center"
              >
                <IoCheckmarkDone className="h-5 w-5" /> Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`flex gap-1 items-center px-6 py-2 rounded-lg font-medium ${
                  selectedAnswers[currentQuestion] === -1
                    ? "bg-gray-300 text-gray-500 hover:scale-105 hover:bg-gray-700 hover:text-white"
                    : "bgGredient-purple-lr text-white hover:scale-105"
                }`}
              >
                {selectedAnswers[currentQuestion] === -1 ? (
                  <span className="flex items-center gap-1">
                    Skip <FiSkipForward className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    Next <FiArrowRight className="h-5 w-5" />
                  </span>
                )}
              </button>
            )}
          </div>
          <div
            className={`mt-4 ${
              selectedAnswers[currentQuestion] === -1
                ? "text-red-500"
                : "textGreen"
            } rounded-xl`}
          >
            <p>
              <strong>Selected Answer:</strong>{" "}
              {questions[currentQuestion].options[
                selectedAnswers[currentQuestion]
              ] || "Not Answered"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestion(index);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedAnswers[index] !== -1
                    ? "bgGredient-green textGold"
                    : "bg-gray-200 text-gray-600"
                } ${
                  currentQuestion === index
                    ? "ring-2 ring-[#5d6e53] ring-offset-2"
                    : ""
                }`}
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
