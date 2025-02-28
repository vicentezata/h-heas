const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app); // Create HTTP server

// Serve static files (like monitor.html) from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("✅ WebSocket connected!");

    ws.on("message", (message) => {
        console.log("🚨 Emergency Signal:", message);

        // Broadcast the alert to all monitoring clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("❌ WebSocket disconnected."));
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
