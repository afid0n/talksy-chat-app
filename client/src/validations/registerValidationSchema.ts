import * as Yup from "yup";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Too short")
    .max(100, "Too long")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  username: Yup.string()
    .min(2, "Too short")
    .max(100, "Too long")
    .required("Username is required"),

  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be at least 8 characters, with 1 uppercase, 1 lowercase and 1 number"
    )
    .required("Password is required"),
});

export default registerValidationSchema;
