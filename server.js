const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Serve static files (monitor.html)
app.use(express.static(path.join(__dirname, "public")));

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("✅ WebSocket connected!");

    ws.on("message", (message) => {
        console.log("🚨 Emergency Signal Received:", message);

        try {
            const data = JSON.parse(message);

            // Broadcast alert to all monitoring clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        sender: data.sender,
                        alert: data.alert
                    }));
                }
            });

            // ✅ Send automatic response back to sender
            ws.send(JSON.stringify({
                response: `🚔 Help is on the way, ${data.sender}! Stay safe.`
            }));

        } catch (error) {
            console.error("❌ Error parsing message:", error);
        }
    });

    ws.on("close", () => console.log("❌ WebSocket disconnected."));
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
