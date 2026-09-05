import React from 'react';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Under Construction</h1>
        <p className="text-gray-600 mb-6">
          Our website is currently undergoing scheduled maintenance and updates. We'll be back soon!
        </p>
        <div className="flex justify-center">
          <div className="h-1 w-16 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
