const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const ws = new WebSocket("ws://localhost:3001/ws");

const audioPath = path.join(__dirname, "../../assets/audio.json");
const events = JSON.parse(fs.readFileSync(audioPath, "utf-8"));

let sentStart = false;
let startedStreaming = false;

function sendAsrStart() {
    if (sentStart) return;
    sentStart = true;

    ws.send(
        JSON.stringify({
            type: "asrStart",
            lessonId: "day_0",
            learningLocale: "en-US",
            metadata: {
                recording: {
                    lessonId: "day_0",
                    lineId: "line-1"
                },
                deviceAudio: {
                    inputSampleRate: 16000
                },
            },
        })
    );

    console.log("sent asrStart");
}

function streamAudio(max) {
    if (startedStreaming) return;
    startedStreaming = true;

    const total = Math.min(max, events.length);
    console.log(`streaming ${total} events...`);

    let i = 0;
    const interval = setInterval(() => {
        const ev = events[i];
        const isFinal = i === total - 1 ? true : !!ev.isFinal;

        ws.send(JSON.stringify({
            type: "asrStream",
            chunk: ev.chunk,
            isFinal
        }));
        i++;

        if (i % 10 === 0 || isFinal) {
            console.log(`sent ${i}/${total} (final=${isFinal})`);
        }

        if (i >= total) clearInterval(interval);
    }, 150);
}

ws.on("open", () => {
    console.log("connected to local proxy");
});

ws.on("message", (msg) => {
    const text = msg.toString();

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        console.log("non-json message:", text);
        return;
    }

    // always print message type so we see what's coming back
    console.log("recv:", data.type, data.isFinal === true ? "(final)" : "");

    if (data.type === "proxyStatus" && data.status === "upstreamConnected") {
        sendAsrStart();
    }

    if (data.type === "asrMetadata") {
        console.log("got asrMetadata; start streaming");
        streamAudio(50); // increase if needed
    }

    if (data.type === "asrResult") {
        console.log("TRANSCRIPT:", data.text);
    }

    if (data.type === "asrError") {
        console.log("ASR ERROR:", data);
    }
});

ws.on("close", () => console.log("closed"));
ws.on("error", (e) => console.error("error", e));