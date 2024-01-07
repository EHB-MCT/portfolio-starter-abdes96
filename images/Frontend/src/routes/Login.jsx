import React, { useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import User from "../classes/User.js";
import ThreeCoolComponent from "../components/Three.jsx";



function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

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

        if (data.message === "Authentication successful.") {
          setError("");

          const id = JSON.stringify(data.user.id);
          const username = data.user.name;
          const email = data.user.email;

          const loggedInUser = new User(id, username, email);

          localStorage.setItem("user_ID", loggedInUser.id);
          localStorage.setItem("user_name", loggedInUser.name);
          localStorage.setItem("user_email", loggedInUser.email);

          navigate(`/?id=${data.user.id}`);
        } else {

          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (

    <div className="container">
    <ThreeCoolComponent/>
    <form className="LoginForm" onSubmit={handleSubmit}>
      <div> 
      {error && <div className="LoginForm-error">{error}</div>}
      <label className="LoginForm-label">
        Email:
        <input
          type="email"
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
      </div>
    </form>
    </div>
  );
}

export default LoginForm;
