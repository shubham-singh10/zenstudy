import React, { useState } from 'react';
import { materials } from './Material';
import MaterialCard from './MaterialCard';
import PDFViewer from './PDFViewer';
import { FiBook } from 'react-icons/fi';

function MaterialIndex() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  return (
    <div className="min-h-screen bg-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <FiBook className="w-8 h-8 textPurple" />
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onClick={() => setSelectedMaterial(material)}
            />
          ))}
        </div>
      </main>

      {selectedMaterial && (
        <PDFViewer
          title={selectedMaterial.title}
          pdfUrl={selectedMaterial.pdfUrl}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
}

export default MaterialIndex;