import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useSearchParams, Link } from "react-router-dom";
import resetPasswordValidationSchema from "../../validations/resetPasswordValidation";
import { t } from "i18next";
import instance from "@/services/instance";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
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
        } = await instance.post(`/users/reset-password`, {
          token,
          newPassword: values.newPassword,
        });

        if (res.statusCode === 400 || res.statusCode === 401) {
          enqueueSnackbar(res.message || t("reset_password_invalid_token"), {
            autoHideDuration: 2500,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            variant: "error",
          });
        } else {
          enqueueSnackbar(t("reset_password_success"), {
            autoHideDuration: 2500,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            variant: "success",
          });
        }

        actions.resetForm();
      } catch {
        enqueueSnackbar(t("reset_password_error"), {
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
          {t("reset_password_title")}
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {t("reset_password_description")}

        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5 text-sm">
          <div>
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("reset_password_new_label")}
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={formik.values.newPassword}
              name="newPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("reset_password_new_placeholder")}
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
              {t("reset_password_confirm_label")}
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
              placeholder={t("reset_password_confirm_placeholder")}
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
            {t("reset_password_button")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {t("reset_password_return_login")}{" "}
          <Link
            to="/auth/login"
            className="text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            {t("reset_password_login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
