// ALL IMPORTS FIRST (TOP OF FILE)
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import MainApp from "./components/MainApp";
import JobPage from "./components/JobPage";
import PersonPage from "./components/PersonPage"; // Import PersonPage correctly here

// THEN your component function
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<MainApp />} />
          <Route path="/job/:jobId" element={<JobPage />} />
          <Route path="/person/:personId" element={<PersonPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
