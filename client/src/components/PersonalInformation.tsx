import { Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

const PersonalInformation = () => {
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@email.com");
  const [phone, setPhone] = useState("+1 (555) 123–4567");
  const [location, setLocation] = useState("San Francisco, CA");

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm space-y-6 border border-gray-200 dark:border-zinc-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <User size={16} className="text-gray-500 dark:text-gray-400" /> Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <Mail size={16} className="text-gray-500 dark:text-gray-400" /> Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <Phone size={16} className="text-gray-500 dark:text-gray-400" /> Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <MapPin size={16} className="text-gray-500 dark:text-gray-400" /> Location
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
