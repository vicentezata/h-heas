const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (like monitor.html)
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
    console.log("User connected to WebSocket.");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Emergency Signal from ${data.sender}: ${data.alert}`);

            // Broadcast message to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ sender: data.sender, alert: data.alert }));
                }
            });
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    ws.on("close", () => console.log("User disconnected."));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Monitoring Base running on port ${PORT}`));
