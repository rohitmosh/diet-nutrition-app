import { Link, useLocation } from "react-router-dom";

export default function Nav({ onLogout }) {
  const location = useLocation();
  return (
    <nav>
      <ul className="navbar">
        <li>
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/appointments"
            className={location.pathname === "/appointments" ? "active" : ""}
          >
            Appointments
          </Link>
        </li>
        <li>
          <Link
            to="/meal-logging"
            className={location.pathname === "/meal-logging" ? "active" : ""}
          >
            Meal Logging
          </Link>
        </li>
        <li>
          <Link
            to="/exercise-logging"
            className={location.pathname === "/exercise-logging" ? "active" : ""}
          >
            Exercise Logging
          </Link>
        </li>
        <li>
          <Link
            to="/diet-planning"
            className={location.pathname === "/diet-planning" ? "active" : ""}
          >
            Diet Planning
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={location.pathname === "/reports" ? "active" : ""}
          >
            Reports
          </Link>
        </li>
        <li>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}


