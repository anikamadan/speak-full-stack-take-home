const API_BASE = "http://localhost:3001";

export async function getCourses() {
    const res = await fetch(`${API_BASE}/api/courses`);
    if (!res.ok) throw new Error("Failed to load courses");
    return res.json(); // { courses: [...] }
}