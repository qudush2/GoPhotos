"use client";

import React from "react";

interface SelectProps {
  selectMode: boolean;
  toggleSelectMode: () => void;
  selectAll: () => void;
  selectedCount: number;
}

export default function Select({
  selectMode,
  toggleSelectMode,
  selectAll,
  selectedCount,
}: SelectProps) {
  return (
    <div className="flex space-x-3">
      <button
        onClick={toggleSelectMode}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {selectMode ? "Exit Select Mode" : "Select Images"}
      </button>
      {selectMode && (
        <>
          <button
            onClick={selectAll}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Select All
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            {selectedCount} Selected
          </button>
        </>
      )}
    </div>
  );
}