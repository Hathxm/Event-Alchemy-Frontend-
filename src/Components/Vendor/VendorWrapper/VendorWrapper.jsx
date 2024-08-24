import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import VendorLogin from '../../../Pages/Vendors/VendorLogin/VendorLogin';
import VendorSignup from  '../../../Pages/Vendors/VendorSignup/VendorSignup'
import VendorsOTP from  '../../../Pages/Vendors/VendorsOTP/VendorsOTP'
import VendorNavbar from '../VendorNavbar/VendorNavbar';
import VendorHomePage from '../../../Pages/Vendors/VendorHomePage/VendorHomePage';
import VendorDashboard from '../../../Pages/Vendors/VendorDashboard/VendorDashboard';
import VendorProfile from '../../../Pages/Vendors/VendorProfile/VendorProfile';
import isAuthVendor from '../../../utils/IsAuthVendor';
import { useEffect,useState } from 'react';
import VendorChatComponent from '../../../Pages/Vendors/Chat/Chat';
import VendorPrivateRoute from '../VendorPrivateRoute';
import ContactPage from '../../../Pages/Vendors/Contact/Contact';
import VendorForgotPassword from '../../../Pages/Vendors/VendorForgotPassword/ForgotPassword';
import ChangePassOTP from '../../../Pages/Vendors/ChangePassOTP/ChangePassOTP';
const BASEUrl = process.env.REACT_APP_BASE_URL







const VendorWrapper = () => {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const [vendor_id, set_vendor_id] = useState(null)
  const location = useLocation();



  const checkAuth = async () => {
    // Logic to check authentication
    const isAuthenticated = await isAuthVendor();
    console.log(isAuthenticated)
   
    dispatch(
      set_Authentication({
        name: isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated,
        isAdmin: isAuthenticated.isAdmin,
        isSuperAdmin: isAuthenticated.isSuperAdmin,
        isVendor: isAuthenticated.isVendor
      })
    );

  };

  const baseURL = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('access');

  const fetchUserData = async () => {
    try {
      const res = await axios.get(BASEUrl + 'vendor/details', {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(res.data)
      dispatch(
        set_user_basic_details({
          name: res.data.username,
          profile_pic: res.data.profile_pic,
          email:res.data.email,
          manager_type:null
        })
      );
    set_vendor_id(res.data.id)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authentication_user.name) {
     
      checkAuth();
    
    }
    if (authentication_user.isAuthenticated) {
      fetchUserData();
    }
  }, [location.pathname]);

  return (
    <Routes>
    <Route path="/signup" element={<VendorSignup/>} /> 
    <Route path="/otp" element={<VendorsOTP/>} /> 
    <Route path="/login" element={<VendorLogin/>} /> 
    <Route path="/forgotpass" element={<VendorForgotPassword/>} /> 
    <Route path="/changepass" element={<ChangePassOTP/>} /> 
    <Route path="/home" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorHomePage/></VendorNavbar></VendorPrivateRoute>} /> 
    <Route path="/contact" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}></VendorNavbar><ContactPage></ContactPage></VendorPrivateRoute>} /> 
    <Route path="/profile" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorProfile/></VendorNavbar></VendorPrivateRoute>} /> 
    <Route path="/dashboard" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorDashboard/></VendorNavbar></VendorPrivateRoute>} /> 
    <Route path="/chat" element={<VendorPrivateRoute><VendorNavbar vendor_id={vendor_id}><VendorChatComponent/></VendorNavbar></VendorPrivateRoute>} /> 


   
  

    
    





   

</Routes>
  )
}

export default VendorWrapper
