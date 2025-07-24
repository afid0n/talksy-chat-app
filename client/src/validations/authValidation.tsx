import * as Yup from "yup";


export const registerValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string().required("Username is required"),
  fullName: Yup.string().required("Full name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .when("authProvider", {
      is: "local",
      then: (schema) => schema.required("Password is required"),
    }),
  birthday: Yup.string().required("Birthday is required"),
  location: Yup.object({
    country: Yup.string().required(),
    city: Yup.string().required(),
  }),
  interests: Yup.array().min(1).required(),
  language: Yup.string().required(),
});


export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().when("$authProvider", {
    is: "local",
    then: (schema) =>
      schema.required("Password is required").min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
