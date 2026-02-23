import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="lessons/:lessonId" element={<Lesson />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);