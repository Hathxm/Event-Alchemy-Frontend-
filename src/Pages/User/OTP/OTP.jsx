import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BASEUrl = process.env.REACT_APP_BASE_URL

const VendorsOTP = () => {

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // Initial time in seconds
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve stored data from local storage
      const storedUsername = localStorage.getItem('username');
      const storedName = localStorage.getItem('name');
      const storedEmail = localStorage.getItem('email');
      const storedPassword = localStorage.getItem('password');
      const storedOTP = localStorage.getItem('otp');
      const storedOTPTime = localStorage.getItem('otpTime');

      // Check if the entered OTP matches the stored OTP
      if (otp === storedOTP) {
        // Calculate time difference
        const otpTime = new Date(storedOTPTime);
        const currentTime = new Date();
        const timeDifference = currentTime - otpTime;
        const minutesDifference = Math.floor((timeDifference / 1000) / 60); // Convert milliseconds to minutes

        // Check if the OTP is expired
        if (minutesDifference <= 2) {
          // Make a POST request to verify OTP
          const response = await axios.post(`${BASEUrl}otp`, {
            username: storedUsername,
            email: storedEmail,
            password: storedPassword,
            name: storedName,
          });

          setSuccessMessage(response.data.message);
          localStorage.clear();
          navigate('/login');
        } else {
          setErrors('OTP has expired. Please request a new OTP.');
        }
      } else {
        setErrors('Incorrect OTP.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors('An error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      } else {
        setShowResendButton(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingTime]);

  const handleResend = async () => {
    try {
      const resendEmail = localStorage.getItem('email');
      if (!resendEmail) {
        setErrors('No email found. Please signup again.');
        return;
      }

      const response = await axios.post(`${BASEUrl}resendotp`, { email: resendEmail });

      setShowResendButton(false);
      setRemainingTime(120);
      setSuccessMessage(response.data.message);
      localStorage.setItem('otp', response.data.otp);
      localStorage.setItem('otpTime', new Date());
    } catch (error) {
      setErrors('An error occurred while resending OTP.');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center items-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold">Enter Your OTP</h1>
              {errors && <p className="text-red-500">{errors}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <input
                  autoComplete="off"
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={handleChange}
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="OTP"
                  required
                />
                <label
                  htmlFor="otp"
                  className="absolute left-0 -top-4 text-gray-600 text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  OTP
                </label>
              </div>
              <div className="flex justify-center mb-4">
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-300">
                  Submit
                </button>
              </div>
            </form>
            {showResendButton ? (
              <div className="flex justify-center">
                <button onClick={handleResend} className="bg-yellow-500 text-white rounded-md px-4 py-2 hover:bg-yellow-600 transition duration-300">
                  Resend OTP
                </button>
              </div>
            ) : (
              <p className="text-center">Resend OTP in: {formatTime(remainingTime)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsOTP;