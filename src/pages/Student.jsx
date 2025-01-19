import { useState, useEffect } from "react";
import Navbar from "../components/student/Navbar";
import StudentDetails from "../components/student/StudentDetails";
import AddStudent from "../components/student/AddStudent";
import EditStudent from "../components/student/EditStudent";

function Student() {
  // State variables
  const [searchQuery, setSearchQuery] = useState(""); // Holds the search input text
  const [searchResults, setSearchResults] = useState([]); // List of students matching search
  const [selectedStudent, setSelectedStudent] = useState(null); // Stores details of the selected student
  const [loading, setLoading] = useState(false); // Tracks if data fetching is in progress
  const [error, setError] = useState(""); // Stores error messages
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [showAddStudentModal, setShowAddStudentModal] = useState(false); // Controls "Add Student" modal visibility
  const [showEditStudentModal, setShowEditStudentModal] = useState(false); // Controls "Edit Student" modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission status

  // Helper function to fetch data with API calls
  const fetchApi = async (url, options = {}) => {
    const token =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken"); // Retrieve JWT token

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Attach token to Authorization header
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers }); // Make the API call
    if (!response.ok) {
      const errorData = await response.json(); // Handle API errors
      throw new Error(errorData.message || "Error occurred");
    }
    return response.json(); // Return the response data
  };

  // Fetch students matching the search query
  const fetchSearchResults = async (query) => {
    if (!query) {
      setSearchResults([]); // Clear results if query is empty
      setShowDropdown(false); // Hide dropdown
      return;
    }

    try {
      setLoading(true);
      const data = await fetchApi(
        `https://royal-student-backend.onrender.com/api/private/admin/getStudentByName?characters=${query}`
      );
      setSearchResults(data); // Update search results
      setShowDropdown(true); // Show dropdown
    } catch (err) {
      setError(err.message); // Handle errors
      setShowDropdown(false); // Hide dropdown on error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Fetch details of a specific student by ID
  const fetchStudentDetails = async (studentId) => {
    try {
      setLoading(true);
      const data = await fetchApi(
        `https://royal-student-backend.onrender.com/api/private/admin/getStudentById/${studentId}`
      );
      setSelectedStudent(data); // Update selected student details
      setShowDropdown(false); // Hide dropdown
    } catch (err) {
      setError(err.message); // Handle errors
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query state
    fetchSearchResults(query); // Fetch search results
  };

  // Handle selecting a student from the search results
  const handleStudentSelect = (studentId) => {
    fetchStudentDetails(studentId); // Fetch and display student details
  };

  // Toggle "Add Student" modal visibility
  const toggleAddStudentModal = () => {
    setShowAddStudentModal(!showAddStudentModal);
  };

  // Toggle "Edit Student" modal visibility
  const toggleEditStudentModal = () => {
    setShowEditStudentModal(!showEditStudentModal);
  };

  // Refresh student details after editing
  const handleRefreshAfterEdit = async () => {
    await fetchStudentDetails(selectedStudent.studentId); // Refresh details
    setShowEditStudentModal(false); // Close edit modal
  };

  return (
    <div className="font-metropolis flex flex-col lg:h-screen md:h-[100%] overflow-hidden w-full bg-[#90e0ef] relative scrollbar-hidden">
      {/* Navbar component handles search functionality */}
      <Navbar
        onSearch={handleSearch}
        searchResults={searchResults}
        onStudentSelect={handleStudentSelect}
        showDropdown={showDropdown}
        onAddStudentClick={toggleAddStudentModal}
      />

      {/* Display student details */}
      <StudentDetails
        student={selectedStudent}
        onEditStudent={toggleEditStudentModal}
      />

      {/* "Add Student" modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <AddStudent onClosed={() => setShowAddStudentModal(false)} />
        </div>
      )}

      {/* "Edit Student" modal */}
      {showEditStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <EditStudent
            onClosed={toggleEditStudentModal}
            onRefresh={handleRefreshAfterEdit}
            studentData={selectedStudent}
            setIsSubmitting={setIsSubmitting}
            setLoading={setLoading}
          />
        </div>
      )}

      {/* Loading spinner displayed when `loading` is true */}
      {loading && console.log("Loading spinner")}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default Student;
