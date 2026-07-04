import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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

    } catch (error) {
      console.log(error);
      // The stored token was rejected (or the request failed). Clear the stale
      // credentials and reset auth so the app falls back to a logged-out state
      // instead of hanging on the loading screen.
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        dispatch(
          set_Authentication({
            name: null,
            isAuthenticated: false,
            isAdmin: false,
            isSuperAdmin: false,
            isVendor: false,
          })
        );
      }
    } finally {
      // Always stop the loader so the UI renders and the user can act (e.g. log out).
      setIsLoading(false);
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
      
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/forgotpass" element={<ForgotPassword />} />
          <Route path="/changepass/otp" element={<ChangePassOTP />} />

          <Route element={<Navbar><Outlet /></Navbar>}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route element={<UserPrivateRoute><Outlet /></UserPrivateRoute>}>
                  <Route path="/venues/:id" element={<Venues />} />
                  <Route path="/userprofile" element={<Profile />} />
                  <Route path="/venue_details/:id" element={<Venuedetails />} />
                  <Route path="/venue_services/:id" element={<VenueServices />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/reset-password" element={<PasswordResetRequestForm />} />
                  <Route path="/rate-event/:id" element={<Ratings />} />
              </Route>
          </Route>






         
     
      </Routes>
     
     
    </>
  );
}

export default UserWrapper;
