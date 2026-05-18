import React, {
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import bgImage from "../assets/background.jpeg";

function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [password,
    setPassword] =
    useState("");

  const [message,
    setMessage] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await fetch(
            `http://localhost:5000/reset-password/${token}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                password,
              }),
            }
          );

        const data =
          await res.json();

        setMessage(
          data.message
        );

        setTimeout(() => {

          navigate("/");

        }, 2000);

      } catch (err) {

        console.log(err);

        setMessage(
          "Reset Failed"
        );
      }
    };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>
          Reset Password 🔑
        </h2>

        <p style={styles.subtitle}>
          Enter your new password
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="password"

            placeholder="New Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
                
            required

            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Update Password
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

    width: "100%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    backgroundImage:
      `url(${bgImage})`,

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundRepeat: "no-repeat",

    backgroundAttachment:
      "fixed",
  },

  card: {

    width: "400px",

    padding: "40px",

    borderRadius: "20px",

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

    textAlign: "center",
  },

  title: {

    marginBottom: "8px",

    fontSize: "30px",

    color: "#222",

    fontWeight: "700",
  },

  subtitle: {

    marginBottom: "25px",

    color: "#444",

    fontSize: "15px",
  },

  input: {

    width: "100%",

    padding: "14px",

    marginTop: "15px",

    borderRadius: "10px",

    border:
      "1px solid #ccc",

    outline: "none",

    fontSize: "15px",

    boxSizing: "border-box",
  },

  button: {

    width: "100%",

    padding: "14px",

    marginTop: "20px",

    background:
      "linear-gradient(to right, #007bff, #0056d2)",

    color: "white",

    border: "none",

    borderRadius: "10px",

    cursor: "pointer",

    fontSize: "16px",

    fontWeight: "600",
  },

  message: {

    marginTop: "20px",

    color: "green",

    fontWeight: "600",
  },
};

export default ResetPassword;