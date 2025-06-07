const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");
const url = require("url");
const querystring = require("querystring");
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Proxy endpoint to avoid CORS issues
app.post("/api/proxy", async (req, res) => {
  try {
    const {
      method,
      url: requestUrl,
      headers: requestHeaders,
      params,
      data,
    } = req.body;

    // Record start time
    const startTime = new Date().getTime();

    // Prepare URL with query params
    let fullUrl = requestUrl;
    if (params && Object.keys(params).length > 0) {
      const parsedUrl = new URL(requestUrl);
      for (const key in params) {
        if (params[key]) {
          parsedUrl.searchParams.append(key, params[key]);
        }
      }
      fullUrl = parsedUrl.toString();
    }

    // Create options for http request
    const parsedUrl = new URL(fullUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: { ...requestHeaders },
    };
    // Choose http or https module
    const httpModule = parsedUrl.protocol === "https:" ? https : http;

    // Make the request
    const request = httpModule.request(options, (response) => {
      let responseBody = "";
      response.on("data", (chunk) => {
        responseBody += chunk;
      });

      response.on("end", () => {
        // Calculate time taken
        const timeTaken = new Date().getTime() - startTime;

        // Parse response body
        let parsedBody;
        try {
          parsedBody = JSON.parse(responseBody);
        } catch (e) {
          parsedBody = responseBody;
        }

        // Send response
        res.json({
          status: response.statusCode,
          statusText: response.statusMessage,
          headers: response.headers,
          data: parsedBody,
          time: timeTaken,
        });
      });
    });

    // Handle errors
    request.on("error", (error) => {
      console.error("Request error:", error);
      res.status(500).json({
        error: "An error occurred while making the request",
        message: error.message,
      });
    });

    // Write data if present
    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      request.write(typeof data === "string" ? data : JSON.stringify(data));
    }

    // End the request
    request.end();
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "An error occurred while making the request",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
