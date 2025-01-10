import React, { useState } from "react";

const TestSeriesPage = () => {
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
    },
    {
      id: 3,
      question: "Who wrote 'Romeo and Juliet'?",
      options: [
        "William Shakespeare",
        "Charles Dickens",
        "Mark Twain",
        "J.K. Rowling",
      ],
    },
    {
      id: 4,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    },
    {
      id: 5,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Gold", "Silver", "Hydrogen"],
    },
    {
      id: 6,
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Claude Monet",
      ],
    },
    {
      id: 7,
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
    },
    {
      id: 8,
      question: "Which country is famous for sushi?",
      options: ["China", "Japan", "Korea", "Thailand"],
    },
    {
      id: 9,
      question: "What is the boiling point of water in Celsius?",
      options: ["50°C", "100°C", "150°C", "200°C"],
    },
    {
      id: 10,
      question: "What is the fastest land animal?",
      options: ["Cheetah", "Lion", "Horse", "Elephant"],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // State to store answers

  const handleOptionChange = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full m-10 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestion + 1}/{questions.length}
        </h2>
        <p className="text-gray-700 mb-4">
          {questions[currentQuestion].question}
        </p>
        <div className="space-y-2 bg-blue-100 py-4 px-2 rounded-lg">
          {questions[currentQuestion].options.map((option, index) => (
            <label
              key={index}
              className={`block px-4 py-2 rounded cursor-pointer ${
                answers[questions[currentQuestion].id] === option
                  ? "bg-green-300 w-[50%]"
                  : "bg-gray-50 hover:bg-gray-100 w-[50%]"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                className="mr-2 accent-green-500"
                checked={answers[questions[currentQuestion].id] === option}
                onChange={() =>
                  handleOptionChange(questions[currentQuestion].id, option)
                }
              />
              {option}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded ${
              currentQuestion === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Back
          </button>
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => alert("congratulation you complete your test")}
              className={
                "px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
              }
            >
              Save & Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                currentQuestion === questions.length - 1 || // Disable if it's the last question
                !answers[questions[currentQuestion].id] // Disable if no answer is selected
              }
              className={`px-4 py-2 rounded ${
                currentQuestion === questions.length - 1 ||
                !answers[questions[currentQuestion].id]
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              Save & Next
            </button>
          )}
        </div>
        <div
          className={`mt-4 ${
            answers[questions[currentQuestion].id]
              ? "text-green-500"
              : "text-red-500"
          } rounded-xl`}
        >
          <p>
            <strong>Selected Answer:</strong>{" "}
            {answers[questions[currentQuestion].id] || "Not Answered"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesPage;
