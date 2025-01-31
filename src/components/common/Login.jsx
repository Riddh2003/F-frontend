import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import Message from "../common/Message.jsx";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
      fontFamily: "Metropolis, sans-serif",
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "green",
      },
      fontFamily: "Metropolis, sans-serif",
    },
  },
  errorText: {
    color: "red",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
}));

function Login({ setLoading, setShowSendOtpModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [visible, setVisible] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailPattern.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      setLoading(true); // Show loader
      try {
        const response = await axios.post(
          "http://localhost:9999/api/public/session/login",
          { email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.token) {
          const token = response.data.token;
          console.log("Token: " + token);
          localStorage.setItem("jwtToken", token); // Persistent storage
          sessionStorage.setItem("jwtToken", token); // Session-only storage
          setIsError(false);
          setMessage(response.data.message); // Success message
          navigate("/student");
        } else if (response.data.error) {
          setIsError(true);
          setMessage(response.data.error); // Error message from backend
        }

        setVisible(true); // Show message
      } catch (error) {
        console.error("There was an error!", error.response || error.message);
        setIsError(true);
        setMessage("Login failed. Please try again.");
        setVisible(true); // Show error message
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  const handleCloseMessage = () => {
    setVisible(false);
  };

  const handleForgotPasswordLink = () => {
    setShowSendOtpModal(true);
  };

  return (
    <div className="relative font-metropolis h-auto w-[475px] bg-white p-7 flex flex-col rounded-md shadow-lg shadow-indigo-500/40">
      <Message
        message={message}
        isError={isError}
        isVisible={visible}
        onClose={handleCloseMessage}
      />

      <div className="w-full">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>

      <div className="mt-6 space-y-4">
        <TextField
          fullWidth
          id="outlined-email"
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={classes.root}
          error={Boolean(errors.email)}
        />
        {errors.email && (
          <span className={classes.errorText}>{errors.email}</span>
        )}

        <TextField
          fullWidth
          id="outlined-password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={classes.root}
          error={Boolean(errors.password)}
        />
        {errors.password && (
          <span className={classes.errorText}>{errors.password}</span>
        )}
      </div>

      <button
        onClick={handleLogin}
        className="ease-in duration-200 text-center bg-[#00c6ff] rounded-md p-3 mt-5 text-[#ffffff] hover:bg-[#0082fe] shadow-sm shadow-slate-200"
      >
        Login
      </button>

      <div className="flex items-center mt-4 tracking-wide">
        <p className="text-lg">Forgot Password?</p>
        <a
          className="text-[#00c0ff] hover:text-[#0082fe] text-lg ml-2"
          href="#"
          onClick={handleForgotPasswordLink}
        >
          Click here
        </a>
      </div>
    </div>
  );
}

export default Login;
