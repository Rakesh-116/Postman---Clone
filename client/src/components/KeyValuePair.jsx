import React from "react";

export default function KeyValuePair({ index, data, onChange, onRemove }) {
  function handleKeyChange(e) {
    onChange(index, { ...data, key: e.target.value });
  }

  function handleValueChange(e) {
    onChange(index, { ...data, value: e.target.value });
  }

  return (
    <div className="flex my-2">
      <input
        type="text"
        className="flex-1 px-3 py-2 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Key"
        value={data.key || ""}
        onChange={handleKeyChange}
      />
      <input
        type="text"
        className="flex-1 px-3 py-2 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Value"
        value={data.value || ""}
        onChange={handleValueChange}
      />
      <button
        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={() => onRemove(index)}
      >
        Remove
      </button>
    </div>
  );
}
