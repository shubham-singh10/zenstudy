import React, { Fragment, useState } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Main CurrentAffair component
function CurrentAffair() {
  const demoData = [
    {
      title: "Breaking News: Current Affairs",
      description: "Explore the details of today's breaking news.Explore the details of today's breaking news.",
      link: "https://pdfobject.com/pdf/sample.pdf"
    },
    {
      title: "Global Updates: Current Affairs",
      description: "Stay informed about global events.",
      link: "https://pdfobject.com/pdf/sample.pdf"
    },
    {
      title: "Today's Highlights",
      description: "Discover the most important updates of the day.",
      link: "https://pdfobject.com/pdf/sample.pdf"
    },
  ];

  // State to manage selected data for the PDF
  const [selectedData, setSelectedData] = useState(null);

  return (
    <Fragment>
      <div className="text-center text-3xl font-extrabold text-blue-700 mb-8">
        Current Affairs
      </div>
      <div className="space-y-6">
        {demoData.map((data, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:shadow-lg transition duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="text-gray-800">
                <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                <p className="text-gray-600 text-sm">{data.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  className="px-6 py-2 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300"
                  onClick={() => setSelectedData(data)} // Set selected data
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Viewer */}
      {selectedData && (
        <div className="mt-8 bg-gray-100 p-4 border rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">PDF Viewer</h2>
          <div style={{ height: 550 }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl="https://pdfobject.com/pdf/sample.pdf" />

              ...
            </Worker>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default CurrentAffair;
