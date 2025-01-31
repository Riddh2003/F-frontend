import React, { useState } from "react"; // Import React and useState hook
import TextField from "@mui/material/TextField"; // Import Material-UI TextField for input fields
import { makeStyles } from "@mui/styles"; // Import makeStyles for custom styles
import axios from "axios"; // Import axios for HTTP requests
import Message from "../common/Message.jsx"; // Import custom Message component for displaying notifications

// Custom styles using Material-UI's makeStyles
const useStyles = makeStyles(() => ({
  root: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green", // Change border color to green on focus
      },
      fontFamily: "Metropolis, sans-serif", // Set custom font
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "green", // Change label color to green on focus
      },
      fontFamily: "Metropolis, sans-serif", // Set custom font
    },
  },
  errorText: {
    color: "red", // Error text color
    fontSize: "0.875rem", // Font size for error text
    marginTop: "0.5rem", // Spacing above error text
  },
}));

// Signup component
function Signup({ setLoading }) {
  // State variables to manage input values, errors, and messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullname, setFullname] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [visible, setVisible] = useState(false);
  const classes = useStyles(); // Use custom styles

  // Function to validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailPattern.test(email)) return "Invalid email format";
    return "";
  };

  // Function to validate password rules
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  // Function to validate the full name format
  const validateFullname = (fullname) => {
    if (!fullname) return "Full name is required";
    const nameParts = fullname.trim().split(" ");
    if (nameParts.length < 2)
      return "Full name must include both first and last name";
    return "";
  };

  // Function to validate mobile number
  const validateMobile = (mobile) => {
    const mobilePattern = /^\d{10}$/; // Validate 10-digit mobile numbers
    if (!mobile) return "Mobile number is required";
    if (!mobilePattern.test(mobile))
      return "Invalid mobile number format. It must be 10 digits.";
    return "";
  };

  // Function to handle the signup process
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate all input fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const mobileError = validateMobile(mobile);
    const fullNameError = validateFullname(fullname);

    // Set validation errors in state
    setErrors({
      email: emailError,
      password: passwordError,
      mobile: mobileError,
      fullname: fullNameError,
    });

    // Proceed if no errors
    if (!emailError && !passwordError && !mobileError && !fullNameError) {
      setLoading(true); // Show loading indicator
      try {
        // Send signup request to the backend
        const response = await axios.post(
          "http://localhost:9999/api/public/session/signup",
          { email, password, mobile, fullname }, // Request payload
          {
            headers: {
              "Content-Type": "application/json", // Set headers
            },
          }
        );

        // Handle backend response
        if (response.status === 200) {
          if (response.data.message) {
            setIsError(false); // Success case
            setMessage(response.data.message); // Show success message
          } else if (response.data.error) {
            setIsError(true); // Error case
            setMessage(response.data.error); // Show error message
          }
        }
        setVisible(true); // Make message visible
      } catch (error) {
        // Handle request errors
        console.error("There was an error!", error.response || error.message);
        setIsError(true);
        setMessage("Signup failed. Please try again."); // Display generic error message
        setVisible(true); // Show error message
      } finally {
        setLoading(false); // Hide loading indicator
      }
    }
  };

  // Function to close the message component
  const handleCloseMessage = () => {
    setVisible(false);
  };

  return (
    <div className="relative font-metropolis h-auto w-[475px] bg-white p-7 flex flex-col rounded-md shadow-lg shadow-indigo-500/40">
      {/* Display message component */}
      <Message
        message={message}
        isError={isError}
        isVisible={visible}
        onClose={handleCloseMessage}
      />

      <div className="w-full">
        <h1 className="text-3xl font-bold">Signup</h1>
      </div>

      <div className="mt-6 space-y-4">
        {/* Fullname input */}
        <TextField
          fullWidth
          id="outlined-basic"
          label="Fullname"
          variant="outlined"
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className={classes.root}
          error={Boolean(errors.fullname)}
        />
        {errors.fullname && (
          <span className={classes.errorText}>{errors.fullname}</span>
        )}

        {/* Mobile number input */}
        <TextField
          fullWidth
          id="outlined-basic"
          label="Mobile number"
          variant="outlined"
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className={classes.root}
          error={Boolean(errors.mobile)}
        />
        {errors.mobile && (
          <span className={classes.errorText}>{errors.mobile}</span>
        )}

        {/* Email input */}
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

        {/* Password input */}
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

      {/* Signup button */}
      <button
        onClick={handleSignup}
        className="ease-in duration-200 text-center bg-[#00c6ff] rounded-md p-3 mt-5 text-[#ffffff] hover:bg-[#0082fe] shadow-sm shadow-slate-200"
      >
        Signup
      </button>
    </div>
  );
}

export default Signup;
