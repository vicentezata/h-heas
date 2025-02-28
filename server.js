const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app); // Create HTTP server

const wss = new WebSocket.Server({ server }); // Attach WebSocket server

wss.on("connection", (ws) => {
    console.log("✅ WebSocket connected!");

    ws.on("message", (message) => {
        console.log("🚨 Emergency Signal:", message);

        // Broadcast to all connected clients
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
