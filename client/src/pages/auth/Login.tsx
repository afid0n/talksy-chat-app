import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          <span className="text-black">Chat </span>
          <span className="text-green-600">Wave</span>
        </h1>
        <p className="text-gray-600 mt-2">Welcome back to your conversations</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <button className="flex items-center justify-center w-full py-2 mb-4 border rounded-md text-gray-700 border-gray-300 hover:bg-gray-50">
          <FaGoogle className="mr-2" /> Continue with Google
        </button>

        <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
          <span className="border-t border-gray-300 flex-grow" />
          <span className="mx-3">Or continue with email</span>
          <span className="border-t border-gray-300 flex-grow" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email or Username</label>
          <input
            type="text"
            placeholder="Enter email or username"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-1" /> Remember me
          </label>
          <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all">Sign In</button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account? <a href="#" className="text-green-600 font-medium hover:underline">Create one now</a>
        </p>
      </div>
    </div>
  );
}
