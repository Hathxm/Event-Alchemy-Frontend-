import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LandingPage from '../../../Pages/User/LandingPage/LandingPage';
import Signup from '../../../Pages/User/Signup/Signup';
import OTP from'../../../Pages/User/OTP/OTP';
import UserLogin from '../../../Pages/User/UserLogin/Login';
import Navbar from '../Navbar/Navbar';
import UserPrivateRoute from '../UserPrivateRoute';
import Profile from '../../../Pages/User/Profile/Profile';
import Venues from '../../../Pages/User/Venues/Venues'
import Venuedetails from '../../../Pages/User/VenueDetails/VenueDetails'
import VenueServices from '../../../Pages/User/VenueServices/VenueServices';
import Checkout from '../../../Pages/User/Checkout/Checkout';
import Bookings from '../../../Pages/User/Bookings/Bookings';
import ChatPage from '../../../Pages/User/Chat/ChatPage'
import PasswordResetRequestForm from '../PasswordReset/PasswordReset';
import About from '../../../Pages/User/About/About';
import Contact from '../../../Pages/User/Contact/Contact';
import ForgotPassword from '../../../Pages/User/UserForgotPassword/ForgotPassword';
import ChangePassOTP from '../../../Pages/User/ChangePassOTP/ChangePassOTP';
import Ratings from '../../../Pages/User/Ratings/Ratings';
import axios from '../../../axiosinstance/axiosinstance';
import { useState } from 'react';
const BASEUrl = process.env.REACT_APP_BASE_URL



function UserWrapper() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  
  const token = localStorage.getItem('access');

  const fetchUserData = async () => {
    try {
      const res = await axios.get(BASEUrl + 'userdetails/')
     
      console.log(res.data)

      dispatch(
        set_Authentication({
          name: res.data.username,
          isAuthenticated: res.data.is_active,
          isAdmin: false,
          isSuperAdmin: res.data.is_superuser,
         
        })
      );
      
      dispatch(
        set_user_basic_details({
          name: res.data.first_name,
          profile_pic: res.data.profile_pic,
          email:res.data.email,
          manager_type:null
        })
      );
      setIsLoading(false);  // No token means no need to wait

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //  localStorage.clear()
     if (token) {
      fetchUserData();  // Fetch user data if token exists
    } else {
      setIsLoading(false);  // No token means no need to wait
    }
  }, [location.pathname, authentication_user]);

  // Show loading indicator or null while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;  // You can replace this with a better loading UI
  }

  

  return (
    <>
    
      
      <Routes>
      
          <Route path="/" element={<Navbar><LandingPage /> </Navbar> } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/forgotpass" element={<ForgotPassword />} />
          <Route path="/changepass/otp" element={<ChangePassOTP />} />
          <Route path="/about" element={<Navbar><About/></Navbar>} />
          <Route path="/contact" element={<Navbar><Contact></Contact></Navbar>  } />
          <Route path="/venues/:id" element={<UserPrivateRoute><Navbar><Venues/></Navbar>   </UserPrivateRoute>} />
          <Route path="/userprofile" element={<UserPrivateRoute><Navbar><Profile/></Navbar> </UserPrivateRoute>} />
          <Route path="/venue_details/:id" element={<UserPrivateRoute>  <Navbar><Venuedetails/></Navbar> </UserPrivateRoute>} />
          <Route path="/venue_services/:id" element={<UserPrivateRoute> <Navbar><VenueServices/></Navbar></UserPrivateRoute>} />
          <Route path="/checkout/:id" element={<UserPrivateRoute> <Navbar><Checkout /></Navbar></UserPrivateRoute>} />
          <Route path="/bookings" element={<UserPrivateRoute> <Navbar><Bookings /></Navbar></UserPrivateRoute>} />
          <Route path="/chat" element={<UserPrivateRoute><Navbar><ChatPage /></Navbar></UserPrivateRoute>} />
          <Route path="/reset-password" element={<UserPrivateRoute><Navbar><PasswordResetRequestForm /></Navbar></UserPrivateRoute>} />
          <Route path="/rate-event/:id" element={<UserPrivateRoute><Navbar><Ratings /></Navbar></UserPrivateRoute>} />






         
     
      </Routes>
     
     
    </>
  );
}

export default UserWrapper;
