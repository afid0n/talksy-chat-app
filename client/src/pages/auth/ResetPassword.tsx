import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useSearchParams, Link } from "react-router-dom";
import resetPasswordValidationSchema from "../../validations/resetPasswordValidation";
import { post } from "../../services/commonRequest";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log("token: ", token);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, actions) => {
      try {
        const res: {
          message: string;
          statusCode?: number;
        } = await post(`http://localhost:7070/users/reset-password`, {
          token,
          newPassword: values.newPassword,
        });

        if (res.statusCode === 400 || res.statusCode === 401) {
          enqueueSnackbar(res.message || "Invalid or expired token", {
            autoHideDuration: 2500,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            variant: "error",
          });
        } else {
          enqueueSnackbar("Password reset successfully!", {
            autoHideDuration: 2500,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            variant: "success",
          });
        }

        actions.resetForm();
      } catch {
        enqueueSnackbar("Something went wrong. Try again later.", {
          autoHideDuration: 2500,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors bg-gradient-to-br  ">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-700 transition-colors">
        <h2 className="text-3xl font-bold text-center text-yellow-700 dark:text-yellow-400 mb-6">
          Reset Password
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Enter your new password below and confirm it to reset your account.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5 text-sm">
          <div>
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={formik.values.newPassword}
              name="newPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="New password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {formik.errors.newPassword && formik.touched.newPassword && (
              <span className="text-red-500 text-sm">
                {formik.errors.newPassword}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              required
              value={formik.values.confirmNewPassword}
              name="confirmNewPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {formik.errors.confirmNewPassword &&
              formik.touched.confirmNewPassword && (
                <span className="text-red-500 text-sm">
                  {formik.errors.confirmNewPassword}
                </span>
              )}
          </div>

          <button
            disabled={
              formik.isSubmitting ||
              !formik.dirty ||
              Object.entries(formik.errors).length > 0
            }
            type="submit"
            className="w-full py-3 disabled:bg-yellow-400 disabled:cursor-not-allowed cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl transition"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Return to{" "}
          <Link
            to="/auth/login"
            className="text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
