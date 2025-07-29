import { FaGoogle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from 'react';
import { loginUser } from '@/services/userService';
import { loginValidationSchema } from '@/validations/authValidation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/userSlice';
import type { UserState } from '@/types/User';
import instance from '@/services/instance';
import { t } from 'i18next';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const urlToken = params.get("token");

  if (urlToken) {
    localStorage.setItem("token", urlToken);
    instance.defaults.headers.common["Authorization"] = `Bearer ${urlToken}`;
    window.history.replaceState({}, "", location.pathname);
    fetchUser();
  } else {
    const savedToken = localStorage.getItem("token");
    if (savedToken && savedToken !== "undefined") {
      instance.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      fetchUser();
    } else {
      navigate("/auth/login");
    }
  }

  async function fetchUser() {
    try {
      const res = await instance.get<UserState>("/users/me");
      dispatch(loginSuccess({ ...res.data, isAuthenticated: true }));
    } catch {
      localStorage.removeItem("token");
      delete instance.defaults.headers.common["Authorization"];
      navigate("/auth/login");
    }
  }
}, [location.search, dispatch, navigate]);


  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:7070";

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
  onSubmit: async (values) => {
  setLoading(true);
  try {
    // Step 1: login to get token
    const response = await loginUser(values);



    if (response?.message !== "login successful") {
      enqueueSnackbar(response?.message || t("login_failed"), { variant: "error" });
      setLoading(false);
      return;
    }

    // Save token to localStorage
    localStorage.setItem("token", response.token);

    // Set token as default Authorization header for future requests
    instance.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

    // Step 2: Get user info using the token set above
    const userRes = await instance.get<UserState>("/users/me");

    const user = userRes.data;

    const fullUser: UserState = {
      ...user,
      isAuthenticated: true,
    };

    // Step 3: dispatch to Redux
    dispatch(loginSuccess(fullUser));

    // Step 4: navigate
    enqueueSnackbar(t("login_success"), { variant: "success" });
    navigate("/feed");

  } catch (error: any) {
    const message = error.response?.data?.message || t("login_failed");
    enqueueSnackbar(message, {
      autoHideDuration: 2000,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
      variant: "error",
    });
  } finally {
    setLoading(false);
  }
}

  });

return (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 text-black dark:text-white transition-colors">
    <div className="mb-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold">
        <span className="text-black dark:text-white">Talk</span>
        <span className="text-yellow-600">sy</span>
      </h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
        {t("login_subtitle")}
      </p>
    </div>

    <form
      onSubmit={formik.handleSubmit}
      className="bg-white dark:bg-zinc-900 shadow-md rounded-lg px-6 py-8 sm:p-8 w-full max-w-md border border-gray-200 dark:border-zinc-700"
    >
      <button
        type="button"
        onClick={() => window.location.href = `${SERVER_URL}/auth/google`}
        className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
      >
        <FaGoogle className="mr-2" />
        {t("login_google")}
      </button>

      <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-4">
        <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
        <span className="mx-3">{t("login_or_continue_with_email")}</span>
        <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("login_email_label")}
        </label>
        <input
          type="text"
          name="email"
          placeholder={t("login_email_placeholder")}
          className={`mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
            formik.errors.email && formik.touched.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-zinc-600 focus:ring-yellow-500"
          }`}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.email && formik.touched.email && (
          <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("login_password_label")}
        </label>
        <input
          type="password"
          name="password"
          placeholder={t("login_password_placeholder")}
          className={`mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
            formik.errors.password && formik.touched.password
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-zinc-600 focus:ring-yellow-500"
          }`}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.password && formik.touched.password && (
          <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <Link to="/auth/forgot-password" className="text-yellow-600 hover:underline">
          {t("login_forgot_password")}
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-all ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? t("login_button_loading") : t("login_button")}
      </button>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        {t("login_no_account")}{" "}
        <Link to="/auth/register" className="text-yellow-600 font-medium hover:underline">
          {t("login_create_account")}
        </Link>
      </p>
    </form>
  </div>
);

}
