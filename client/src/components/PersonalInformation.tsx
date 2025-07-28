import { Mail, User2, } from "lucide-react";
import { FaInfo } from "react-icons/fa";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { t } from "i18next";
import instance from "@/services/instance";
import type { User } from "@/types/User";

const PersonalInformation: React.FC<{ userr: Partial<User> }> = ({ userr }) => {

  const [previewImage, setPreviewImage] = useState(userr?.avatar?.url || "");



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: userr.fullName || "",
      email: userr.email || "",
      location: {
        city: userr?.location?.city || "",
        country: userr?.location?.country || "",
      },
      bio: userr.bio || "",
      profileImage: null,
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("bio", values.bio);
        formData.append("location[city]", values.location.city);
        formData.append("location[country]", values.location.country);
        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const response = await instance.patch(
          `/users/${userr.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        enqueueSnackbar("Updated profile successfully", { variant: "success" });
        console.log("User updated:", response.data);
      } catch (error) {
        enqueueSnackbar("Failed to update profile", { variant: "error" });
        console.error("Update failed:", error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md space-y-8 border border-gray-200 dark:border-zinc-700 relative"
    >


      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {t("personal_information")}
      </h3>

      {/* Avatar + Upload */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 dark:border-zinc-600">
          <img
            src={previewImage || "/default-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file) {
              formik.setFieldValue("profileImage", file);
              setPreviewImage(URL.createObjectURL(file));
            }
          }}
          className="text-sm file:bg-yellow-500 file:hover:bg-yellow-600 file:text-white file:rounded file:px-4 file:py-2 file:border-none cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <User2 size={16} /> {t("full_name")}
          </label>
          <input
            name="fullName"
            type="text"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Mail size={16} /> {t("email_address")}
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("city")}</label>
          <input
            name="location.city"
            type="text"
            value={formik.values.location.city}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("country")}</label>
          <input
            name="location.country"
            type="text"
            value={formik.values.location.country}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <FaInfo size={16} /> {t("bio")}
          </label>
          <textarea
            name="bio"
            rows={3}
            value={formik.values.bio}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-lg"
        >
          {t("update_info")}
        </button>
      </div>
    </form>
  );
};

export default PersonalInformation;
