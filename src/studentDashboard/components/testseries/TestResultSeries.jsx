import React from 'react';
import { FiClock } from 'react-icons/fi';
import { BiBook } from 'react-icons/bi';

const testResults = [
  {
    id: 1,
    title: 'Math Test',
    image: 'https://www.shutterstock.com/image-photo/test-word-made-colored-wooden-260nw-573036694.jpg',
    description: 'A comprehensive test covering algebra, geometry, and calculus.',
    duration: 3600,
    length: 50,
    attemptDate: '2024-02-18'
  },
  {
    id: 2,
    title: 'Science Test',
    image: 'https://www.shutterstock.com/image-photo/test-word-made-colored-wooden-260nw-573036694.jpg',
    description: 'An assessment of physics, chemistry, and biology concepts.',
    duration: 2700,
    length: 40,
    attemptDate: '2024-02-17'
  },
  {
    id: 3,
    title: 'English Test',
    image: 'https://www.shutterstock.com/image-photo/test-word-made-colored-wooden-260nw-573036694.jpg',
    description: 'Evaluates reading comprehension, grammar, and vocabulary.',
    duration: 1800,
    length: 30,
    attemptDate: '2024-02-16'
  },
  {
    id: 4,
    title: 'History Test',
    image: 'https://www.shutterstock.com/image-photo/test-word-made-colored-wooden-260nw-573036694.jpg',
    description: 'Covers world history, civilizations, and significant events.',
    duration: 2400,
    length: 35,
    attemptDate: '2024-02-15'
  },
];

function TestResultSeries() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Test Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {testResults.map((test) => (
          <div key={test.id} className="bg-white shadow-xl rounded-xl overflow-hidden p-6 transition-transform transform hover:scale-105 duration-300">
            <img src={test.image} alt={test.title} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{test.title}</h3>
            <p className="text-gray-600 mb-4 text-sm">{test.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <FiClock className="w-5 h-5 text-indigo-500 mr-2" />
                <span className="text-sm text-gray-700"> {Math.floor(test.duration / 60)} mins</span>
              </div>
              <div className="flex items-center">
                <BiBook className="w-5 h-5 text-indigo-500 mr-2" />
                <span className="text-sm text-gray-700">{test.length} Questions</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">Test attempt date: {test.attemptDate}</p>
            <button className="bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 transition duration-300">View Result</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestResultSeries;
