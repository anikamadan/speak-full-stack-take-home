const fs = require("fs");
const path = require("path");

function loadCourseDb() {
    // server/src -> repo root -> assets/course.json
    const coursePath = path.join(__dirname, "../../assets/course.json");
    const raw = fs.readFileSync(coursePath, "utf-8");
    return JSON.parse(raw);
}

function listCourses(db) {
    return db.courses || [];
}

function getCourseById(db, courseId) {
    const courses = listCourses(db);
    return courses.find((c) => c.id === courseId) || null;
}

function getLessonById(db, lessonId) {
    const courses = listCourses(db);
    for (const c of courses) {
        const lessons = c.lessons || [];
        const found = lessons.find((l) => l.id === lessonId);
        if (found) return found;
    }
    return null;
}

module.exports = {
    loadCourseDb,
    listCourses,
    getCourseById,
    getLessonById,
};