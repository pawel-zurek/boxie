// src/components/Login.jsx
import React, { useState } from "react";
import "./Login.css"; // Make sure you have this CSS file

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold login error message
  // State to manage if 'Login' or 'Register' tab is active (for styling the tabs)
  const [isLoginActive, setIsLoginActive] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // Assuming your API returns an error message in the response body or status
        const errorData = await response.json().catch(() => ({ message: "Login failed" })); // Try parsing error, fallback if not JSON
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login success:", data);

      // Save token to localStorage
      localStorage.setItem("token", data.access_token);

      // Notify App that login was successful
      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);
      // Display the error message in the UI
      setError(error.message || "An unexpected error occurred during login.");
    }
  };

  // Placeholder function for handling registration (not implemented in this example)
  const handleRegisterSubmit = (event) => {
      event.preventDefault();
      // Registration logic would go here...
      alert("Register functionality not implemented yet."); // Placeholder
  };


  return (
    <div className="login-container"> {/* Main container for centering/styling */}
      <div className="login-header"> {/* Header section */}
        <h1>Boxi CRM</h1>
        <p>Manage your business efficiently.</p>
      </div>

      <div className="login-card"> {/* Card-like container for the form */}
        <div className="login-tabs"> {/* Container for Login/Register tabs */}
          <button
            className={`tab-button ${isLoginActive ? "active" : ""}`}
            onClick={() => setIsLoginActive(true)}
          >
            Login
          </button>
          {/* This button just switches the view, registration logic not included */}
          <button
             className={`tab-button ${!isLoginActive ? "active" : ""}`}
             onClick={() => setIsLoginActive(false)}
          >
            Register
          </button>
        </div>

        <div className="login-form-area"> {/* Area containing the actual form based on active tab */}
           {/* Render login form if login tab is active */}
           {isLoginActive && (
               <form onSubmit={handleLogin} className="login-form"> {/* Added className */}
                    {/* Display error message if there is one */}
                    {error && <p className="error-message">{error}</p>}

                    <div className="form-group"> {/* Wrapper for label and input */}
                      <label htmlFor="email">Email address</label>{/* Updated label text */}
                      <input
                        type="text" // Keeping type="text" as in your original code, though "email" might be better semantic HTML
                        id="email" // Added id for label association
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email" // Kept placeholder
                        required // Added required as is typical for login forms
                        className="form-input" // Added className for styling
                      />
                    </div>

                    <div className="form-group"> {/* Wrapper for label and input */}
                      <label htmlFor="password">Password</label>{/* Updated label text */}
                      <input
                        type="password"
                        id="password" // Added id for label association
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password" // Kept placeholder
                        required // Added required
                        className="form-input" // Added className for styling
                      />
                    </div>

                    {/* Your login button */}
                    <button type="submit" className="login-button"> {/* Added className */}
                      Sign in {/* Updated button text */}
                    </button>
               </form>
           )}

           {/* Placeholder for the Register form/content when the register tab is active */}
           {!isLoginActive && (
               <div className="register-placeholder">
                   {/* You would build your registration form here */}
                   <p>Registration form goes here.</p>
                   {/*
                   // Example structure if you were to add the register form:
                   <form onSubmit={handleRegisterSubmit} className="register-form">
                       <div className="form-group">
                           <label htmlFor="reg-email">Email</label>
                           <input type="email" id="reg-email" className="form-input" required />
                       </div>
                       <div className="form-group">
                            <label htmlFor="reg-password">Password</label>
                            <input type="password" id="reg-password" className="form-input" required />
                       </div>
                       <div className="form-group">
                           <label htmlFor="confirm-password">Confirm Password</label>
                           <input type="password" id="confirm-password" className="form-input" required />
                       </div>
                       <button type="submit" className="register-button">Sign Up</button>
                   </form>
                   */}
               </div>
           )}
        </div> {/* End login-form-area */}

      </div> {/* End login-card */}
    </div> // End login-container
  );
}

export default Login;
