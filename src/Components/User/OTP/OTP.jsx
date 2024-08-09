import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
const BASEUrl = process.env.REACT_APP_BASE_URL


export default function OTPInput({ usertype, profile_link }) { // destructure props
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [message, setMessage] = useState(''); // State to store success or error messages
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    const storedOtp = localStorage.getItem('otp');
    const email = localStorage.getItem('email');
    const otpSentTime = new Date(localStorage.getItem('otp_sent_time'));
    const currentTime = new Date();
  
    // Check if OTP is expired (2 minutes = 120000 milliseconds)
    const otpValidityPeriod = 120000; // 2 minutes in milliseconds
    if (currentTime - otpSentTime > otpValidityPeriod) {
      setMessage('OTP has expired. Please request a new one.');
      return;
    }
  
    if (enteredOtp === storedOtp) {
      try {
        const response = await axios.get(`${BASEUrl}${usertype}/forgot-password`, {
          params: { email }, // Send email as query parameter
        });
  
        if (response.status === 200) {
          // OTP is verified, store token and redirect to profile page
          localStorage.setItem('access', response.data.access);
          localStorage.setItem('refresh', response.data.refresh);
          localStorage.removeItem('otp')
          localStorage.removeItem('otp_sent_time')
          localStorage.removeItem('email')


    
          dispatch(
            set_Authentication({
              name:response.data.user_details.username,
              isAuthenticated: response.data.user_details.is_active,
              isAdmin: response.data.user_details.is_Manager,
              isSuperAdmin: response.data.user_details.username,
             
            })
          );
          
          navigate(profile_link)
    // Redirect to profile page where password change can be done
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to verify OTP. Please try again.');
      }
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Enter Your OTP</h1>
          <p className="text-gray-400 mb-6">Please enter the one-time password sent to your device.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  className="w-12 h-12 text-center text-white text-2xl border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              <span className="font-bold" id="timer">
                {formatTime(timer)}
              </span>
            </div>
          </div>
          {message && <p className="text-center text-red-500">{message}</p>}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit OTP
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-400">This OTP will expire in 2 minutes.</p>
        </div>
      </div>
    </div>
  );
}