import { useState } from 'react';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);

    // Здесь можно отправить запрос на API:
    // await fetch('/api/reset-password', { method: 'POST', body: JSON.stringify({ email }) });
    console.log('Reset password link sent to:', email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          <span className="text-black">Chat </span>
          <span className="text-green-600">Wave</span>
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Reset your password</h2>
        <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
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

        {submitted && (
          <p className="text-sm text-green-600 mb-4">
            If this email is registered, a password reset link has been sent.
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Remember your password?{' '}
          <a href="#" className="text-green-600 font-medium hover:underline">Sign in</a>
        </p>
      </form>
    </div>
  );
}
