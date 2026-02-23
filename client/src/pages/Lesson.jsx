import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import audioEvents from "../audio.json";
import { useLocation } from "react-router-dom";
import "./Lesson.css";

const API_BASE = "http://localhost:3001";

async function getLesson(lessonId) {
    const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`);
    if (!res.ok) throw new Error("Failed to load lesson");
    return res.json(); // { lesson: {...} }
}

export default function Lesson() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);

    const [transcript, setTranscript] = useState("");
    const [status, setStatus] = useState("idle"); // idle | connecting | recording | done | error | closed

    const wsRef = useRef(null);
    const intervalRef = useRef(null);

    // Load lesson data
    useEffect(() => {
        getLesson(lessonId)
            .then((data) => setLesson(data.lesson))
            .catch(() => setLesson(null));
    }, [lessonId]);

    // Cleanup on unmount 
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    const startRecording = () => {
        // Guard: do nothing if already recording/connecting
        if (status === "connecting" || status === "recording") return;

        // Reset UI
        setTranscript("");
        setStatus("connecting");

        // Safety: clear any previous timer/socket
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const ws = new WebSocket("ws://localhost:3001/ws");
        wsRef.current = ws;

        ws.onopen = () => {
            // Wait for proxyStatus upstreamConnected before asrStart
        };

        ws.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                return;
            }

            if (data.type === "proxyStatus" && data.status === "upstreamConnected") {
                ws.send(
                    JSON.stringify({
                        type: "asrStart",
                        lessonId,
                        learningLocale: "en-US",
                        metadata: {
                            recording: { lessonId, lineId: "line-1" },
                            deviceAudio: { inputSampleRate: 16000 },
                        },
                    })
                );
                return;
            }

            if (data.type === "asrMetadata") {
                setStatus("recording");

                // Stream audio events on an interval
                let i = 0;
                intervalRef.current = setInterval(() => {
                    const ev = audioEvents[i];
                    const isLast = i === audioEvents.length - 1;

                    ws.send(
                        JSON.stringify({
                            type: "asrStream",
                            chunk: ev.chunk,
                            isFinal: isLast, // end session
                        })
                    );

                    i++;

                    if (i >= audioEvents.length) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }, 200);

                return;
            }

            if (data.type === "asrResult") {
                //only show the most recent transcription result
                setTranscript(data.text || "");

                if (data.isFinal) {
                    setStatus("done");

                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    ws.close();
                    wsRef.current = null;
                }

                return;
            }

            if (data.type === "asrError") {
                setStatus("error");
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                ws.close();
                wsRef.current = null;
                return;
            }

            if (data.type === "asrClosed") {
                // Some servers send this after final; you might see it briefly
                // We already close on final result, so this is mostly informational.
            }
        };

        ws.onerror = () => {
            setStatus("error");
        };

        ws.onclose = () => {
            // If the socket closes before we hit "done", reflect it
            setStatus((prev) => (prev === "done" ? prev : "closed"));
        };
    };

    const isRecording = status === "recording" || status === "connecting";

    const location = useLocation();
    const courseId = location.state?.courseId;

    if (!lesson) return <div style={{ padding: 16 }}>Loading…</div>;

    return (
        <div className={`lesson-page ${isRecording ? "recording" : ""}`}>
            <div className="lesson-header">
                <Link
                    to={courseId ? `/courses/${courseId}` : "/"}
                    className="back-link"
                >
                    ← Back
                </Link>

                <div className="lesson-title-section">
                    <h1 className="lesson-title">{lesson.title}</h1>
                    <p className="lesson-subtitle">{lesson.subtitle}</p>
                </div>
            </div>

            <div className="lesson-spacer" />

            <div className="lesson-translation">
                <label className="translation-label">
                    {isRecording ? "Translating" : "Translation"}
                </label>
                <p className="translation-text">{transcript || ""}</p>
            </div>

            <div className="lesson-footer">
                <button
                    className="microphone-button"
                    onClick={startRecording}
                    disabled={isRecording}
                    aria-label="Record audio"
                    title={isRecording ? "Recording..." : "Click to record"}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                </button>
            </div>
        </div>
    );
}