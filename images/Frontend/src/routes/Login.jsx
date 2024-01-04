import React, { useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";

/**
 * LoginForm Component:
 * Renders a login form with email and password fields.
 * Communicates with the server for authentication and redirects on success.
 */
function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles the form submission.
   * Sends a POST request to the server for authentication.
   * If successful, stores user information in local storage and redirects.
   * Displays an error message on authentication failure.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if email and password are provided
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Send authentication request to the server
    fetch("http://localhost/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", JSON.stringify(data.user));

        // If authentication is successful, store user information and redirect
        if (data.message === "Authentication successful.") {
          localStorage.setItem("user_ID", JSON.stringify(data.user.id));
          localStorage.setItem("user_name", JSON.stringify(data.user.name));

          navigate(`/?id=${data.user.id}`);
          setError("");
        } else {
          // Display error message on authentication failure
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form className="LoginForm" onSubmit={handleSubmit}>
      {error && <div className="LoginForm-error">{error}</div>}
      <label className="LoginForm-label">
        Email:
        <input
          type="text"
          className="LoginForm-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="LoginForm-label">
        Password:
        <input
          type="password"
          className="LoginForm-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" className="LoginForm-submit" value="Log in" />
    </form>
  );
}

export default LoginForm;
