import React, { useState } from "react";
import TextField from "@mui/material/TextField"; // Material-UI TextField for email input
import { makeStyles } from "@mui/styles"; // Styling with makeStyles
import axios from "axios"; // For sending HTTP requests
import Message from "../common/Message.jsx"; // Custom Message component for success/error display
import styles from "../../styles/AddStudent.module.css"; // CSS module for animations
import { useNavigate } from "react-router-dom"; // Navigation hook for redirecting

// Custom styles for Material-UI components
const useStyles = makeStyles(() => ({
  root: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green", // Green border when input is focused
      },
      fontFamily: "Metropolis, sans-serif", // Font style
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "green", // Green label text when focused
      },
      fontFamily: "Metropolis, sans-serif",
    },
  },
  errorText: {
    color: "red", // Error text styling
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
}));

// Main SendOtp component
function SendOtp({ setIsSubmitting, onClosed, onOtpSent }) {
  const [email, setEmail] = useState(""); // State for email input
  const [errors, setErrors] = useState({ email: "" }); // State for input errors
  const [message, setMessage] = useState(""); // Message for success or error
  const [isError, setIsError] = useState(false); // Boolean to track error state
  const [visible, setVisible] = useState(false); // Controls message visibility
  const [isClosing, setIsClosing] = useState(false); // Controls closing animation
  const [isOpen, setIsOpen] = useState(true); // Manages modal visibility
  const classes = useStyles(); // Custom styles
  const navigate = useNavigate(); // Navigation hook

  // Validates email input
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for valid email
    if (!email) return "Email is required"; // Error for empty input
    if (!emailPattern.test(email)) return "Invalid email format"; // Error for invalid email
    return ""; // No error
  };

  // Handles OTP sending
  const handleSendOtp = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const emailError = validateEmail(email); // Validate email
    setErrors({ email: emailError }); // Update error state

    if (!emailError) {
      setIsSubmitting(true); // Show loader
      try {
        // Send POST request to backend
        const response = await axios.post(
          "https://localhost:9999/api/public/session/sendotp",
          { email },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          const otp = response.data.otp; // Extract OTP from response
          localStorage.setItem("otp", otp); // Save OTP locally
          console.log(otp); // Debugging

          if (response.data.message) {
            setIsError(false); // Mark as success
            setMessage(response.data.message); // Display success message
            setIsClosing(true); // Trigger closing animation
            setTimeout(() => {
              setIsOpen(false); // Close modal
              onClosed(); // Call parent callback
            }, 300);
            onOtpSent(); // Notify OTP sent
          } else if (response.data.error) {
            setIsError(true); // Mark as error
            setMessage(response.data.error); // Display error message
          }
        }
        setVisible(true); // Show message
      } catch (error) {
        console.error("There was an error!", error.response || error.message); // Log error
        setIsError(true);
        setMessage("SendOtp failed. Please try again."); // Fallback error message
        setVisible(true);
      } finally {
        setIsSubmitting(false); // Hide loader
      }
    }
  };

  // Closes the message
  const handleCloseMessage = () => {
    setVisible(false); // Hide message
  };

  // Closes the modal
  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setIsOpen(false); // Close modal
      onClosed(); // Notify parent
    }, 300);
    navigate("/"); // Redirect to home
    window.location.reload(); // Reload the app
  };

  return (
    <div
      className={`relative font-metropolis h-auto w-[475px] bg-white p-7 flex flex-col rounded-md shadow-lg shadow-indigo-500/40 popup ${isClosing ? styles.popupClosing : styles.popupAnimation
        } z-60`}
      style={{
        maxHeight: errors && Object.keys(errors).length > 0 ? "90vh" : "auto", // Enable scrolling when errors exist
        overflowY: errors && Object.keys(errors).length > 0 ? "auto" : "hidden",
      }}
    >
      {/* Message Component */}
      <Message
        message={message}
        isError={isError}
        isVisible={visible}
        onClose={handleCloseMessage}
      />

      {/* Header Section */}
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold">SendOtp</h1>
        <span onClick={handleClose} className="text-xl cursor-pointer">
          &#10006; {/* Close button */}
        </span>
      </div>

      {/* Email Input Section */}
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
          error={Boolean(errors.email)} // Highlights input on error
        />
        {errors.email && (
          <span className={classes.errorText}>{errors.email}</span> // Error message
        )}
      </div>

      {/* Send OTP Button */}
      <button
        onClick={handleSendOtp}
        className="ease-in duration-200 text-center bg-[#00c6ff] rounded-md p-3 mt-5 text-[#ffffff] hover:bg-[#0082fe] shadow-sm shadow-slate-200"
      >
        Send One Time Password
      </button>
    </div>
  );
}

export default SendOtp;
