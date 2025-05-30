import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import MainApp from "./components/MainApp";
import JobPage from "./components/JobPage";
import PersonPage from "./components/PersonPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

useEffect(() => {
  const checkToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token"); // Remove invalid/expired token
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error checking token:", err);
      setIsAuthenticated(false);
    }

    setIsLoadingAuth(false);
  };

  checkToken();
}, []);


  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoadingAuth) {
    return <div className="loading-state">Checking login...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route (Always accessible) */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? <MainApp /> : <Navigate to="/" replace />
        } />
        <Route path="/job/:jobId" element={
          isAuthenticated ? <JobPage /> : <Navigate to="/" replace />
        } />
        <Route path="/person/:personId" element={
          isAuthenticated ? <PersonPage /> : <Navigate to="/" replace />
        } />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
