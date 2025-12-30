// components/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    logout();
    setDrawerOpen(false);
    navigate("/login");
  }

  // close on ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    if (drawerOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <nav className="navbar2">
      {/* LEFT: brand */}
      <div className="nb-left">
        <Link to="/" className="nb-brand">
          Around the world*
        </Link>
      </div>

      {/* MIDDLE: text links */}
      <div className="nb-mid">
        <NavLink to="/vacations" className="nb-link">
          Home
        </NavLink>

        {/* About section on /vacations (you'll add id="about" later) */}
        <a href="#about" className="nb-link">
          About us
        </a>

        {user?.role === "admin" && (
          <NavLink to="/admin" className="nb-link">
            Manage vacations
          </NavLink>
        )}
      </div>

      {/* RIGHT: drawer trigger */}
      <div className="nb-right">
        {user && (
          <button
            className="nb-drawer-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open user menu"
          >
            ☰
          </button>
        )}
      </div>

      {/* BACKDROP */}
      <div
        className={`nb-backdrop ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* DRAWER (right side) */}
      <aside className={`nb-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="nb-drawer-head">
          <div className="nb-user">
            <div className="nb-user-name">{user?.firstName}</div>
            <div className="nb-user-role">({user?.role})</div>
          </div>

          <button
            className="nb-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="nb-drawer-body">
          <button className="nb-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </nav>
  );
}
