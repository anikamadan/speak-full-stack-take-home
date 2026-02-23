import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api";
import "./Courses.css";

export default function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getCourses().then((data) => setCourses(data.courses || []));
    }, []);

    // observe cards and add 'visible' class when they come into view
    useEffect(() => {
        const cards = document.querySelectorAll(".course-card");
        if (!cards || cards.length === 0) return;

        // Toggle visible on enter/leave so animation plays when scrolling up or down.
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    } else {
                        entry.target.classList.remove("visible");
                    }
                });
            },
            { threshold: 0.35 }
        );

        cards.forEach((c) => io.observe(c));
        return () => io.disconnect();
    }, [courses]);

    return (
        <div className="courses-page">
            <div className="courses-header">
                <h2>Explore Courses</h2>
            </div>

            <div className="courses-container">
                {courses.map((c) => {
                    const englishDesc = (c.lessons && c.lessons[0] && c.lessons[0].subtitle) || "";
                    return (
                        <article key={c.id} className="course-card" aria-labelledby={`course-${c.id}-title`}>
                            <div className="card-left">
                                <div className="left-inner">
                                    <div id={`course-${c.id}-title`} className="course-title">
                                        {c.title}
                                    </div>
                                    <div className="course-english">{englishDesc}</div>
                                </div>
                            </div>

                            <div className="card-right">
                                <div className="instructors">{c.subtitle}</div>
                                <div className="meta">
                                    <div className="language">{c.language}</div>
                                    <Link to={`/courses/${c.id}`} className="start-btn" aria-label={`Get started with ${c.title}`}>
                                        Get started
                                    </Link>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}