import React, { useState } from "react";
import prettyBytes from "pretty-bytes";
import JsonEditor from "./JsonEditor";

export default function ResponseSection({ response }) {
  const [activeTab, setActiveTab] = useState("body");

  if (!response) return null;

  const { status, statusText, headers, data, time, size } = response;

  const contentSize = prettyBytes(
    JSON.stringify(data).length + JSON.stringify(headers).length
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Response</h2>

      <div className="flex mb-4 space-x-6">
        <div className="text-sm">
          Status:{" "}
          <span className="font-medium">
            {status} {statusText}
          </span>
        </div>
        <div className="text-sm">
          Time: <span className="font-medium">{time}ms</span>
        </div>
        <div className="text-sm">
          Size: <span className="font-medium">{contentSize}</span>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "body"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("body")}
          >
            Body
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "headers"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("headers")}
          >
            Headers
          </button>
        </div>

        <div className="p-4">
          {activeTab === "body" && (
            <JsonEditor
              value={
                typeof data === "string" ? data : JSON.stringify(data, null, 2)
              }
              readOnly={true}
            />
          )}

          {activeTab === "headers" && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(headers || {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="text-sm font-medium text-gray-700">
                    {key}:
                  </div>
                  <div className="text-sm text-gray-900">{value}</div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
