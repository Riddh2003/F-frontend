import { useState, useEffect } from "react"; // Import React hooks for managing state and lifecycle
import axios from "axios"; // Import axios for making HTTP requests
import styles from "../../styles/AddStudent.module.css"; // Import styles for the component
import { validateForm } from "../../services/Validation"; // Import validation function for form data
import Message from "../common/Message"; // Import a reusable Message component for notifications

// Main component for editing student details
const EditStudent = ({ setIsSubmitting, onClosed, studentData, onRefresh }) => {
  // State to manage animation when closing the popup
  const [isClosing, setIsClosing] = useState(false);
  // State to check if the popup is open
  const [isOpen, setIsOpen] = useState(true);
  // State to store validation errors
  const [errors, setErrors] = useState({});
  // State to store messages to display to the user
  const [message, setMessage] = useState("");
  // State to indicate whether the message is an error
  const [isError, setIsError] = useState(false);
  // State to control the visibility of the message component
  const [visible, setVisible] = useState(false);

  // Extract the student ID from props, default to null if not provided
  const studentId = studentData?.studentId || null;

  // State to manage form input fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    batch: "",
    college: "",
    communication: 0,
    discipline: 0,
    regularity: 0,
    testPerformance: 0,
  });

  // Effect to populate form data when `studentData` is passed
  useEffect(() => {
    if (studentData) {
      setFormData({
        name: studentData.name || "",
        email: studentData.email || "",
        mobile: studentData.mobile || "",
        batch: studentData.batch || "",
        college: studentData.college || "",
        communication: studentData.communication || 0,
        discipline: studentData.discipline || 0,
        regularity: studentData.regularity || 0,
        testPerformance: studentData.testPerformance || 0,
      });
    }
  }, [studentData]); // Runs when `studentData` changes

  // Function to handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update the field dynamically based on the input's name attribute
    });
  };

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form data and set errors if any
    const ValidationErrors = validateForm(formData);
    console.log("Validation Errors:", ValidationErrors);
    setErrors(ValidationErrors);

    // If there are validation errors, show a message and abort submission
    if (Object.keys(ValidationErrors).length > 0) {
      setMessage("Please correct the errors in the form.");
      setIsError(true);
      setVisible(true);
      return;
    }

    try {
      // Set the submitting state to true
      setIsSubmitting(true);

      // Retrieve JWT token from localStorage or sessionStorage
      const token =
        localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
      if (!token) {
        setMessage("Authorization token is missing.");
        setIsError(true);
        setVisible(true);
        return;
      }

      // Make an API call to update the student details
      const response = await axios.put(
        `http://localhost:9999/api/private/admin/editstudent/${studentId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token for authentication
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        setIsError(false);
        setMessage(response.data.message || "Student updated successfully!");
        await onRefresh(); // Refresh parent component data
        onClosed(); // Close the popup
      } else {
        throw new Error("Unexpected server response.");
      }
    } catch (error) {
      // Log and handle errors during API call
      console.error(
        "Error during form submission:",
        error.response?.data || error.message
      );
      setIsError(true);
      setMessage(
        error.response?.data?.error || "Edit Student failed. Please try again."
      );
    } finally {
      // Reset submitting state and show message
      setIsSubmitting(false);
      setVisible(true);
    }
  };

  // Function to close the message component
  const handleCloseMessage = () => {
    setVisible(false);
  };

  // Function to handle closing the popup with animation
  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setIsOpen(false);
      onClosed(); // Notify parent that popup is closed
    }, 300); // Match animation duration
  };

  // JSX to render the EditStudent form
  return (
    <>
      <div
        className={`h-auto w-[450px] md:w-[600px] lg:w-[700px] bg-white shadow-lg p-7 rounded-md flex flex-col gap-4 font-metropolis popup ${isClosing ? styles.popupClosing : styles.popupAnimation
          } z-50 relative ${styles.scrollcontainer}`}
        style={{
          maxHeight: errors && Object.keys(errors).length > 0 ? "90vh" : "auto", // Adjust height based on errors
          overflowY:
            errors && Object.keys(errors).length > 0 ? "auto" : "hidden", // Enable scrolling if errors exist
        }}
      >
        {/* Message component for success/error notifications */}
        <Message
          message={message}
          isError={isError}
          isVisible={visible}
          onClose={handleCloseMessage}
        />

        {/* Header with title and close button */}
        <div className="flex justify-between items-center pt-2 pb-2 text-[#0082fe]">
          <h1 className="text-2xl font-extrabold">Edit Student</h1>
          <span onClick={handleClose} className="text-xl cursor-pointer">
            &#10006;
          </span>
        </div>

        {/* Form for student details */}
        <div className="flex justify-between w-full gap-6">
          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Student name"
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </div>
          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Student email"
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            />
            {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
          </div>
        </div>

        {/* Additional fields for College, Batch, Mobile */}
        <div className="flex justify-between w-full gap-6">
          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="clg">College</label>
            <input
              type="text"
              id="clg"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              placeholder="College name"
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            />
            {errors.college && (
              <div style={{ color: "red" }}>{errors.college}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="batch">Batch</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              placeholder="Batch name"
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            />
            {errors.batch && <div style={{ color: "red" }}>{errors.batch}</div>}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex justify-between w-full gap-6">
          {/* Mobile field */}
          <div className="flex flex-col gap-2 w-[100%]">
            <label htmlFor="mobile">Mobile</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Student mobile"
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            />
            {errors.mobile && (
              <div style={{ color: "red" }}>{errors.mobile}</div>
            )}
          </div>
        </div>

        <div className="flex justify-between w-full gap-6">
          {/* Regularitiy, Test Performance*/}
          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="regularity">Regularity</label>
            <select
              id="regularity"
              name="regularity"
              value={formData.regularity}
              onChange={handleInputChange}
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {errors.regularity && (
              <div style={{ color: "red" }}>{errors.regularity}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="testPerformance">TestPerformance</label>
            <select
              id="testPerformance"
              name="testPerformance"
              value={formData.testPerformance}
              onChange={handleInputChange}
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {errors.testPerformance && (
              <div style={{ color: "red" }}>{errors.testPerformance}</div>
            )}
          </div>
        </div>


        <div className="flex justify-between w-full gap-6">
          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="communication">Communication</label>
            <select
              id="communication"
              name="communication"
              value={formData.communication}
              onChange={handleInputChange}
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {errors.communication && (
              <div style={{ color: "red" }}>{errors.communication}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-[50%]">
            <label htmlFor="discipline">Discipline</label>
            <select
              id="discipline"
              name="discipline"
              value={formData.discipline}
              onChange={handleInputChange}
              className="p-3 bg-[#daf2f6] rounded-md w-full outline-none placeholder:text-[#7d7d7d]"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {errors.discipline && (
              <div style={{ color: "red" }}>{errors.discipline}</div>
            )}
          </div>

        </div>

        <button
          onClick={handleFormSubmit}
          className="p-3 mt-4 text-white bg-blue-500 rounded-md"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default EditStudent; // Export the component
