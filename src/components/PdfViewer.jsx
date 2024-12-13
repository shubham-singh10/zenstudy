import React from 'react'
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = () => {
    const plugin = defaultLayoutPlugin()
    return (
        <div
        style={{
            border: '1px solid rgba(0, 0, 0, .3)',
            display: 'flex',
            height: '50rem',
            margin: '1rem auto',
            width: '64rem',
        }}
    >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer fileUrl="https://pdfobject.com/pdf/sample.pdf" plugin={[plugin]}/>

                </Worker>
                </div>
           
    )
}

export default PdfViewer