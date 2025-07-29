import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { FaGoogle } from "react-icons/fa";
import { t } from "i18next";

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

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:7070";

const initialValues = {
  username: "",
  fullName: "",
  email: "",
  password: "",
};

const RegisterForm = ({ onBack, onSubmit, loading }: RegisterFormProps) => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Sync theme on mount
  useEffect(() => {
    const checkTheme = () =>
      document.documentElement.classList.contains("dark");
    setIsDark(checkTheme());
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t("register_username_min"))
      .required(t("register_username_required")),
    fullName: Yup.string()
      .min(3, t("register_fullname_min"))
      .required(t("register_fullname_required")),
    email: Yup.string()
      .email(t("register_email_invalid"))
      .required(t("register_email_required")),
    password: Yup.string()
      .min(6, t("register_password_min"))
      .required(t("register_password_required")),
  });

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const handleFormSubmit = async (values: typeof initialValues) => {
    if (!captchaVerified) {
      enqueueSnackbar(t("register_recaptcha_error"), {
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

      enqueueSnackbar(error?.message || t("register_failed"), {
        variant: "error",
      });
    }
  };

  // Params from localStorage
  const birthday = localStorage.getItem("register_birthday") || undefined;
  const location = localStorage.getItem("register_location") || undefined;
  const interests = localStorage.getItem("register_interests") || undefined;

  const params = new URLSearchParams();
  if (birthday) params.append("birthday", birthday);
  if (location) params.append("location", location);
  if (interests) params.append("interests", interests);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-lg py-6 px-4 sm:px-8 w-full max-w-md mx-auto transition">
      {/* Google Auth Button */}
      <button
        type="button"
        onClick={() =>
          (window.location.href = `${SERVER_URL}/auth/google?${params.toString()}`)
        }
        className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
      >
        <FaGoogle className="mr-2" />
        {t("register_google_button")}
      </button>

      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
        {t("register_title")}
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
                label: t("register_username_label"),
                type: "text",
                placeholder: t("register_username_placeholder"),
              },
              {
                name: "fullName",
                label: t("register_fullname_label"),
                type: "text",
                placeholder: t("register_fullname_placeholder"),
              },
              {
                name: "email",
                label: t("register_email_label"),
                type: "email",
                placeholder: t("register_email_placeholder"),
              },
              {
                name: "password",
                label: t("register_password_label"),
                type: "password",
                placeholder: t("register_password_placeholder"),
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
                sitekey="6LdhmZIrAAAAAII-wdpHCv9KsfxclNuteaRPnqAa"
                onChange={handleCaptchaChange}
                theme={isDark ? "dark" : "light"}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-1/2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
              >
                <ChevronLeft className="inline-block mr-1" />
                {t("register_back_button")}
              </button>
              <button
                type="submit"
                disabled={loading || isSubmitting || !captchaVerified}
                className="w-full sm:w-1/2 bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t("register_submit_loading")
                  : t("register_submit_button")}
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              {t("register_login_prompt")}{" "}
              <Link
                to="/auth/Login"
                className="text-yellow-600 font-medium hover:underline"
              >
                {t("register_login_link")}
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
