const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public"))); // Serve static files

const monitoringClients = new Set(); // Store only monitoring base clients

wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection established.");

    // Identify if this is a monitoring base or a user
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            if (data.monitor === true) {
                // This is a monitoring base client
                monitoringClients.add(ws);
                console.log("Monitoring Base connected.");
            } else {
                // This is a user sending an emergency alert
                console.log(`Emergency Signal from ${data.sender}: ${data.alert}`);

                // Send message ONLY to monitoring clients
                monitoringClients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ sender: data.sender, alert: data.alert }));
                    }
                });
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    ws.on("close", () => {
        monitoringClients.delete(ws);
        console.log("WebSocket connection closed.");
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Monitoring Base running on port ${PORT}`));
