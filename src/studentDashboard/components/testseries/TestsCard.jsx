import React from 'react'
import { BiBook } from 'react-icons/bi'
import { FiClock } from 'react-icons/fi'

export const TestsCard = ({ test, onProceed }) => {
    return (
        <div className="bg-white max-w-sm rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
            <img src={"https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200"} alt={test.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{test.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            test.difficulty === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                                test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    test.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'}`}
                    >
                        {test.difficulty}
                    </span>
                </div>
                <p className="text-gray-600 mb-4">{test.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                        <FiClock className="w-5 h-5 text-indigo-500 mr-2" />
                        <span className="text-sm text-gray-600">{test.duration} mins</span>
                    </div>
                    <div className="flex items-center">
                        <BiBook className="w-5 h-5 text-indigo-500 mr-2" />
                        <span className="text-sm text-gray-600">{test.questions?.length} Questions</span>
                    </div>
                </div>
                <button
                    onClick={onProceed}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Proceed to Test
                </button>
            </div>
        </div>
    )
}