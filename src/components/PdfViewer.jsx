import React from 'react'
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfViewer = () => {
    return (
        <div className="mt-8 bg-gray-100 p-4 border rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">PDF Viewer</h2>
            <div style={{ height: "100vh" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer fileUrl="https://pdfobject.com/pdf/sample.pdf" />

                    ...
                </Worker>
            </div>
        </div>
    )
}

export default PdfViewer