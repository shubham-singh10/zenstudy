import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    <div className="max-w-3xl mx-auto p-4">
    <button onClick={downloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded-md">
    Download PDF
  </button>
       <div ref={pdfRef} className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Test Results</h2>
      <div className="space-y-6">
        {result &&
          result?.selectedAnswers.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">
                {index + 1}. {item.question}
              </h3>
              <ul className="space-y-2">
                {item.options.map((option, i) => {
                  let bgClass = "";

                  if (option === item.correctAnswer) {
                    bgClass = "bg-green-200 border border-green-500"; // Correct answer green bg
                  }
                  if (
                    option === item.selectedAnswer &&
                    option !== item.correctAnswer
                  ) {
                    bgClass = "bg-red-200 border border-red-500"; // User's wrong answer red bg
                  }

                  return (
                    <li key={i} className={`p-2 rounded flex items-center gap-1 ${bgClass}`}>
                    <TbArrowBadgeRightFilled/> {option}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 justify-between">
                <p className="text-sm">
                  ✅ <span className="font-semibold">Correct Answer:</span>{" "}
                  <span className="text-green-600">{item.correctAnswer }</span>
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
  );
};

export default TestResult;
