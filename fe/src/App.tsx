import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";

import WelcomePage from './pages/WelcomePage/WelcomePage';
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import VacationsPage from "./pages/Vacations/VacationsPage";
import AdminVacationsPage from "./pages/Admin/AdminVacationsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import ProtectedRoute from "./auth/ProtectedRoute";

import './App.css'

type VacationFilter = "all" | "followed" | "upcoming" | "active";

function App() {
 const location = useLocation();

 const [vacFilter, setVacFilter] = useState<VacationFilter>("all");

  const hideNavbar = 
  location.pathname === "/" ||
  location.pathname === "/login" ||
  location.pathname === "/register";

  return (
    <>
    {/* {!hideNavbar && <Navbar />} */}

          {!hideNavbar && (
        <Navbar
          vacationFilter={vacFilter}
          onVacationFilterChange={setVacFilter}
        />
      )}

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/vacations"
          element={
            <ProtectedRoute>
                <VacationsPage
                externalFilter={vacFilter}
                onExternalFilterUsed={setVacFilter}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminVacationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute requireAdmin>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;


