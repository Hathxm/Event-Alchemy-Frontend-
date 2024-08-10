import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormComponentRight from '../../../Components/User/SignupForm/SignupForm';
const BASEUrl = process.env.REACT_APP_BASE_URL
const base_url = "http://127.0.0.1:8000/";

const SignupForm = () => {
  const navigate = useNavigate();

  const signupFields = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      validate: (value) => value.length >= 6 ? '' : 'Username must be at least 6 characters long',
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address',
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      validate: (value) => value.length >= 8 ? '' : 'Password must be at least 8 characters long',
    },
    {
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      validate: (value) => value.length >= 4 ? '' : 'Name must be at least 4 characters long',
    },
    {
      name: 'phone',
      type: 'tel',
      placeholder: 'Phone Number',
      pattern: '\\+91-\\d{5}-\\d{5}',
      title: 'Phone number must be in the format +91-xxxxx-xxxxx',
      validate: (value) => /^\+91-\d{5}-\d{5}$/.test(value) ? '' : 'Phone number must be in the format +91-xxxxx-xxxxx',
    },
  ];

  const handleSignup = async (formData, setErrors) => {
    try {
      const response = await axios.post(BASEUrl + "vendor/signup", formData);

      if (response.data.error) {
        const { error } = response.data;
        if (error.includes('Username')) {
          setErrors((prevErrors) => ({ ...prevErrors, username: error }));
        } else if (error.includes('Email')) {
          setErrors((prevErrors) => ({ ...prevErrors, email: error }));
        }
        return;
      }

      const { otp } = response.data;
      localStorage.setItem('email', formData.email);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('password', formData.password);
      localStorage.setItem('name', formData.name);
      localStorage.setItem('otp', otp);
      const otpTime = new Date().toISOString();
      localStorage.setItem('otpTime', otpTime);

      navigate('/vendor/otp');
    } catch (error) {
      console.error('Error during signup:', error.response || error.message);
      setErrors({
        general: error.response?.data?.error || 'Signup failed. Please try again.',
      });
    }
  };

  // Validate fields one by one and stop at the first invalid field
  const handleSubmit = async (formData, setErrors) => {
    const newErrors = {};
    let allValid = true;

    for (const field of signupFields) {
      const error = field.validate(formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        allValid = false;
        break; // Stop validation on first error
      }
    }

    setErrors(newErrors);

    if (allValid) {
      await handleSignup(formData, setErrors);
    }
  };
  

  return (
    <FormComponentRight
      fields={signupFields}
      onSubmit={handleSubmit}
      heading="Join Us Today!"
      description="Create your account and start your journey with us."
      buttonText="Signup"
      backgroundImageUrl="https://handydallaireevents.com/wp-content/uploads/2022/10/LyTpreview__002-682x1024.jpg"
      caption="Create Your Account"
      redirectText="Already have an account?"
      redirectLink="/vendor/login"
      google_signup_url="vendor/google-signup"
      google_signup_navigate_url="/vendor/home"
      otp_url = "/vendor/otp"
      vendor_or_user = "User"
      vendor_or_user_redirect_link = "/signup"
      

    />
  );
};
  
export default SignupForm;
