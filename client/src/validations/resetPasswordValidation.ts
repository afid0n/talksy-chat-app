// validations/resetPasswordValidation.ts
import * as Yup from "yup";

const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default resetPasswordValidationSchema;
