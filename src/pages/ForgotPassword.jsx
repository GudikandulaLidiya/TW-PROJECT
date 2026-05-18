import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpeg";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
       const data = await res.json();

      setMessage(data.message);

      // DEMO PURPOSE
      if (data.resetLink) {
        setTimeout(() => {
          navigate(data.resetLink);
        }, 2000);
      }

    } catch (err) {
      console.log(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>
  Forgot Password 🔐
</h2>

        <p>
          Enter your email to reset password
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
              onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Send Reset Link
          </button>

        </form>

        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
}



const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
   backgroundImage: `url(${bgImage})`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
  },
title: {
  color: "#0d0e0e",
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "10px",
},
  card: {
  width: "400px",
  color: "#555",
   
  background:
    "rgba(255,255,255,0.18)",

  backdropFilter:
    "blur(15px)",

  WebkitBackdropFilter:
    "blur(15px)",

  borderRadius: "20px",

  boxShadow:
    "0 8px 32px rgba(0,0,0,0.25)",

  border:
    "1px solid rgba(255,255,255,0.2)",

  padding: "40px",

  textAlign: "center",
},
  input: {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    background: "#007bff",
    color: "white",
    border: "none",
     borderRadius: "10px",
    cursor: "pointer",
  },

  message: {
    marginTop: "20px",
    color: "green",
  },
};

export default ForgotPassword;