import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white transition-colors">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-black dark:text-white">Talk</span>
          <span className="text-yellow-600">sy</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Welcome back to your conversations
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-zinc-700">
        {/* Google Button */}
        <button className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
          <FaGoogle className="mr-2" /> Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
          <span className="mx-3">Or continue with email</span>
          <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email or Username
          </label>
          <input
            type="text"
            placeholder="Enter email or username"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-sm mb-4">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input type="checkbox" className="mr-1" /> Remember me
          </label>
          <Link to={"/auth/forgot-password"} className="text-yellow-600 hover:underline">Forgot password?</Link>
        </div>

        {/* Sign In */}
        <button className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-all">
          Sign In
        </button>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link to={"/auth/register"} className="text-yellow-600 font-medium hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
