import React, { Fragment, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { GoTrophy } from "react-icons/go";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiDownload,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { Loader } from "../../../components/loader/Loader";

const TestResult = ({series, onBack}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const pdfRef = useRef();
  const { user } = useAuth();
  console.log("User:", series);
  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/main/test-series-result/${user._id}/${series._id}`,
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
        console.log("res",data);

        if (isMounted) {
          setResult(data);
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
  }, [user, series]);

  const downloadPDF = () => {
    const input = pdfRef.current; // Get the reference to div

    if (!input) {
      console.error("PDF content not found!");
      return;
    }

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 0;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        yPosition -= pageHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }

      pdf.save("test_results.pdf");
    });
  };

  if (loading) {
    return  (
      <div className="flex items-center justify-center h-screen">
      <Loader fill="black" />
    </div>)
  }

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
        
        <div className="mt-8 text-center">
            <button  onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
              <FiArrowLeft className="h-5 w-5 mr-2" />
              Back to Test Series
            </button>
          </div>
        
        {/* Summary Card */}

          <div className="bg-white  rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="text-center mb-8">
              <GoTrophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Test Results
              </h1>
              <div className="text-5xl font-bold text-indigo-600 mb-4">
                {((result?.score / result?.maxScore) * 100).toFixed(2)}%
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-xl font-semibold text-gray-700">
                  Total Marks:{" "}
                  <span className="text-indigo-600">{result?.score}</span> / {result?.maxScore}
                </p>

                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-5 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:from-indigo-700 hover:to-indigo-800"
                >
                  <FiDownload className="w-6 h-6" />
                  <span>Download Results PDF</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg flex items-center">
                <FiCheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-green-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result?.correctQuestions}
                  </p>
                  <p className="text-sm text-green-600">
                    +{result?.correctQuestions * result?.correctPoints} marks
                  </p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex items-center">
                <FiXCircle className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-red-600">Wrong Answers</p>
                  <p className="text-2xl font-bold text-red-700">
                    {result?.incorrectQuestions}
                  </p>
                  <p className="text-sm text-red-600">
                    {result?.incorrectQuestions * result?.incorrectPoints} marks
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <FiAlertCircle className="w-8 h-8 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Unattempted</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {result?.unattemptedQuestions}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result?.unattemptedQuestions * result?.unattemptedPoints}{" "}
                    marks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Question-wise Analysis */}
          <div ref={pdfRef} className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">
              Question-wise Analysis
            </h2>
            <div className="space-y-6">
              {result &&
                result?.selectedAnswers.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 shadow-md bg-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {item.question}
                      </h3>

                      {/* Points Display */}
                      {item.selectedAnswer === item.correctAnswer ? (
                        <div className="flex items-center text-green-600">
                          <FiCheckCircle className="w-5 h-5 mr-1" />
                          <span className="text-xs font-medium">
                            +{result.correctPoints} marks
                          </span>
                        </div>
                      ) : item.selectedAnswer === "Not Answered" ? (
                        <div className="flex items-center text-gray-600">
                          <FiAlertCircle className="w-5 h-5 mr-1" />
                          <span className="text-xs font-medium">
                            {result.unattemptedPoints} marks
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <FiX className="w-5 h-5 mr-1" />
                          <span className="text-xs font-medium">
                            {result.incorrectPoints} marks
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {item.options.map((option, i) => {
                        const isCorrect = option === item.correctAnswer;
                        const isSelected = option === item.selectedAnswer;
                        const isWrong = isSelected && !isCorrect;

                        return (
                          <li
                            key={i}
                            className={`p-5 rounded-lg border flex items-center justify-between ${
                              isCorrect
                                ? "bg-green-100 border-green-500 text-green-700"
                                : isWrong
                                ? "bg-red-100 border-red-500 text-red-700"
                                : "border-gray-300"
                            }`}
                          >
                            <span>{option}</span>

                            {isCorrect ? (
                              <FiCheckCircle className="w-5 h-5" />
                            ) : isWrong ? (
                              <FiX className="w-5 h-5" />
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-3 flex flex-wrap gap-2 justify-between">
                      <p className="text-sm">
                        ✅{" "}
                        <span className="font-semibold">Correct Answer:</span>{" "}
                        <span className="text-green-600">
                          {item.correctAnswer}
                        </span>
                      </p>
                      <p className="text-sm">
                        📝 <span className="font-semibold">Your Answer:</span>{" "}
                        <span
                          className={`${
                            item.selectedAnswer === item.correctAnswer
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.selectedAnswer}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          
        </div>
      </div>
    </Fragment>
  );
};

export default TestResult;
