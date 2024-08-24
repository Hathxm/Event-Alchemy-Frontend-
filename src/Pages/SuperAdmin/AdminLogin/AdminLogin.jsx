import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
const BASEUrl = process.env.REACT_APP_BASE_URL



const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: '' // General error state for other issues
  });

  // Handle input change and validate
  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setFormData({
      ...formData,
      [name]: value
    });

    // Basic validation
    if (name === 'username') {
      if (trimmedValue.length < 4 && trimmedValue.length > 0) {
        setErrors({ ...errors, username: 'Username must be at least 4 characters long' });
      } else {
        setErrors({ ...errors, username: '' });
      }
    } else if (name === 'password') {
      if (trimmedValue.length < 4 && trimmedValue.length > 0) {
        setErrors({ ...errors, password: 'Password must be at least 4 characters long' });
      } else {
        setErrors({ ...errors, password: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim values before submitting
    const trimmedFormData = {
      username: formData.username.trim(),
      password: formData.password.trim()
    };

    // Check if there are any validation errors
    if (
      trimmedFormData.username.length >= 4 &&
      trimmedFormData.password.length >= 4
    ) {
      try {
        // Make a POST request to your backend API endpoint
        const response = await axios.post(`${BASEUrl}superadmin/login/`  , trimmedFormData);

        // Handle the response
        console.log('Login response:', response.data);

        // If the response contains an error message
        if (response.data.error) {
          const { error } = response.data;
          if (error.includes('Username')) {
            setErrors({ ...errors, username: error });
          } else if (error.includes('Password')) {
            setErrors({ ...errors, password: error });
          }
          return;
        }

        // Handle successful login
        // Redirect to the dashboard or wherever you need to go after login
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        // console.log(response.data.access);
        // console.log(response.data.refresh);
        dispatch(
          set_Authentication({
            name: response.data.username,
            isAuthenticated: response.data.isAuthenticated,
            isAdmin: response.data.isAdmin,
            isSuperAdmin: response.data.isSuperUser,
          })
        );

        navigate('/admin/events');

      } catch (error) {
        // Handle any errors
        console.error('Error:', error);
        setErrors({ ...errors, general: 'Login failed. Please try again.' });
      }
    } else {
      // Handle validation errors if any
      if (trimmedFormData.username.length < 4) {
        setErrors({ ...errors, username: 'Username must be at least 4 characters long' });
      }
      if (trimmedFormData.password.length < 4) {
        setErrors({ ...errors, password: 'Password must be at least 4 characters long' });
      }
    }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-black justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">SuperAdmin</h1>
          <p className="text-white mt-1">The most popular peer-to-peer lending at SEA</p>
          <button type="button" className="bg-customgray w-28 text-black mt-4 py-2 rounded-2xl font-bold mb-2">Read More</button>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
          
          {/* Username Input */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          
          {/* Password Input */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {/* General Error */}
          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
          
          <button type="submit" className="w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Login</button>
         
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;