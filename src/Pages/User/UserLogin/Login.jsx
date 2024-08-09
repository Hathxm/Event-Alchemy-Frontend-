import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import FormComponent from '../../../Components/User/LoginForm/LoginForm';



const base_url = "http://127.0.0.1:8000/";

const LoginForm = () => {
  const dispatch = useDispatch();

  const loginFields = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      validate: (value) => value.length < 6 ? 'Username must be at least 6 characters long' : ''
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      validate: (value) => value.length < 8 ? 'Password must be at least 8 characters long' : ''
    }
  ];

  const handleLogin = async (formData, navigate, setErrors) => {
    try {
      const response = await axios.post(`${base_url}userlogin`, formData);

      if (response.data.error) {
        const { error } = response.data;
        if (error) {
          setErrors({ general: error });
        }
        return;
      }
      console.log(response.data)
      

      const { access, refresh } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      dispatch(set_Authentication({
        name:response.data.username,
        isAuthenticated: response.data.isAuthenticated ,
        isAdmin: response.data.isAdmin,
        isSuperAdmin: response.data.isSuperAdmin,
      }));

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    }
  };

  return (
    <FormComponent
      fields={loginFields}
      onSubmit={handleLogin}
      heading="Welcome Back!"
      description="Login to access your account."
      buttonText="Login"
      backgroundImageUrl="https://swankeventsboston.com/wp-content/uploads/2019/07/swank-events-boston-holiday-parties.png"
      caption="Welcome back!"
      redirectText="Don't have an account?"
      redirectLink="/signup"
      google_signup_url="google-signup"
      google_signup_navigate_url="/"
      forgot_pass_url = "/forgotpass"
     
    />
  );
};

export default LoginForm;