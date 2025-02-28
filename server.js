const WebSocket = require("ws"); // Import WebSocket
const wss = new WebSocket.Server({ port: 8080 }); // Create WebSocket server on port 8080

wss.on("connection", (ws) => {
    console.log("✅ User connected.");

    ws.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.monitor) {
                console.log("📡 Monitoring Base connected.");
                ws.isMonitor = true;
            } else if (parsedMessage.recipient) {
                console.log(`📨 Sending reply to ${parsedMessage.recipient}`);

                // ✅ Send automatic reply to the sender
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && !client.isMonitor) {
                        client.send(JSON.stringify({
                            sender: "Monitoring Base",
                            alert: parsedMessage.response
                        }));
                    }
                });
            } else {
                console.log("🚨 Emergency Signal Received:", parsedMessage);

                // ✅ Send alert to all monitoring bases
                wss.clients.forEach(client => {
                    if (client.isMonitor && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
            }
        } catch (error) {
            console.error("❌ Error processing message:", error);
        }
    });

    ws.on("close", () => console.log("❌ User disconnected."));
});

console.log("🚀 WebSocket server running on ws://localhost:8080");
