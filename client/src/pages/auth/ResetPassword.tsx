import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    console.log('Reset password link sent to:', email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-black dark:text-white transition-colors">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-black dark:text-white">Talk</span>
          <span className="text-yellow-600">sy</span>
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">
          Reset your password
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Enter your email to receive a reset link
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-lg p-8 w-full max-w-md transition"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {submitted && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
            If this email is registered, a password reset link has been sent.
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-all"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Remember your password?{' '}
          <Link to={"/auth/login"} className="text-yellow-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
