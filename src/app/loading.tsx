import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <div className="absolute top-0 h-full w-1/2 gradient animate-loading-bar"></div>
      </div>
    </div>
  );
}