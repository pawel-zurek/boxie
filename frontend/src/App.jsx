// src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import MainApp from "./components/MainApp"; // your real app (e.g., dashboard)

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
    <div>
      <MainApp />
    </div>
  );
}

export default App;
