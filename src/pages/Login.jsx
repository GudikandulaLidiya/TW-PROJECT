import React, { useState } from "react";
import { loginUser } from "../api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(data);
      console.log("Login Response:", res);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user || {}));

        alert("Login Successful ✅");

        // SAFE ROLE CHECK
        const role = res?.user?.role;

        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert(res?.message || "Login Failed ❌");
      }

    } catch (error) {
      console.log("Login Error:", error);
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button style={styles.button} type="submit">
            Login
          </button>

          <div style={styles.registerContainer}>
            <span>Don't have an account? </span>
            <Link to="/register" style={styles.registerButton}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdfeff",
  },
  card: {
    backgroundColor: "#e6e8e9",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  registerContainer: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },
  registerButton: {
    marginLeft: "5px",
    background: "#007bff",
    borderRadius: "5px",
    padding: "5px 10px",
    color: "#fff",
    textDecoration: "none",
  },
};

export default Login;