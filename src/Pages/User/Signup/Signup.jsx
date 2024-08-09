import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FormComponent from '../../../Components/User/SignupForm/SignupForm';


const base_url = "http://127.0.0.1:8000/";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signupFields = [
    { name: 'username', type: 'text', placeholder: 'Username', validate: (value) => value.length > 0 && value.length < 6 ? 'Username must be at least 6 characters long' : '' },
    { name: 'email', type: 'email', placeholder: 'Email', validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address' },
    { name: 'password', type: 'password', placeholder: 'Password', validate: (value) => value.length > 0 && value.length < 8 ? 'Password must be at least 8 characters long' : '' },
    { name: 'name', type: 'text', placeholder: 'Name', validate: (value) => value.length > 0 && value.length < 4 ? 'Name must be at least 4 characters long' : '' }
  ];

  const handleSignup = async (formData, setErrors) => {
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(base_url + "signup", formData);
      console.log("Received response:", response);

      if (response.data.error) {
        const { error } = response.data;
        console.log("Received error:", error);
        if (error.includes('Username')) {
          setErrors(prevErrors => ({ ...prevErrors, username: error }));
        } else if (error.includes('Email')) {
          setErrors(prevErrors => ({ ...prevErrors, email: error }));
        }
        return;
      }

      // If successful, handle storing data and navigation
      const { otp } = response.data;
      localStorage.setItem('email', formData.email);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('password', formData.password);
      localStorage.setItem('name', formData.name);
      localStorage.setItem('otp', otp);
      const otpTime = new Date().toISOString();
      localStorage.setItem('otpTime', otpTime);

      navigate('/otp');
    } catch (error) {
      console.error('Error during signup:', error.response || error.message);
      // General error handling, fallback in case no specific error is found
      setErrors({
        general: error.response?.data?.error || 'Signup failed. Please try again.'
      });
    }
  };



  return (
  <>
      <FormComponent
        fields={signupFields}
        onSubmit={handleSignup}
        heading="Join Us Today!"
        description="Create your account and start your journey with us."
        buttonText="Signup"
        backgroundImageUrl="https://handydallaireevents.com/wp-content/uploads/2022/01/Handy-Dallaire-Events-Nantucket-Weddings-1536x1024.jpg"
        caption="Create Your Account"
        redirectText="Already have an account?"
        redirectLink="/login"
        google_signup_url="google-signup"
        google_signup_navigate_url="/"
        otp_url = "/otp"
        vendor_or_user = "Vendor"
        vendor_or_user_redirect_link = "/vendor/signup"

        
      />
      
    </>
     
  );
};

export default SignupForm;
 