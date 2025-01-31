import { useState } from "react";
import axios from "axios";
import styles from "../../styles/AddStudent.module.css";
import { validateForm } from "../../services/Validation";

const AddStudent = ({ onClosed }) => {
    // State hooks for managing modal open/close status, form data, and validation errors
    const [isClosing, setIsClosing] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        college: "",
        batch: "",
        mobile: "",
        discipline: "0",
        communication: "0",
        regularity: "0",
        testPerformance: "0",
    });

    const [errors, setErrors] = useState({});

    // Handle input change for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update the formData state when any input field changes
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validate form data before submitting
        const ValidationErrors = validateForm(formData);
        console.log("Validation Errors:", ValidationErrors);
        setErrors(ValidationErrors); // Set any validation errors

        try {
            // Check if there are no validation errors before sending data to the backend
            if (Object.keys(ValidationErrors).length === 0) {
                // Retrieve the token from localStorage or sessionStorage for authentication
                const token =
                    localStorage.getItem("jwtToken") ||
                    sessionStorage.getItem("jwtToken");

                // Sending the form data to the backend using Axios
                const response = await axios.post(
                    "http://localhost:9999/api/private/admin/addstudent",
                    {
                        name: formData.name,
                        email: formData.email,
                        college: formData.college,
                        batch: formData.batch,
                        mobile: formData.mobile,
                        discipline: formData.discipline,
                        communication: formData.communication,
                        regularity: formData.regularity,
                        testPerformance: formData.testPerformance,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json", // Set the request content type to JSON
                            Authorization: `Bearer ${token}`, // Attach JWT token for authentication
                        },
                    }
                );

                alert(response.data); // Show success alert
                console.log("Form submitted successfully", response.data);

                // Trigger closing animation for the modal
                setIsClosing(true);
                // Close modal after the animation completes
                setTimeout(() => {
                    setIsOpen(false);
                    onClosed(); // Call the onClosed prop function to handle modal close logic
                }, 300);
            }
        } catch (error) {
            console.error("There was an error!", error);
            alert("Add Student failed. Please try again."); // Show error alert
        }
    };

    // Handle modal close
    const handleClose = () => {
        setIsClosing(true); // Trigger closing animation
        setTimeout(() => {
            setIsOpen(false); // Close the modal after the animation completes
            onClosed(); // Call the onClosed callback to notify the parent component
        }, 300); // Match animation duration
    };

    return (
        <>
            <div
                className={`h-auto w-[450px] md:w-[600px] lg:w-[700px] bg-white shadow-lg p-7 rounded-md flex flex-col gap-4 font-metropolis popup ${isClosing ? styles.popupClosing : styles.popupAnimation
                    } z-50 relative ${styles.scrollcontainer}`}
                style={{
                    maxHeight: errors && Object.keys(errors).length > 0 ? "90vh" : "auto", // Adjust max height when errors are present
                    overflowY:
                        errors && Object.keys(errors).length > 0 ? "auto" : "hidden", // Enable scroll when errors exist
                }}
            >
                <div className="flex justify-between items-center pt-2 pb-2 text-[#0082fe]">
                    <h1 className="text-2xl font-extrabold">Add Student</h1>
                    {/* Close button for the modal */}
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
                {/* Final submit button */}
                <button
                    onClick={(e) => handleFormSubmit(e)} // Ensure correct function binding
                    className="p-3 mt-4 text-white bg-blue-500 rounded-md"
                >
                    Submit
                </button>

            </div>
        </>
    );
};

export default AddStudent;
