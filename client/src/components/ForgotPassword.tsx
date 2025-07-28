import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import instance from "@/services/instance";

interface Props {
  onSubmit: (email: string) => void;
}

const ForgotPasswordCom: React.FC<Props> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res: {
        message: string;
        statusCode?: number;
      } = await instance.post(`/users/forgot-password`, {
        email,
      });

      if (res.statusCode === 401) {
        enqueueSnackbar(res.message || t("forgot_password_unauthorized"), {
          variant: "error",
        });
        return;
      }

      enqueueSnackbar(t("forgot_password_success"), {
        variant: "success",
      });

      onSubmit(email);
    } catch {
      enqueueSnackbar(t("forgot_password_error"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Talk<span className="text-yellow-500">sy</span>
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          {t("forgot_password_subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Email Address
             {t("forgot_password_email_label")}
            <input
              type="email"
              className="mt-1 w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder= {t("forgot_password_email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md disabled:opacity-60"
          >
            {loading ? t("forgot_password_button_loading") : t("forgot_password_button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordCom;
