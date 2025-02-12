import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ title, pdfUrl, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1); // initial zoom at 100%

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));   // Maximum 200%
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));  // Minimum 50%

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-2">
      {/* Modal Container */}
      <div className="bg-white rounded-lg w-full  max-h-[100vh] flex flex-col shadow-lg">
        {/* Sticky Header with Title and Close Button */}
        <div className="sticky top-0 z-20 bg-white px-4 py-2 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto flex flex-col items-center">
          {/* PDF Document Container with horizontal scroll and side padding */}
          <div className="w-full flex justify-center overflow-x-auto px-2">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="max-w-[100vw]"
              loading={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={zoom}
                className="mx-auto"
              />
            </Document>
          </div>

          {/* Controls */}
          <div className="w-full mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Navigation Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <p className="text-sm">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-4">
                <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiZoomIn className="w-6 h-6" />
                </button>
                <span className="text-sm">Zoom: {Math.round(zoom * 100)}%</span>
                <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiZoomOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
