const express = require("express");
const cors = require("cors");
const http = require("http");
const {
    WebSocketServer
} = require("ws");

const {
    loadCourseDb,
    listCourses,
    getCourseById,
    getLessonById
} = require("./courses");
const {
    bridgeSockets
} = require("./speakProxy");

const app = express();
app.use(cors());
app.use(express.json());

const db = loadCourseDb();

// REST: list courses
app.get("/api/courses", (req, res) => {
    res.json({
        courses: listCourses(db)
    });
});

// REST: course by id
app.get("/api/courses/:courseId", (req, res) => {
    const course = getCourseById(db, req.params.courseId);
    if (!course) return res.status(404).json({
        error: "Course not found"
    });
    res.json({
        course
    });
});

// REST: lesson by id (handy for lesson page later)
app.get("/api/lessons/:lessonId", (req, res) => {
    const lesson = getLessonById(db, req.params.lessonId);
    if (!lesson) return res.status(404).json({
        error: "Lesson not found"
    });
    res.json({
        lesson
    });
});

// WebSocket server on the same port
const server = http.createServer(app);
const wss = new WebSocketServer({
    server,
    path: "/ws"
});

wss.on("connection", (clientSocket) => {
    bridgeSockets(clientSocket);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
    console.log(`WS proxy: ws://localhost:${PORT}/ws`);
});