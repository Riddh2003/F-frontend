import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import Message from "../common/Message.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/AddStudent.module.css";

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

function ForgotPassword({ setIsSubmitting, onClosed }) {
  // State variables for form inputs and validations
  const [email, setEmail] = useState(""); // Stores email input value
  const [password, setPassword] = useState(""); // Stores password input value
  const [otp, setOtp] = useState(""); // Stores OTP input value
  const [errors, setErrors] = useState({ email: "", password: "", otp: "" }); // Validation error messages
  const [message, setMessage] = useState(""); // Message to display (success/error)
  const [isError, setIsError] = useState(false); // Determines if the message is an error
  const [visible, setVisible] = useState(false); // Controls message visibility
  const [isClosing, setIsClosing] = useState(false); // Tracks if the popup is closing
  const classes = useStyles(); // Apply custom styles
  const navigate = useNavigate(); // React Router hook for navigation

  // Validate email format and check if it's empty
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
    if (!email) return "Email is required"; // Check if empty
    if (!emailPattern.test(email)) return "Invalid email format"; // Check if format is correct
    return ""; // No error
  };

  // Validate password length and check if it's empty
  const validatePassword = (password) => {
    if (!password) return "Password is required"; // Check if empty
    if (password.length < 8) return "Password must be at least 8 characters"; // Minimum length requirement
    return ""; // No error
  };

  // Validate OTP (compares with stored OTP in localStorage)
  const storedOtp = localStorage.getItem("otp"); // Retrieve stored OTP
  const validateOtp = (otp) => {
    if (!otp) return "OTP is required"; // Check if empty
    if (storedOtp != otp) return "Invalid OTP"; // Check if OTP matches
    return ""; // No error
  };

  // Handles form submission
  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Perform validation for all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const otpError = validateOtp(otp);

    // Update error state if validation fails
    setErrors({ email: emailError, password: passwordError, otp: otpError });

    // Only proceed if no errors
    if (!emailError && !passwordError && !otpError) {
      setIsSubmitting(true); // Show loading state
      try {
        // Make an API call to update the password
        const response = await axios.post(
          "https://royal-student-backend.onrender.com/api/public/session/forgotpassword", // API endpoint
          { email, password, otp }, // Data to send
          {
            headers: {
              "Content-Type": "application/json", // Set content type to JSON
            },
          }
        );

        // Handle API response
        if (response.status === 200) {
          if (response.data.message) {
            // Success message from backend
            setIsError(false);
            setMessage(response.data.message);
            handleClose(); // Close the form
          } else if (response.data.error) {
            // Error message from backend
            setIsError(true);
            setMessage(response.data.error);
            console.log(response.data.error); // Log error for debugging
          }
        }
        setVisible(true); // Show the message component
      } catch (error) {
        // Handle API errors
        console.error("There was an error!", error.response || error.message);
        setIsError(true);
        setMessage("Password update failed. Please try again."); // Generic error message
        setVisible(true); // Show error message
      } finally {
        setIsSubmitting(false); // Reset loading state
      }
    }
  };

  // Closes the message component
  const handleCloseMessage = () => {
    setVisible(false); // Hide message
  };

  // Handles popup close and navigates back to home
  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      onClosed(); // Call parent close function
    }, 300); // Animation duration
    navigate("/"); // Redirect to home page
    window.location.reload(); // Refresh the page
  };

  return (
    <div
      className={`relative font-metropolis h-auto w-[475px] bg-white p-7 flex flex-col rounded-md shadow-lg shadow-indigo-500/40 popup ${
        isClosing ? styles.popupClosing : styles.popupAnimation
      } z-60`}
      style={{
        maxHeight: errors && Object.keys(errors).length > 0 ? "90vh" : "auto", // Scroll only if there are errors
        overflowY: errors && Object.keys(errors).length > 0 ? "auto" : "hidden", // Enable scrolling for errors
      }}
    >
      {/* Message component to show success/error */}
      <Message
        message={message}
        isError={isError}
        isVisible={visible}
        onClose={handleCloseMessage}
      />

      {/* Title and Close Button */}
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold">Update Password</h1>
        <span onClick={handleClose} className="text-xl cursor-pointer">
          &#10006; {/* Close icon */}
        </span>
      </div>

      {/* Input fields for email, password, and OTP */}
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
          error={Boolean(errors.email)} // Highlight error if any
        />
        {errors.email && (
          <span className={classes.errorText}>{errors.email}</span> // Show email error
        )}
        <TextField
          fullWidth
          id="outlined-password"
          label="New Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={classes.root}
          error={Boolean(errors.password)} // Highlight error if any
        />
        {errors.password && (
          <span className={classes.errorText}>{errors.password}</span> // Show password error
        )}
        <TextField
          fullWidth
          id="outlined-basic"
          label="One Time Password"
          variant="outlined"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={classes.root}
          error={Boolean(errors.otp)} // Highlight error if any
        />
        {errors.otp && <span className={classes.errorText}>{errors.otp}</span>}{" "}
        // Show OTP error
      </div>

      {/* Submit button */}
      <button
        onClick={handleForgotPassword}
        className="ease-in duration-200 text-center bg-[#00c6ff] rounded-md p-3 mt-5 text-[#ffffff] hover:bg-[#0082fe] shadow-sm shadow-slate-200"
      >
        Update Password
      </button>
    </div>
  );
}

export default ForgotPassword;
