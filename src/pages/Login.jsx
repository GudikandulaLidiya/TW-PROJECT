import React, { useState, useEffect } from "react";
import { loginUser } from "../api";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpeg";
import {

  FaCheckCircle,
  
} from "react-icons/fa";



function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit =
  async (e) => {

    e.preventDefault();

    setError("");

    try {

      const res =
        await loginUser(data);

      console.log(res);

      if (res.message) {

        setError(
          res.message
        );

        return;
      }

      // STORE TOKEN
      localStorage.setItem(
        "token",
        res.token
      );

      // STORE USER
      localStorage.setItem(
        "user",
        JSON.stringify(
          res.user
        )
      );

      localStorage.setItem(
        "username",
        res.user.username
      );

      localStorage.setItem(
        "email",
        res.user.email
      );

      alert(
        "Login Successful ✅"
      );

      // NAVIGATION
      if (
        res.user.role ===
        "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/dashboard");

      }

    } catch (error) {

      console.log(error);

      setError(
        "Invalid Username or Password ❌"
      );

    }
  };
return (
  <div style={styles.container}>
    {/* Navbar */}
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>
    <FaCheckCircle/>    <span>
        Civic Track </span>
      </h1>
      <br/>


      
    </nav>

    {/* Login Card */}
    <div
      style={{
        ...styles.card,
        width: isMobile
          ? "60%"
          : "420px",
        padding: isMobile
          ? "25px"
          : "40px",
      }}
    >
      <h2 style={styles.title}>
        Welcome Back 👋
      </h2>

      <p style={styles.subtitle}>
        Login to continue
      </p>

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <button
          style={styles.button}
          type="submit"
        >
          Login
        </button>

        <div
          style={styles.forgotContainer}
        >
          <Link
            to="/forgot-password"
            style={styles.forgotLink}
          >
            Forgot Password?
          </Link>
        </div>

        <div
          style={styles.registerContainer}
        >
          <span>
            Don't have an account?
          </span>

          <Link
            to="/register"
            style={styles.registerButton}
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  </div>
);
  
}

const styles = {
  navbar: {
  position: "fixed",
  top: 40,
  left: 0,
  width: "100%",
  height: "0px",
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "left",
  justifyContent: "left",
  
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000,
},

logo: {
  color: "#007bff",
  fontSize: "33px",
  fontWeight: "700",
  margin: 0,
  letterSpacing: "1px",
  paddingLeft:"50px",
},
   container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
paddingTop: "90px",
    padding: "10px",
    overflowY: "auto",

    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  content: {
    color: "#555",
    
    maxWidth: "400px",
    marginRight: "50px",
    marginLeft: "20px",
    marginTop: "1px",
  background: "rgba(255,255,255,0.18)",
  },
   headline: {
    color: "#222"
  }
,
  card: {
    
    background:
      "rgba(255,255,255,0.18)",
    backdropFilter:
      "blur(15px)",
    WebkitBackdropFilter:
      "blur(15px)",
    borderRadius: "20px",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.25)",
    textAlign: "center",
    border:
      "1px solid rgba(255,255,255,0.2)",
    transition:
      "all 0.3s ease",
      marginLeft: "10px",

  },

  title: {
    marginBottom: "8px",
    fontSize: "32px",
    color: "#222",
    fontWeight: "700",
  },

  subtitle: {
    marginBottom: "25px",
    color: "#555",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "14px",
    margin: "12px 0",
    borderRadius: "10px",
    border:
      "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    background:
      "linear-gradient(to right, #007bff, #0056d2)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
    transition:
      "0.3s ease",
  },

  error: {
    color: "red",
    marginTop: "5px",
    marginBottom: "10px",
    fontSize: "14px",
  },

  forgotContainer: {
    marginTop: "14px",
    textAlign: "right",
  },

  forgotLink: {
    fontSize: "14px",
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
  },

  registerContainer: {
    marginTop: "22px",
    textAlign: "center",
    fontSize: "14px",
  },

  registerButton: {
    marginLeft: "8px",
    background:
      "#007bff",
    border:
      "1px solid #007bff",
    borderRadius: "8px",
    padding: "8px 14px",
    color: "#fff",
    textDecoration:
      "none",
    fontWeight: "600",
    display: "inline-block",
  },
};

export default Login;