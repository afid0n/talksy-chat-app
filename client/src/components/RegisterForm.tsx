import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { FaGoogle } from "react-icons/fa";

interface RegisterFormProps {
  onBack: () => void;
  onSubmit: (values: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loading?: boolean;
}

const RegisterForm = ({ onBack, onSubmit, loading }: RegisterFormProps) => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Ref for resetting captcha
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const theme = localStorage.getItem("vite-ui-theme");
    setIsDark(theme === "dark");
  }, []);

  const initialValues = {
    username: "",
    fullName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "At least 3 characters")
      .required("Username is required"),
    fullName: Yup.string()
      .min(3, "At least 3 characters")
      .required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "At least 6 characters")
      .required("Password is required"),
  });

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const handleFormSubmit = async (values: typeof initialValues) => {
    if (!captchaVerified) {
      enqueueSnackbar("Please complete the reCAPTCHA verification", {
        variant: "error",
      });
      return;
    }

    try {
      await onSubmit(values);

    } catch (error: any) {
      setCaptchaVerified(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      enqueueSnackbar(
        error?.message || "Registration failed. Please try again.",
        { variant: "error" }
      );
    }
  };
  const birthday = localStorage.getItem("register_birthday") || undefined;;
  const location = localStorage.getItem("register_location") || undefined;;
  const interests = localStorage.getItem("register_interests") || undefined;;

  const params = new URLSearchParams();

  if (birthday) params.append("birthday", birthday);
  if (location) params.append("location", location);
  if (interests) params.append("interests", interests);


  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-lg py-3 px-8 w-full max-w-md mx-auto transition">
      <button
        type="button"
        onClick={() => window.location.href = `http://localhost:7070/auth/google?${params.toString()}`}
        className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
      >
        <FaGoogle className="mr-2" /> Continue with Google
      </button>
      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
        Create your account
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {[
              {
                name: "username",
                label: "Username",
                type: "text",
                placeholder: "Choose a username",
              },
              {
                name: "fullName",
                label: "Full Name",
                type: "text",
                placeholder: "Enter your full name",
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "Create a password",
              },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {label}
                </label>
                <Field
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <ErrorMessage
                  name={name}
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
            ))}

            <div className="mt-4 flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Ld0A4orAAAAAIguOQtslv-xTFOyrSDMgkRmLeax"
                onChange={handleCaptchaChange}
                theme={isDark ? "dark" : "light"}
              />
            </div>

            <div className="flex justify-between space-x-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="w-1/2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
              >
                <ChevronLeft className="inline-block mr-1" /> Back
              </button>
              <button
                type="submit"
                disabled={loading || isSubmitting || !captchaVerified}
                className="w-1/2 bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/auth/Login"
                className="text-yellow-600 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
