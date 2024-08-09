import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';// Import toast for notifications
const BASEUrl = process.env.REACT_APP_BASE_URL// Adjust base URL as needed

export default function ForgotPassword({ usertype, otp_link }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    setLoading(true); // Set loading state
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    try {
      console.log(`Sending request to ${BASEUrl}${usertype}/forgot-password`);
      const response = await axios.post(`${BASEUrl}${usertype}/forgot-password`, { email });

      if (response.status === 200) {
        const otp = response.data.otp;
        const sentTime = new Date().toISOString(); // Store current timestamp

        // Store OTP and sent time in local storage
        localStorage.setItem('otp', otp);
        localStorage.setItem('otp_sent_time', sentTime);
        localStorage.setItem('email', email);

        toast.success('A one-time password has been sent to your email.');
        navigate(otp_link);
      }
    } catch (err) {
      console.error('Error:', err); // Log the error for debugging
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Something went wrong. Please try again.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500">
            Enter your email below and we'll send you a one-time password to reset your password.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-500 rounded-md bg-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <button
            type="submit"
            className={`w-full py-2 bg-gray-400 font-semibold rounded-lg shadow-md hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
