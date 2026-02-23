import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* NAV BAR */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    background: "white",
                    padding: "16px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 10,
                    borderRadius: "25px 25px 25px 25px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    margin: "12px 12px 0 12px",
                }}
            >
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1220" }}>
                    Speak Mini Portal
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button
                        style={{
                            padding: "10px 16px",
                            background: "#f3f4f6",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            color: "#6b7280",
                            cursor: "default",
                            fontSize: "0.95rem",
                        }}
                    >
                        English
                    </button>
                    <Link
                        to="/"
                        style={{
                            padding: "10px 16px",
                            background: "#2563eb",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            color: "white",
                            textDecoration: "none",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                        }}
                    >
                        Explore courses
                    </Link>
                </div>
            </div>

            <div style={{ flex: 1, maxWidth: 620, margin: "0 auto", width: "100%", padding: "0" }}>
                <Outlet />
            </div>
        </div>
    );
}