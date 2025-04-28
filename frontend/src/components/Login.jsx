// src/components/Login.jsx
import React, { useState } from "react";
import "./Login.css"; // Make sure you have this CSS file

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLoginSuccess }) {
  // State for Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // State to hold login error message

  // State for Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLanguage, setRegisterLanguage] = useState("en"); // State for language dropdown, default 'en'
  const [registerRole, setRegisterRole] = useState("User"); // State for role dropdown, default 'User'
  const [registerError, setRegisterError] = useState(""); // State to hold registration error message
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for success message


  // State to manage if 'Login' or 'Register' tab is active
  const [isLoginActive, setIsLoginActive] = useState(true);

  // Function to handle switching tabs and clearing previous form data/messages
  const handleTabChange = (isLogin) => {
      setIsLoginActive(isLogin);
      // Clear form fields and messages when switching tabs
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      // Reset dropdowns to default values
      setRegisterLanguage("en");
      setRegisterRole("User");
      setRegisterError("");
      setRegistrationSuccess(false);
  };


  // --- Login Function ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: loginEmail,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login success:", data);

      localStorage.setItem("token", data.access_token);
      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "An unexpected error occurred during login.");
    }
  };
  // --- End Login Function ---


  // --- Register Function ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegistrationSuccess(false);

    // Basic validation (add language/role validation if needed, though dropdowns limit input)
    if (!registerName || !registerEmail || !registerPassword) {
        setRegisterError("Name, email, and password are required.");
        return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send as JSON
        },
        body: JSON.stringify({ // Stringify the JSON object
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          language: registerLanguage, // Use state value for language
          role: registerRole // Use state value for role
        }),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
         const errorMessage = errorData.detail ?
                                Array.isArray(errorData.detail) ?
                                errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ') :
                                errorData.detail
                                : errorData.message || "Registration failed";

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Registration success:", data);

      setRegistrationSuccess(true);
      // Optional: Automatically switch to login tab after success
      // handleTabChange(true);

    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError(error.message || "An unexpected error occurred during registration.");
    }
  };
  // --- End Register Function ---


  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Boxi</h1>
        <p>Manage your jobs, clients and tommorow's tasks</p>
      </div>

      <div className="login-card">
        <div className="login-tabs">
          <button
            className={`tab-button ${isLoginActive ? "active" : ""}`}
            onClick={() => handleTabChange(true)}
          >
            Login
          </button>
          <button
             className={`tab-button ${!isLoginActive ? "active" : ""}`}
             onClick={() => handleTabChange(false)}
          >
            Register
          </button>
        </div>

        <div className="login-form-area">
           {/* Login Form */}
           {isLoginActive && (
               <form onSubmit={handleLogin} className="login-form">
                    {loginError && <p className="error-message">{loginError}</p>}

                    <div className="form-group">
                      <label htmlFor="login-email">Email address</label>
                      <input
                        type="text"
                        id="login-email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="login-password">Password</label>
                      <input
                        type="password"
                        id="login-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="form-input"
                      />
                    </div>

                    <button type="submit" className="login-button">
                      Sign in
                    </button>
               </form>
           )}

           {/* Register Form */}
           {!isLoginActive && (
               <div className="register-form-container">
                   {registrationSuccess && <p className="success-message">Registration successful! You can now log in.</p>}
                   {registerError && <p className="error-message">{registerError}</p>}

                   {!registrationSuccess && (
                        <form onSubmit={handleRegister} className="register-form">
                           <div className="form-group">
                               <label htmlFor="register-name">Name</label>
                               <input
                                   type="text"
                                   id="register-name"
                                   value={registerName}
                                   onChange={(e) => setRegisterName(e.target.value)}
                                   placeholder="Enter your name"
                                   required
                                   className="form-input"
                               />
                           </div>
                           <div className="form-group">
                               <label htmlFor="register-email">Email address</label>
                               <input
                                    type="email"
                                    id="register-email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="form-input"
                               />
                           </div>
                           <div className="form-group">
                                <label htmlFor="register-password">Password</label>
                                <input
                                    type="password"
                                    id="register-password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                    className="form-input"
                                />
                           </div>

                           {/* Language Dropdown */}
                           <div className="form-group">
                                <label htmlFor="register-language">Language</label>
                                <select
                                    id="register-language"
                                    value={registerLanguage}
                                    onChange={(e) => setRegisterLanguage(e.target.value)}
                                    required
                                    className="form-input" // Use the same style class
                                >
                                    <option value="en">English</option>
                                    <option value="pl">Polski</option>
                                </select>
                           </div>

                           {/* Role Dropdown */}
                            <div className="form-group">
                                <label htmlFor="register-role">Role</label>
                                <select
                                    id="register-role"
                                    value={registerRole}
                                    onChange={(e) => setRegisterRole(e.target.value)}
                                    required
                                    className="form-input" // Use the same style class
                                >
                                    <option value="User">User</option>
                                    <option value="Developer">Developer</option>
                                </select>
                           </div>

                           <button type="submit" className="login-button">
                               Sign Up
                           </button>
                       </form>
                   )}
               </div>
           )}
        </div> {/* End login-form-area */}

      </div> {/* End login-card */}
    </div> // End login-container
  );
}

export default Login;