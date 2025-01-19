import React, { useState } from "react";
import Login from "../components/common/Login"; // Login form component
import Signup from "../components/common/Signup"; // Signup form component
import SendOtp from "../components/common/SendOtp"; // OTP modal component
import ForgotPassword from "../components/common/ForgotPassword"; // Forgot Password modal component

function Home() {
  // States
  const [loading, setLoading] = useState(false); // Loader visibility
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup forms
  const [showSendOtpModal, setShowSendOtpModal] = useState(false); // Show/Hide OTP modal
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission loader
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // Show/Hide Forgot Password modal

  // OTP sent handler
  const handleOtpSent = () => {
    setIsOtpSent(true); // OTP sent
    setTimeout(() => {
      setShowForgotPasswordModal(true); // Show Forgot Password modal after OTP sent
    }, 0);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden font-metropolis">

      {/* Left Section - Login/Signup Form */}
      <div
        className={`h-full w-[50%] flex items-center justify-center p-10 transition-all ease-linear transform duration-500 ${
          isLogin ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        {isLogin ? (
          <Login
            setLoading={setLoading} // Pass loader state to Login
            setShowSendOtpModal={setShowSendOtpModal} // OTP modal control
          />
        ) : (
          <Signup setLoading={setLoading} /> // Signup component
        )}
      </div>

      {/* Right Section - Toggle Message */}
      <div
        className={`h-screen w-[50%] flex justify-center items-center text-white bg-gradient-to-r from-[#00c0ff] to-[#0082fe] flex-col transition-all ease-linear transform duration-500 ${
          isLogin ? "translate-x-0" : "translate-x-[-100%]"
        }`}
      >
        <div className="flex flex-col items-center gap-4 p-5 text-center h-44 justify-evenly">
          {isLogin ? (
            <>
              {/* If user is in Login form */}
              <h1 className="text-3xl font-bold">New Here?</h1>
              <p className="text-base font-medium">
                Signup and discover a great amount of new opportunities!
              </p>
              <button
                onClick={() => setIsLogin(false)} // Switch to Signup form
                className="ease-in duration-200 text-center bg-white p-3 mt-5 text-[#0082fe] pl-8 pr-8 rounded-full font-bold text-lg"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              {/* If user is in Signup form */}
              <h1 className="text-3xl font-bold">Already signed up?</h1>
              <p className="text-base font-medium">
                Log in to continue exploring your opportunities!
              </p>
              <button
                onClick={() => setIsLogin(true)} // Switch to Login form
                className="ease-in duration-200 text-center bg-white p-3 mt-5 text-[#0082fe] pl-8 pr-8 rounded-full font-bold text-lg"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Send OTP Modal */}
      {showSendOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
          <SendOtp
            setIsSubmitting={setIsSubmitting} // Set submission state
            onOtpSent={handleOtpSent} // Handle OTP sent action
            onClosed={() => setShowSendOtpModal(false)} // Close modal
          />
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
          <ForgotPassword
            setIsSubmitting={setIsSubmitting} // Set submission state
            onClosed={() => setShowForgotPasswordModal(false)} // Close modal
          />
        </div>
      )}

      {/* Loader during loading */}
      {loading && !isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      )}

      {/* Loader during form submission */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default Home;
