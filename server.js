const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (monitor.html, alert.mp3, etc.)
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
    console.log("User connected.");

    ws.on("message", (message) => {
        console.log("Emergency Signal Received: " + message);

        // Send alert to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("User disconnected."));
});

server.listen(8080, () => console.log("Monitoring Base running on port 8080"));
