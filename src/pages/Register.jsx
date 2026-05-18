import React, {
  useState,
} from "react";
import { registerUser } from "../api";
import {
  useNavigate,
} from "react-router-dom";
import bgImage from "../assets/background.jpeg";
import {

  FaCheckCircle,
  
} from "react-icons/fa";


function Register() {
  const navigate =
    useNavigate();

  const [data, setData] =
    useState({
      username: "",
      email: "",
      password: "",
      role: "user",
      identity: "",
    });

  const [error, setError] =
    useState("");

  // Admin Secret Identity
  const ADMIN_IDENTITY =
    "ADMIN123";

  const handleChange = (
    e
  ) => {
    setData({
      ...data,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      try {
        // Admin validation
        if (
          data.role ===
          "admin"
        ) {
          if (
            data.identity !==
            ADMIN_IDENTITY
          ) {
            setError(
              "Invalid Admin Identity ❌"
            );
            return;
          }
        }

        const payload = {
          username:
            data.username,
          email:
            data.email,
          password:
            data.password,
          role: data.role,
        };

        const res =
  await registerUser(
    payload
  );

console.log(res);

// SAVE TOKEN
localStorage.setItem(
  "token",
  res.token
);

// SAVE USER
localStorage.setItem(
  "user",
  JSON.stringify(
    res.user
  )
);

// SAVE USERNAME
localStorage.setItem(
  "username",
  res.user.username
);

// SAVE EMAIL
localStorage.setItem(
  "email",
  res.user.email
);

alert(
  "Registration successful ✅"
);

if (
  res.user.role ===
  "admin"
) {
  navigate(
    "/adminDashboard"
  );
} else {
  navigate(
    "/userDashboard"
  );
}
      } catch (err) {

  console.error(err);

  setError(
    err.message
  );
}
    };

  return (
    <div
      style={
        styles.container
      }>

          <nav style={styles.navbar}>
            <h1 style={styles.logo}>
          <FaCheckCircle/>    <span>
              Civic Track </span>
            </h1>
            <br/>
      
      
            
          </nav>
      
    
      <div
        style={
          styles.card
        }
      >
        <h2
          style={
            styles.title
          }
        >
          Create Account 🚀
        </h2>

        <p
          style={
            styles.subtitle
          }
        >
          Register to
          continue
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <input
            style={
              styles.input
            }
            type="text"
            name="username"
            placeholder="Username"
            value={
              data.username
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            style={
              styles.input
            }
            type="email"
            name="email"
            placeholder="Email"
            value={
              data.email
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            style={
              styles.input
            }
            type="password"
            name="password"
            placeholder="Password"
            value={
              data.password
            }
            onChange={
              handleChange
            }
            required
          />

          {/* Role */}
          <select
            style={
              styles.input
            }
            name="role"
            value={
              data.role
            }
            onChange={
              handleChange
            }
          >
            <option value="user">
              User
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          {/* Admin Identity */}
          {data.role ===
            "admin" && (
            <input
              style={
                styles.input
              }
              type="password"
              name="identity"
              placeholder="Enter Admin Identity"
              value={
                data.identity
              }
              onChange={
                handleChange
              }
              required
            />
          )}

          {error && (
            <p
              style={
                styles.error
              }
            >
              {error}
            </p>
          )}

          <button
            style={
              styles.button
            }
            type="submit"
          >
            Register
          </button>
        </form>

        <p
          style={
            styles.loginText
          }
        >
          Already have
          an account?
          <span
            style={
              styles.loginLink
            }
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            {" "}
            Login
          </span>
        </p>
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
    minHeight:
      "100vh",
    width: "100%",
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    padding: "20px",

    backgroundImage: `url(${bgImage})`,
    backgroundSize:
      "cover", // fixed background
    backgroundPosition:
      "center",
    backgroundRepeat:
      "no-repeat",
    backgroundAttachment:
      "fixed",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "35px",
    borderRadius:
      "20px",

    background:
      "rgba(255,255,255,0.18)",

    backdropFilter:
      "blur(15px)",

    WebkitBackdropFilter:
      "blur(15px)",

    border:
      "1px solid rgba(255,255,255,0.2)",

    boxShadow:
      "0 8px 32px rgba(0,0,0,0.25)",

    textAlign:
      "center",

    boxSizing:
      "border-box",
  },

  title: {
    marginBottom:
      "8px",
    fontSize: "30px",
    color: "#222",
    fontWeight:
      "700",
  },

  subtitle: {
    marginBottom:
      "25px",
    color: "#444",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "14px",
    margin:
      "12px 0",
    borderRadius:
      "10px",
    border:
      "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    boxSizing:
      "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    background:
      "linear-gradient(to right, #007bff, #0056d2)",
    color: "white",
    border: "none",
    borderRadius:
      "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight:
      "600",
    marginTop:
      "10px",
  },

  error: {
    color: "red",
    marginTop:
      "5px",
    marginBottom:
      "10px",
    fontSize: "14px",
  },

  loginText: {
    marginTop:
      "20px",
    fontSize: "14px",
    color: "#333",
  },

  loginLink: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight:
      "bold",
  },
};

export default Register;