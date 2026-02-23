import { useEffect, useState } from "react";
import { getCourses } from "./api";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data.courses || []))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
      <h2>Courses</h2>
      {courses.map((c) => (
        <div key={c.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{c.title}</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>{c.subtitle}</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>{c.language}</div>
        </div>
      ))}
    </div>
  );
}