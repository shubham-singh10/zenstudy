import React, { Fragment, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { GoTrophy } from "react-icons/go";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiX, FiXCircle } from "react-icons/fi";

const TestResult = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const pdfRef = useRef();
  const { user } = useAuth();


  useEffect(() => {
    let isMounted = true;

    const getTestSeries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API2}zenstudy/api/main/test-series-result/${user._id}/67adc66ee26696bfe603054e`,
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
  }, [user]);


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
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="text-center mb-8">
              <GoTrophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Results</h1>
              <div className="text-5xl font-bold text-indigo-600 mb-4">{(result?.score / result?.maxScore) * 100}%</div>
              <p className="text-lg text-gray-600">Total Marks: {result?.score} / {50}</p>
              <button
                onClick={downloadPDF}
                className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FiDownload className="w-5 h-5 mr-2" />
                Download Results PDF
              </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg flex items-center">
                <FiCheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-green-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-700">{result?.correctQuestions}</p>
                  <p className="text-sm text-green-600">+{result?.correctQuestions * result?.correctPoints} marks</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex items-center">
                <FiXCircle className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-red-600">Wrong Answers</p>
                  <p className="text-2xl font-bold text-red-700">{result?.incorrectQuestions}</p>
                  <p className="text-sm text-red-600">{result?.incorrectQuestions * result?.incorrectPoints} marks</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <FiAlertCircle className="w-8 h-8 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Unattempted</p>
                  <p className="text-2xl font-bold text-gray-700">{result?.unattemptedQuestions}</p>
                  <p className="text-sm text-gray-600">{result?.unattemptedQuestions * result?.unattemptedPoints} marks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question-wise Analysis */}
          <div ref={pdfRef} className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Question-wise Analysis</h2>
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
                          <span className="text-sm font-medium">+{result.correctPoints} marks</span>
                        </div>
                      ) : item.selectedAnswer === undefined ? (
                        <div className="flex items-center text-gray-600">
                          <FiAlertCircle className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Not attempted</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <FiX className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">{result.incorrectPoints} marks</span>
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
                            className={`p-5 rounded-lg border flex items-center justify-between ${isCorrect
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
                        ✅ <span className="font-semibold">Correct Answer:</span>{" "}
                        <span className="text-green-600">{item.correctAnswer}</span>
                      </p>
                      <p className="text-sm">
                        📝 <span className="font-semibold">Your Answer:</span>{" "}
                        <span
                          className={`${item.selectedAnswer === item.correctAnswer
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

          <div className="mt-8 text-center">
            <button
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Back to Test Series
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TestResult;
