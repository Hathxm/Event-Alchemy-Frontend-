import React, { useEffect, useState } from 'react';
import Loader from '../../Common/Loader/Loader';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import axios from '../../../axiosinstance/axiosinstance';
import VendorLogin from '../../../Pages/Vendors/VendorLogin/VendorLogin';
import VendorSignup from '../../../Pages/Vendors/VendorSignup/VendorSignup';
import VendorsOTP from '../../../Pages/Vendors/VendorsOTP/VendorsOTP';
import VendorNavbar from '../VendorNavbar/VendorNavbar';
import VendorHomePage from '../../../Pages/Vendors/VendorHomePage/VendorHomePage';
import VendorDashboard from '../../../Pages/Vendors/VendorDashboard/VendorDashboard';
import VendorProfile from '../../../Pages/Vendors/VendorProfile/VendorProfile';
import VendorPrivateRoute from '../VendorPrivateRoute';
import ContactPage from '../../../Pages/Vendors/Contact/Contact';
import VendorForgotPassword from '../../../Pages/Vendors/VendorForgotPassword/ForgotPassword';
import ChangePassOTP from '../../../Pages/Vendors/ChangePassOTP/ChangePassOTP';
import VendorChatComponent from '../../../Pages/Vendors/Chat/Chat';
import { toast } from 'react-toastify';

const BASEUrl = process.env.REACT_APP_BASE_URL;

function VendorWrapper() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [vendor_id, set_vendor_id] = useState(null);

  const token = localStorage.getItem('access');

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${BASEUrl}vendor/details`, {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Vendor status:', res.data.is_vendor);

      dispatch(
        set_Authentication({
          name: res.data.username,
          isAuthenticated: res.data.is_active,
          isAdmin: false,
          isSuperAdmin: res.data.is_superuser,
          isVendor: res.data.is_vendor,  // Ensure isVendor is set correctly
        })
      );

      dispatch(
        set_user_basic_details({
          name: res.data.username,
          profile_pic: res.data.profile_pic,
          email: res.data.email,
          manager_type: null,
        })
      );

      set_vendor_id(res.data.id);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        toast.error('You are not authorized to access this page.');
      } else if (status === 401 || status === 403) {
        // Stored token was rejected — clear it and reset auth so the app recovers
        // to a logged-out state instead of hanging on the loading screen.
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
      } else {
        console.error('Error fetching vendor data:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route path="/signup" element={<VendorSignup />} />
        <Route path="/otp" element={<VendorsOTP />} />
        <Route path="/login" element={<VendorLogin />} />
        <Route path="/forgotpass" element={<VendorForgotPassword />} />
        <Route path="/changepass" element={<ChangePassOTP />} />
        <Route path="/home" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorHomePage /></VendorNavbar></VendorPrivateRoute>} />
        <Route path="/dashboard" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorDashboard /></VendorNavbar></VendorPrivateRoute>} />
        <Route path="/profile" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorProfile /></VendorNavbar></VendorPrivateRoute>} />
        <Route path="/contact" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}></VendorNavbar><ContactPage /></VendorPrivateRoute>} />
        <Route path="/chat" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorChatComponent /></VendorNavbar></VendorPrivateRoute>} />
      </Routes>
    </>
  );
}

export default VendorWrapper;
