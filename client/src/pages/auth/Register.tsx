import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (captchaVerified) {
      // Burada POST sorğusu göndərə bilərsən
      console.log('Form submitted!', { username, fullname, email, password });
      alert("Uğurla qeydiyyatdan keçdiniz!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          <span className="text-black">Chat </span>
          <span className="text-green-600">Wave</span>
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Create your account</h2>
        <p className="text-gray-600 mt-2">Almost there! Just a few more details</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <button
          type="button"
          className="flex items-center justify-center w-full py-2 mb-4 border rounded-md text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          <FaGoogle className="mr-2" /> Sign up with Google
        </button>

        <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
          <span className="border-t border-gray-300 flex-grow" />
          <span className="mx-3">or create with email</span>
          <span className="border-t border-gray-300 flex-grow" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ✅ Google reCAPTCHA */}
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700 mb-1">Security Verification</p>
          <ReCAPTCHA
            sitekey="6Ld0A4orAAAAAIguOQtslv-xTFOyrSDMgkRmLeax"  // ⚠️ BURANI DƏYİŞİN!
            onChange={handleCaptchaChange}
          />
          {formSubmitted && !captchaVerified && (
            <p className="text-red-500 text-xs mt-2">
              Please complete the reCAPTCHA verification above
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between space-x-4 mt-6">
          <button
            type="button"
            className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-all"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
            disabled={!captchaVerified}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
