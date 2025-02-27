import { useState } from "react"
import { BiBrain, BiTimer, BiTrophy } from "react-icons/bi"
import { FiBarChart, FiBook, FiCheckCircle, FiFileText, FiLock, FiTarget } from "react-icons/fi"
import { IoSparkles } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";

export function PreviewTest({ test, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  const handlePurchase = () => {
    if (test.courseName) {
      alert("Redirecting to course purchase page...");
    } else {
      alert("Redirecting to test series purchase page...");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with Image */}
          <div className="relative h-48 sm:h-56 md:h-64">
            <img src={test.image} alt={test.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 sm:p-6 w-full">
                {test.courseName && (
                  <div className="text-xs sm:text-sm font-medium mb-2 bg-indigo-500 text-white inline-block px-3 py-1 rounded-full">
                    Included in: {test.courseName}
                  </div>
                )}
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 text-white">{test.title}</h1>
                <p className="text-sm sm:text-base text-white/90">{test.description}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b">
            <div className="flex overflow-x-auto hide-scrollbar">
              <div className="flex space-x-4 px-4 sm:px-6 min-w-max">
                {[
                  { id: 'overview', label: 'Overview', icon: FiFileText },
                  { id: 'syllabus', label: 'Test Details', icon: FiBarChart },
                  { id: 'outcomes', label: 'Learning Outcomes', icon: FiTarget }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: FiBook, label: 'Total Tests', value: test.tests.length },
                    { icon: BiBrain, label: 'Questions', value: test.totalQuestions },
                    { icon: BiTimer, label: 'Validity', value: `${test.validityDays} Days` },
                    { icon: IoSparkles, label: 'Last Updated', value: test.lastUpdated }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <stat.icon className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">{stat.label}</span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Highlights</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {test.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <BiTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-900">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">What you'll get</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {test.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                        <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-sm text-indigo-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Available Tests</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {test.tests.map((testItem) => (
                    <div key={testItem.id} className="bg-white rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">{testItem.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${testItem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            testItem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {testItem.difficulty}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {testItem.topics.map((topic, topicIndex) => (
                          <span key={topicIndex} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'outcomes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Outcomes</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {test.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <FaGraduationCap className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm text-purple-900">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Purchase Options */}
          <div className="border-t bg-gray-50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                {test.courseName ? (
                  <div>
                    <div className="text-base font-medium text-gray-900">
                      This test series is included in
                    </div>
                    <div className="text-xl font-bold text-indigo-600">{test.courseName}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Get the complete course for ₹{test.coursePrice} instead of just the test series
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xl font-bold text-gray-900">₹{test.price}</div>
                    <div className="text-sm text-gray-600">Lifetime access to all tests</div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onBack}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handlePurchase}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FiLock className="w-4 h-4" />
                  {test.courseName ? 'View Course' : 'Buy Now'}
                </button>
              </div>
            </div>
            {test.courseName && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <IoSparkles className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Get More Value with the Complete Course!</p>
                    <p className="text-xs text-amber-700 mt-1">
                      By purchasing the complete course, you'll get this test series along with comprehensive study materials,
                      video lectures, and additional resources at a better value.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

