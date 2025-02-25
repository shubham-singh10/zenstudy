import { useState } from "react"
import { BiTimer } from "react-icons/bi"
import { FiBarChart, FiBook, FiCheckCircle, FiFileText, FiLock, FiX } from "react-icons/fi"

const sampleQuestions = [
  {
    richQuestion: "Which among the following is the largest planet in our solar system?",
    explanation:
      "Jupiter is the largest planet in our solar system. It is a gas giant with a mass more than two and a half times that of all the other planets combined.",
    options: ["Mars", "Jupiter", "Saturn", "Neptune"],
    correctOption: 1,
  },
  {
    richQuestion: "Who wrote the book 'Discovery of India'?",
    explanation:
      "The 'Discovery of India' was written by Jawaharlal Nehru during his imprisonment at Ahmednagar fort from 1942 to 1946.",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Rabindranath Tagore", "Sardar Patel"],
    correctOption: 1,
  },
]


export function PreviewTest({ test, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState(Array(sampleQuestions.length).fill(-1))
  const [showExplanation, setShowExplanation] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with Image */}
          <div className="relative h-48 md:h-64">
            <img src={test.image || "/placeholder.svg"} alt={test.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                {test.includedInCourse && (
                  <div className="text-sm font-medium mb-2 bg-indigo-500 text-white inline-block px-3 py-1 rounded-full">
                    Included in: {test.courseName}
                  </div>
                )}
                <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
                <p className="text-lg opacity-90">{test.description}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: FiFileText },
                { id: "sample", label: "Sample Questions", icon: FiBook },
                { id: "syllabus", label: "Test Details", icon: FiBarChart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: FiBook, label: "Total Tests", value: test.tests.length },
                    { icon: FiBook, label: "Questions", value: test.totalQuestions },
                    { icon: BiTimer, label: "Average Duration", value: "60 mins" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <stat.icon className="w-4 h-4" />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What you'll get</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {test.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                        <FiCheckCircle className="w-5 h-5 text-indigo-600" />
                        <span className="text-indigo-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sample" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4">Sample Question {currentQuestion + 1}</h3>
                    <p className="text-gray-800 text-lg mb-4">{sampleQuestions[currentQuestion].richQuestion}</p>

                    <div className="space-y-3">
                      {sampleQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedAnswers[currentQuestion] === index
                              ? index === sampleQuestions[currentQuestion].correctOption
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                          }`}
                        >
                          {option}
                          {selectedAnswers[currentQuestion] === index &&
                            (index === sampleQuestions[currentQuestion].correctOption ? (
                              <FiCheckCircle className="float-right w-5 h-5 text-green-500" />
                            ) : (
                              <FiX className="float-right w-5 h-5 text-red-500" />
                            ))}
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                        <p className="text-blue-800">{sampleQuestions[currentQuestion].explanation}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setCurrentQuestion(0)
                        setShowExplanation(false)
                      }}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentQuestion === 0 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Question 1
                    </button>
                    <button
                      onClick={() => {
                        setCurrentQuestion(1)
                        setShowExplanation(false)
                      }}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentQuestion === 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Question 2
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "syllabus" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Tests</h3>
                <div className="space-y-4">
                  {test.tests.map((testItem, index) => (
                    <div key={testItem.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{testItem.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FiBook className="w-4 h-4 mr-1" />
                              {testItem.questions} Questions
                            </div>
                            <div className="flex items-center">
                              <BiTimer className="w-4 h-4 mr-1" />
                              {testItem.duration} mins
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            testItem.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : testItem.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {testItem.difficulty}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {testItem.topics.map((topic, topicIndex) => (
                          <span key={topicIndex} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Course Info or Purchase Option */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {test.includedInCourse ? (
                <>
                  <div>
                    <div className="text-lg font-medium text-gray-900">This test series is included in</div>
                    <div className="text-2xl font-bold text-indigo-600">{test.courseName}</div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={onBack}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Back to Tests
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <FiLock className="w-5 h-5" />
                      View Course
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Get access to all tests in this series</div>
                    <div className="text-2xl font-bold text-indigo-600">₹{test.price}</div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={onBack}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Back to Tests
                    </button>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                      Buy Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

