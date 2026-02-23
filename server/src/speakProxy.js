const WebSocket = require("ws");

const SPEAK_WS_URL = "wss://api.usespeak-staging.com/public/v2/ws";

const HEADERS = {
    "X-Access-Token": "DFKKEIO23DSAvsdf",
    "X-Client-Info": "Speak Interview Test",
};

function bridgeSockets(clientSocket) {
    const upstream = new WebSocket(SPEAK_WS_URL, {
        headers: HEADERS
    });

    const safeSend = (ws, data) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        ws.send(typeof data === "string" ? data : JSON.stringify(data));
    };

    upstream.on("open", () => {
        safeSend(clientSocket, {
            type: "proxyStatus",
            status: "upstreamConnected"
        });
    });

    upstream.on("message", (msg) => {
        // forward upstream → client
        safeSend(clientSocket, msg.toString());
    });

    upstream.on("close", () => {
        safeSend(clientSocket, {
            type: "proxyStatus",
            status: "upstreamClosed"
        });
        clientSocket.close();
    });

    upstream.on("error", (err) => {
        safeSend(clientSocket, {
            type: "proxyError",
            message: String(err)
        });
        clientSocket.close();
    });

    clientSocket.on("message", (msg) => {
        // forward client → upstream
        if (upstream.readyState === WebSocket.OPEN) {
            upstream.send(msg.toString());
        } else {
            safeSend(clientSocket, {
                type: "proxyStatus",
                status: "upstreamNotReady"
            });
        }
    });

    clientSocket.on("close", () => {
        try {
            upstream.close();
        } catch {}
    });
}

module.exports = {
    bridgeSockets
};