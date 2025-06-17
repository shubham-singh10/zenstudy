import React from 'react';
import { FiFileText } from 'react-icons/fi';


export default function MaterialCard({ material, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={material.thumbnail} 
        alt={material.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <FiFileText className="w-5 h-5 mt-1 textPurple flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg textPurple">{material.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{material.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}