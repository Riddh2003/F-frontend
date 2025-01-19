import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if no token
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      console.warn("Token has expired");
      return <Navigate to="/" replace />; // Redirect to login if token expired
    }
  } catch (err) {
    console.error("Invalid token:", err.message);
    return <Navigate to="/" replace />; // Redirect to login if token invalid
  }

  return children; // Render the protected component if token is valid
};

export default PrivateRoute;
