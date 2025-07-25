import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { changePassword } from "@/services/profileService";
import type { ChangePasswordPayload } from "@/services/profileService";
import type { RootState } from "../redux/store/store"
import { useSelector } from "react-redux";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const userSate = useSelector((state: RootState) => state.user);
  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: userSate.password || "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      if (values.newPassword !== values.confirmPassword) {
        enqueueSnackbar("New password and confirmation do not match.", {
          variant: "warning",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        return;
      }

      const payload: ChangePasswordPayload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      try {
        const response = await changePassword(userSate.id, payload);

        enqueueSnackbar(response.message || "Password updated successfully!", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });

        formik.resetForm();
      } catch (error) {
        enqueueSnackbar((error as Error).message || "Failed to update password", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        console.error("Update failed:", error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm space-y-6 border border-gray-200 dark:border-zinc-700"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Change Password
      </h2>

      {/* Current Password */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Current Password
        </label>
        <div className="relative">
          <input
            name="currentPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your current password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            👁️
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          New Password
        </label>
        <input
          name="newPassword"
          type="password"
          placeholder="Enter your new password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Confirm New Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
      >
        Update Password
      </button>
    </form>
  );
}
