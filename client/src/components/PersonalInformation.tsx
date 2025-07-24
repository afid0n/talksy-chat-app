import { Mail, MapPin, Phone, User } from "lucide-react";
import { FaInfo } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const PersonalInformation = () => {
  const formik = useFormik({
    initialValues: {
      fullName: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123–4567",
      location: "San Francisco, CA",
      bio: "test bio",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.patch(`http://localhost:7070/users/6880b7cd8696aad839edf500`, values);
        console.log("User updated:", response.data);
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } catch (error) {
        enqueueSnackbar("Failed to update profile", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        // Handle error appropriately   
        console.error("Update failed:", error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm space-y-6 border border-gray-200 dark:border-zinc-700"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <User size={16} className="text-gray-500 dark:text-gray-400" /> Full Name
          </label>
          <input
            name="fullName"
            type="text"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Mail size={16} className="text-gray-500 dark:text-gray-400" /> Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Phone size={16} className="text-gray-500 dark:text-gray-400" /> Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <MapPin size={16} className="text-gray-500 dark:text-gray-400" /> Location
          </label>
          <input
            name="location"
            type="text"
            value={formik.values.location}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <FaInfo size={16} className="text-gray-500 dark:text-gray-400" /> Bio
          </label>
          <input
            name="bio"
            type="text"
            value={formik.values.bio}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
      >
        Update Info
      </button>
    </form>
  );
};

export default PersonalInformation;
