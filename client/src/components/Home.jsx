import React, { useState } from "react";
import axios from "axios";
import KeyValuePair from "./KeyValuePair";
import JsonEditor from "./JsonEditor";
import ResponseSection from "./ResponseSection";

export default function Home() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [activeTab, setActiveTab] = useState("query-params");
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [jsonBody, setJsonBody] = useState("{\n\t\n}");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveQueryParam = (index) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleQueryParamChange = (index, data) => {
    const newParams = [...queryParams];
    newParams[index] = data;
    setQueryParams(newParams);
  };

  const handleHeaderChange = (index, data) => {
    const newHeaders = [...headers];
    newHeaders[index] = data;
    setHeaders(newHeaders);
  };

  const keyValuePairsToObject = (pairs) => {
    return pairs.reduce((obj, pair) => {
      if (pair.key.trim() !== "") {
        obj[pair.key] = pair.value;
      }
      return obj;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      alert("URL is required");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      let data = {};
      try {
        if (jsonBody.trim()) {
          data = JSON.parse(jsonBody);
        }
      } catch (error) {
        alert("Invalid JSON data");
        setLoading(false);
        return;
      } // Request to our proxy server
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      // Remove trailing slash if present to prevent double slashes
      const baseUrl = backendUrl.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const serverResponse = await axios.post(`${baseUrl}/api/proxy`, {
        method,
        url,
        headers: keyValuePairsToObject(headers),
        params: keyValuePairsToObject(queryParams),
        data,
      });

      setResponse(serverResponse.data);
    } catch (error) {
      console.error("Error making request:", error);
      setResponse({
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Error",
        headers: error.response?.headers || {},
        data: error.response?.data || { error: error.message },
        time: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Postman Clone</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex mb-6">
          <select
            className="px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="url"
            className="flex-grow px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        <div className="border rounded overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "query-params"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("query-params")}
            >
              Query Params
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "headers"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("headers")}
            >
              Headers
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "json"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("json")}
            >
              JSON
            </button>
          </div>

          <div className="p-4">
            {activeTab === "query-params" && (
              <>
                {queryParams.map((param, index) => (
                  <KeyValuePair
                    key={index}
                    index={index}
                    data={param}
                    onChange={handleQueryParamChange}
                    onRemove={handleRemoveQueryParam}
                  />
                ))}
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-sm text-green-600 border border-green-500 rounded hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={handleAddQueryParam}
                >
                  Add Parameter
                </button>
              </>
            )}

            {activeTab === "headers" && (
              <>
                {headers.map((header, index) => (
                  <KeyValuePair
                    key={index}
                    index={index}
                    data={header}
                    onChange={handleHeaderChange}
                    onRemove={handleRemoveHeader}
                  />
                ))}
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-sm text-green-600 border border-green-500 rounded hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={handleAddHeader}
                >
                  Add Header
                </button>
              </>
            )}

            {activeTab === "json" && (
              <JsonEditor value={jsonBody} onChange={setJsonBody} />
            )}
          </div>
        </div>
      </form>

      {response && <ResponseSection response={response} />}
    </div>
  );
}
