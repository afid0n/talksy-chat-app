import React from "react";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import forgotPasswordValidationSchema from ".././validations/forgotPasswordvalidation";

interface Props {
  onSubmit: (email: string) => void;
}

const ForgotPasswordCom: React.FC<Props> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      onSubmit(values.email);
      enqueueSnackbar("Reset link sent!", { variant: "success" });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Talk<span className="text-yellow-500">sy</span>
        </h1>
        <p className="text-center mb-6">Forgot your password?</p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium">
            Email Address
            <input
              type="email"
              name="email"
              className={`mt-1 w-full p-3 border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm -mt-2">
              {formik.errors.email}
            </div>
          )}

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordCom;
