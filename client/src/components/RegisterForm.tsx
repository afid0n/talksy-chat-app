import { useState } from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import ReCAPTCHA from "react-google-recaptcha";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import registerValidationSchema from "../validations/registerValidationSchema";

interface RegisterFormProps {
  onBack: () => void;
}

const RegisterForm = ({ onBack }: RegisterFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isDarkMode = localStorage.getItem("vite-ui-theme") === "dark";

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      if (!captchaVerified) {
        enqueueSnackbar("Please verify the reCAPTCHA", { variant: "error" });
        return;
      }

      console.log("Form submitted", values);
      enqueueSnackbar("Registration successful!", { variant: "success" });
    },
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;

    switch (strength) {
      case 4: return "Strong";
      case 3: return "Medium";
      case 2: return "Weak";
      default: return "Very Weak";
    }
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case "Strong":
        return "bg-green-500 w-full";
      case "Medium":
        return "bg-yellow-500 w-2/3";
      case "Weak":
        return "bg-orange-500 w-1/3";
      default:
        return "bg-red-500 w-1/6";
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-lg py-3 px-8 w-full max-w-md mx-auto"
    >
      <button
        type="button"
        className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
      >
        <FaGoogle className="mr-2" /> Sign up with Google
      </button>

      <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-4">
        <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
        <span className="mx-3">or create with email</span>
        <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
      </div>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input
          type="text"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-black dark:text-white focus:ring-2 focus:ring-yellow-500"
          placeholder="Choose a username"
        />
        {formik.touched.username && formik.errors.username && (
          <p className="text-xs text-red-500">{formik.errors.username}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input
          type="text"
          name="fullName"
          onChange={formik.handleChange}
          value={formik.values.fullName}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-black dark:text-white focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your full name"
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <p className="text-xs text-red-500">{formik.errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-black dark:text-white focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your email"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-xs text-red-500">{formik.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-black dark:text-white focus:ring-2 focus:ring-yellow-500 pr-10"
          placeholder="Create a password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-9 right-3 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
        )}

        {formik.values.password && (
          <>
            <div className="mt-2 h-2 w-full bg-gray-300 dark:bg-zinc-700 rounded">
              <div
                className={`h-full rounded transition-all ${getPasswordStrengthColor(getPasswordStrength(formik.values.password))}`}
              ></div>
            </div>
            <p className="text-xs mt-1 text-gray-500">
              Strength: {getPasswordStrength(formik.values.password)}
            </p>
          </>
        )}
      </div>

      {/* reCAPTCHA */}
      <div className="mb-4">
        <ReCAPTCHA
          sitekey="6Ld0A4orAAAAAIguOQtslv-xTFOyrSDMgkRmLeax"
          onChange={(value) => setCaptchaVerified(!!value)}
          theme={isDarkMode ? "dark" : "light"}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between space-x-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
        >
          <ChevronLeft className="inline-block mr-1" />
          Back
        </button>
        <button
          type="submit"
          disabled={!captchaVerified}
          className="w-1/2 bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition"
        >
          Create Account
        </button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        Already have an account?{" "}
        <Link to="/auth/Login" className="text-yellow-600 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
