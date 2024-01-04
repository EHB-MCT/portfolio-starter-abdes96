import { useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";


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
  
    fetch("http://localhost:3000/users/login", {
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
  
        if (data.message === "Authentication successful.") {
          localStorage.setItem("user_ID", JSON.stringify(data.user.id));
          localStorage.setItem("user_name", JSON.stringify(data.user.name));

          navigate("/");
          setError("");
        } else {
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
