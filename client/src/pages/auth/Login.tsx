import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { enqueueSnackbar } from "notistack";
import { useState } from 'react';
import { loginUser } from '@/services/userService';
import { loginValidationSchema } from '@/validations/authValidation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/userSlice';
import type { UserState } from '@/types/User';
import instance from '@/services/instance';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        const response = await loginUser(values); // this sets cookies

        if (response?.message !== "login successful") {
          enqueueSnackbar(response.message || "Invalid login response", { variant: "error" });
          return;
        }

        // Now get user info from /users/me using credentials (cookies will be sent)
        const userRes = await instance.get<UserState>("/users/me", {
          withCredentials: true,
        });

        const user = userRes.data;

        const fullUser: UserState = {
          ...user,
          isAuthenticated: true,
        };

        // Step 3: dispatch to Redux
        dispatch(loginSuccess(fullUser));

        // Step 4: navigate
        navigate("/feed");
        enqueueSnackbar("Login successful!", { variant: "success" });

      } catch (error: any) {
        const message = error.response?.data?.message || 'Login failed';
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
    <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white transition-colors">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-black dark:text-white">Talk</span>
          <span className="text-yellow-600">sy</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Welcome back to your conversations
        </p>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-zinc-700"
      >
        <button
          type="button"
          onClick={() => window.location.href = `http://localhost:7070/auth/google`}
          className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <FaGoogle className="mr-2" /> Continue with Google
        </button>

        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
          <span className="mx-3">Or continue with email</span>
          <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
        </div>

        {/* EMAIL FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email or Username
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter email or username"
            className={`mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 ${formik.errors.email && formik.touched.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-zinc-600 focus:ring-yellow-500'
              }`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* PASSWORD FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className={`mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 ${formik.errors.password && formik.touched.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-zinc-600 focus:ring-yellow-500'
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
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link to="/auth/register" className="text-yellow-600 font-medium hover:underline">
            Create one now
          </Link>
        </p>
      </form>
    </div>
  );
}
