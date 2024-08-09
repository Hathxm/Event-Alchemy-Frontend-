import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';




const base_url = "http://127.0.0.1:8000/";


const FormComponentLeft = ({
  fields,
  onSubmit,
  heading,
  description,
  buttonText,
  backgroundImageUrl,
  caption,
  redirectText,
  redirectLink,
  google_signup_url,
  google_signup_navigate_url,
  isVendor,
  forgot_pass_url,

}) => {
  const [formData, setFormData] = useState(() => {
    const initialState = {};
    fields.forEach((field) => {
      initialState[field.name] = '';
    });
    return initialState;
  });

  const [errors, setErrors] = useState(() => {
    const initialErrors = {};
    fields.forEach((field) => {
      initialErrors[field.name] = '';
    });
    return initialErrors;
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let valid = true;

    fields.forEach((field) => {
      const error = field.validate(formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        valid = false;
      }
    });

    if (valid) {
      await onSubmit(formData, navigate, setErrors);
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token)
    try {
      const response = await axios.post(base_url + google_signup_url, { token });
      console.log("Received response:", response);

      // If user exists, log them in and navigate to the homepage
      if (response.status === 200) {
        const { email, username, access, refresh } = response.data;
        localStorage.setItem('email', email);
        localStorage.setItem('username', username);
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        dispatch(set_Authentication({
          name: username,
          isAuthenticated: true,
          isAdmin: false,  // Adjust based on your user model
          isSuperAdmin: false,  // Adjust based on your user model
          isVendor: isVendor,
        }));

        navigate(google_signup_navigate_url);
      } else {
        // If user is new, proceed with OTP verification
      }
    } catch (error) {
      console.error('Error during Google signup:', error.response || error.message);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google signup error:', error);
  };


  return (
    <section className="h-screen flex items-stretch text-white overflow-hidden bg-gray-500">
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-gray-800">
        <div className="w-full py-6 z-20">
          <h1 className="text-4xl mb-4 text-white">{heading}</h1>
          <p className="text-lg mb-4 text-white">{description}</p>
          <form
            className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto bg-white rounded-lg border-2 border-gray-500 p-6"
            onSubmit={handleSubmit}
          >
            {fields.map((field, index) => (
              <div className="pb-2 pt-4" key={index}>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full p-2 text-lg rounded-lg bg-gray-200 border-2 border-transparent focus:outline-none text-black ${errors[field.name] ? 'border-red-500' : 'focus:border-blue-600'}`}
                />
                {errors[field.name] && <p className="text-red-500">{errors[field.name]}</p>}
              </div>
            ))}
            <div className="px-4 pb-2 pt-4">
              <button
                type="submit"
                className="uppercase w-full p-2 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none btn-primary"
              >
                {buttonText}
              </button>
              <GoogleOAuthProvider clientId="904166899914-ifk76sjg7b682oq6pcuqkb4le1n1rjtt.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </GoogleOAuthProvider>
            </div>
            {errors.general && <p className="text-red-500">{errors.general}</p>}
          </form>
          <div className="text-center sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            <p className="mt-4 text-lg text-white">{redirectText} <a href={redirectLink} className="underline">Signup</a></p>
            <p className="mt-4 text-lg text-white">Forgot Password ? <a href={forgot_pass_url} className="underline">Click Here</a></p>

          </div>
        </div>
      </div>
      <div className="lg:w-1/2 hidden lg:flex items-center justify-center bg-no-repeat bg-cover relative" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
        <div className="absolute bg-black opacity-50 inset-0 z-0"></div>
        <div className="w-full px-24 z-10 text-center">
          <h1 className="text-5xl font-bold text-white">{heading}</h1>
          <p className="text-3xl my-4 text-white">{caption}</p>
        </div>
      </div>
    </section>
  );
};

export default FormComponentLeft;