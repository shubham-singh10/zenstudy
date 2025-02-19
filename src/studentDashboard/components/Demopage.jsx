import { useState } from "react"
import { BiBarChart, BiBookOpen, BiTrophy } from "react-icons/bi"
import { FaClock } from "react-icons/fa"
import { FiArrowLeft } from "react-icons/fi"

// Mock data structure
const testSeriesData = [
  {
    id: 1,
    name: "UPSC Civil Services",
    description: "Comprehensive preparation for UPSC CSE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4neoItmjvmucLxxEI6qNPcfaUFWzue.png",
    progress: 75,
    totalTests: 12,
    completedTests: 9,
    tests: [
      {
        id: 101,
        name: "General Studies Paper I - Mock 1",
        duration: "2 hours",
        questions: 100,
        difficulty: "Moderate",
        status: "completed",
        score: 85,
      },
      {
        id: 102,
        name: "General Studies Paper I - Mock 2",
        duration: "2 hours",
        questions: 100,
        difficulty: "Hard",
        status: "not-started",
      },
      {
        id: 103,
        name: "CSAT Paper II - Mock 1",
        duration: "2 hours",
        questions: 80,
        difficulty: "Moderate",
        status: "not-started",
      },
    ],
  },
  {
    id: 2,
    name: "SSC CGL Complete Series",
    description: "Full-length mock tests for SSC CGL",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4neoItmjvmucLxxEI6qNPcfaUFWzue.png",
    progress: 30,
    totalTests: 10,
    completedTests: 3,
    tests: [
      {
        id: 201,
        name: "Quantitative Aptitude Full Test",
        duration: "1 hour",
        questions: 25,
        difficulty: "Easy",
        status: "completed",
        score: 92,
      },
      {
        id: 202,
        name: "English Language Complete Mock",
        duration: "1 hour",
        questions: 25,
        difficulty: "Moderate",
        status: "not-started",
      },
    ],
  },
]

export default function Demopage() {
  const [selectedSeries, setSelectedSeries] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)

  const handleSeriesClick = (seriesId) => {
    setSelectedSeries(seriesId)
    setShowResults(false)
  }

  const handleTestComplete = (test) => {
    setSelectedTest(test)
    setShowResults(true)
  }

  if (showResults && selectedTest) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowResults(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back to Tests
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Test Results</h1>
                  <p className="text-blue-100 mt-1">{selectedTest.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BiTrophy className="h-8 w-8" />
                  <span className="text-3xl font-bold">{selectedTest.score}%</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Performance Summary</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedTest.score >= 75 ? "Excellent!" : "Good Effort!"}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Time Taken</h3>
                  <div className="text-2xl font-bold text-gray-900">{selectedTest.duration}</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Correct Answers</span>
                      <span className="text-green-700 font-medium">75%</span>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700">Incorrect Answers</span>
                      <span className="text-red-700 font-medium">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedSeries !== null) {
    const series = testSeriesData.find((s) => s.id === selectedSeries)
    if (!series) return null

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedSeries(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back to Test Series
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-48 md:h-64">
              <img src={series.image || "/placeholder.svg"} alt={series.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{series.name}</h1>
                <p className="text-gray-200">{series.description}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Progress: {series.completedTests}/{series.totalTests} Tests
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${series.progress}%` }}
                />
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                {series.tests.map((test) => (
                  <div key={test.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FaClock className="h-4 w-4 mr-1" />
                            {test.duration}
                          </span>
                          <span className="flex items-center">
                            <BiBookOpen className="h-4 w-4 mr-1" />
                            {test.questions} questions
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${
                              test.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : test.difficulty === "Moderate"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {test.difficulty}
                          </span>
                        </div>
                      </div>
                      {test.status === "completed" ? (
                        <button
                          onClick={() => handleTestComplete(test)}
                          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        >
                          <BiTrophy className="mr-2 h-4 w-4" />
                          View Result
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTestComplete({ ...test, score: 85 })}
                          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          <BiBarChart className="mr-2 h-4 w-4" />
                          Start Test
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Test Series</h1>
          <p className="text-xl text-gray-600">Select a test series to begin your assessment</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {testSeriesData.map((series) => (
            <div
              key={series.id}
              className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSeriesClick(series.id)}
            >
              <div className="relative">
                <div className="aspect-[2/1] overflow-hidden">
                  <img
                    src={series.image || "/placeholder.svg"}
                    alt={series.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{series.name}</h3>
                  <p className="text-gray-200">{series.description}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BiBookOpen className="h-5 w-5" />
                    <span>{series.totalTests} Tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BiTrophy className="h-5 w-5" />
                    <span>{series.completedTests} Completed</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{series.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${series.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 