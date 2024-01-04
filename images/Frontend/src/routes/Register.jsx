import { useState } from "react";
import "./styles/Register.css";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password || !name) {
      setError("Missing required fields");
      return;
    }

    fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", JSON.stringify(data.user));

        if (data.message === "Registration successful.") {
          localStorage.setItem("user_ID", JSON.stringify(data.user.id));
          localStorage.setItem("user_name", JSON.stringify(data.user.name));

          navigate(`/?id=${data.user.id}`);
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
    <form className="RegisterForm" onSubmit={handleSubmit}>
      {error && <div className="RegisterForm-error">{error}</div>}
      <h1>Register</h1>

      <label className="RegisterForm-label">
        
        <p>Name:</p>
        <input
          type="text"
          className="RegisterForm-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="RegisterForm-label">
        <p>Email:</p>
        <input
          type="text"
          className="RegisterForm-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="RegisterForm-label">
        <p>Password:</p>
        <input
          type="password"
          className="RegisterForm-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" className="RegisterForm-submit" value="Register" />
    </form>
  );
}

export default RegisterForm;
