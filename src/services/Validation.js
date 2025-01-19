export const validateForm = (data) => {
  const errors = {};

//   if (!data.fullname) {
//     errors.fullname = "Full name is required";
//   } else if (fullname.trim().split(" ").length < 2) {
//     errors.fullname = "Full name must include both first and last name";
//   }

//   if (!data.password) {
//     errors.password = "Password is required";
//   } else if (data.password.length < 8) {
//     errors.password = "Password must be at least 8 characters";
//   }

  if (!data.name) {
    errors.name = "Name is required";
  } else if (data.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!data.college) {
    errors.college = "College is required";
  }

  if (!data.batch) {
    errors.batch = "Batch is required";
  }

  if (!data.mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!/^[0-9]{10}$/.test(data.mobile)) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (data.discipline === "0") {
    errors.discipline = "Discipline selection is required";
  }

  if (data.communication === "0") {
    errors.communication = "Communication Skills selection is required";
  }

  if (data.regularity === "0") {
    errors.regularity = "Regularity selection is required";
  }

  if (data.testPerformance === "0") {
    errors.testPerformance = "Test Performance selection is required";
  }

  return errors;
};
