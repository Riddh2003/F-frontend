import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import RoyalLogo from "../../assets/images/logo_white-1.png";
import { useNavigate  } from "react-router-dom";

const Navbar = ({
  onSearch,
  searchResults,
  onStudentSelect,
  showDropdown,
  onAddStudentClick,
}) => {
  const navigate = useNavigate ();

  const handleLogout = () => {
    localStorage.removeItem("JwtToken");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="h-auto flex items-center justify-between bg-[#00b4d8] p-3 transition-all duration-150 ease-linear scrollbar-hidden">
        <div className="pl-10 w-44 md:w-34 md:mr-4 ">
          <img src={RoyalLogo} alt="Logo" className="h-12 cursor-pointer" />
        </div>

        <div className="relative md:flex md:w-[30%] items-center lg:w-[50%] hidden">
          <div className="flex items-center w-full max-w-md mx-auto bg-white border border-gray-300 rounded-full shadow-sm">
            <div className="p-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 text-gray-700 rounded-r-full focus:outline-none"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Dropdown for search results */}
          {showDropdown && searchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 z-50">
              <ul>
                {searchResults.map((student) => (
                  <li
                    key={student.studentId}
                    className="p-2 hover:bg-gray-100"
                    onClick={() => onStudentSelect(student.studentId)}
                  >
                    {student.name} - {student.college}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 md:pr-5  ">
          <button
            onClick={onAddStudentClick}
            className="bg-[#caf0f8] p-2 rounded-full text-[15px] pl-7 pr-7 text-black font-bold max-md:hidden"
          >
            Add Student
          </button>

          <button
            onClick={handleLogout}
            className="bg-[#caf0f8] p-2 rounded-full text-[15px] pl-7 pr-7 text-black font-bold "
          >
            Logout
          </button>
        </div>
      </div>

      <div className="relative flex items-center w-full mt-3 md:hidden pl-5 pr-5 pt-3 pb-3 gap-3">
        <div className="flex items-center w-full mx-auto bg-white border border-gray-300 rounded-full shadow-sm">
          <div className="p-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 text-gray-700 rounded-r-full focus:outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Dropdown for search results */}
        {showDropdown && searchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 z-50">
            <ul>
              {searchResults.map((student) => (
                <li
                  key={student.studentId}
                  className="p-2 hover:bg-gray-100"
                  onClick={() => onStudentSelect(student.studentId)}
                >
                  {student.name} - {student.college}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onAddStudentClick}
          className="bg-[#caf0f8] p-2 w-[179px] rounded-full text-[15px] pl-5 pr-5 text-black font-bold"
        >
          Add Student
        </button>
      </div>
    </>
  );
};

export default Navbar;
