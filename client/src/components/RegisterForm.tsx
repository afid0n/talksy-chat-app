import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  onBack: () => void;
  onSubmit: (values: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }) => void;
  loading?: boolean;
}

const RegisterForm = ({ onBack, onSubmit, loading }: RegisterFormProps) => {
  const initialValues = {
    username: "",
    fullName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(3, "At least 3 characters").required("Username is required"),
    fullName: Yup.string().min(3, "At least 3 characters").required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
  });

  const handleFormSubmit = (values: typeof initialValues) => {
    onSubmit(values); // This handles actual registration
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-lg py-3 px-8 w-full max-w-md mx-auto transition">
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
              { name: "username", label: "Username", type: "text", placeholder: "Choose a username" },
              { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name" },
              { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
              { name: "password", label: "Password", type: "password", placeholder: "Create a password" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                disabled={loading || isSubmitting}
                className="w-1/2 bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link to="/auth/Login" className="text-yellow-600 font-medium hover:underline">
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
