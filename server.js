wss.on("connection", (ws) => {
    console.log("User connected.");

    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.monitor) {
            console.log("Monitoring Base connected.");
            ws.isMonitor = true;
        } else if (parsedMessage.recipient) {
            // ✅ Forward response from monitor to the correct sender
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        sender: "Monitoring Base",
                        alert: parsedMessage.response
                    }));
                }
            });
        } else {
            console.log("Emergency Signal Received:", parsedMessage);
            
            // ✅ Broadcast to all monitors
            wss.clients.forEach(client => {
                if (client.isMonitor && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        }
    });

    ws.on("close", () => console.log("User disconnected."));
});
