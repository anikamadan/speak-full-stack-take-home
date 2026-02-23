import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./CourseDetails.css";

const API_BASE = "http://localhost:3001";

async function getCourse(courseId) {
    const res = await fetch(`${API_BASE}/api/courses/${courseId}`);
    if (!res.ok) throw new Error("Failed to load course");
    return res.json(); // { course: {...} }
}

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState(new Set());

    useEffect(() => {
        getCourse(courseId)
            .then((data) => setCourse(data.course))
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));
    }, [courseId]);

    const handleLessonClick = (lessonId) => {
        navigate(`/lessons/${lessonId}`, { state: { courseId: course.id } });
    };

    const handleMarkComplete = (lessonId) => {
        setCompletedLessons((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(lessonId)) {
                newSet.delete(lessonId);
            } else {
                newSet.add(lessonId);
            }
            return newSet;
        });
    };

    if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
    if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;
    if (!course) return <div style={{ padding: 16 }}>Not found</div>;

    const lessons = course.lessons || [];

    return (
        <div className="course-detail-page">
            <Link to="/" className="back-link">← Back</Link>

            <div className="course-header">
                <h2>{course.title}</h2>
                <div className="course-subtitle">{course.subtitle}</div>
            </div>

            <div className="lessons-section">
                <h3>Lessons</h3>
                <div className="lessons-list">
                    {lessons.map((lesson, index) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        return (
                            <div
                                key={lesson.id}
                                className={`lesson-checkpoint ${isCompleted ? "completed" : ""}`}
                            >
                                <div className="checkpoint-number">{index + 1}</div>
                                <div className="lesson-info">
                                    <h4 style={{ fontSize: "1.3rem" }} className="lesson-title">{lesson.title}</h4>
                                    <p style={{ fontSize: "0.9rem" }} className="lesson-subtitle">{lesson.subtitle}</p>
                                </div>
                                <button
                                    className={`complete-checkbox ${isCompleted ? "checked" : ""}`}
                                    onClick={() => handleMarkComplete(lesson.id)}
                                    aria-label={`Mark ${lesson.title} as ${isCompleted ? "incomplete" : "complete"}`}
                                >
                                    {isCompleted && "✓"}
                                </button>
                                <button
                                    className="lesson-action-btn"
                                    onClick={() => handleLessonClick(lesson.id)}
                                >
                                    Start learning
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}