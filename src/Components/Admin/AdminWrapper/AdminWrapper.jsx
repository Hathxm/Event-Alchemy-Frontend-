import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import isAuthAdmin from '../../../utils/IsAuthAdmin';
import AdminLogin from '../../../Pages/SuperAdmin/AdminLogin/AdminLogin';
import AdminHome from '../../../Pages/SuperAdmin/AdminHome/AdminHome';
import AdminSidebar from '../AdminSidebar/AdminSidebar'
import AdminUsers from '../../../Pages/SuperAdmin/AdminUsers/AdminUsers';
import AdminManagers from '../../../Pages/SuperAdmin/AdminManagers/AdminManagers';
import AdminEvents from '../../../Pages/SuperAdmin/AdminEvents/AdminEvents';
import SuperAdminPrivateRoute from '../SuperAdminPrivateRoute';
import Manager_Profile_Rating from '../../../Pages/SuperAdmin/AdminManagers/ProfileWithRatings';

const BASEUrl = process.env.REACT_APP_BASE_URL



const AdminWrapper = () => {
    const dispatch = useDispatch();
    const authentication_user = useSelector(state => state.authentication_user);
    const location = useLocation();
  
    const checkAuth = async () => {
      // Logic to check authentication
      const isAuthenticated = await isAuthAdmin();
      console.log(isAuthenticated)
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
          isSuperAdmin: isAuthenticated.isSuperAdmin,

        })
      );
  
    };
  
    // const baseURL = 'http://127.0.0.1:8000/';
    const token = localStorage.getItem('access');
  
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BASEUrl}superadmin/details/`, {
          headers: {
            'authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        dispatch(
          set_user_basic_details({
            name: res.data.username,
            profile_pic: res.data.profile_pic,
            manager_type:null
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      if (!authentication_user.name) {
        checkAuth();
      }
      if (authentication_user.isSuperAdmin) {
        fetchUserData();
      }
    },[location.pathname] );
  
  return (
    <div>
        <Routes>
      
     
      <Route path="/login" element={<AdminLogin/>} />
      <Route path="/dashboard" element={<SuperAdminPrivateRoute> <AdminSidebar><AdminHome/></AdminSidebar> </SuperAdminPrivateRoute> } />
      <Route path="/users" element={<SuperAdminPrivateRoute><AdminSidebar><AdminUsers/></AdminSidebar></SuperAdminPrivateRoute> } />
      <Route path="/managers" element={<SuperAdminPrivateRoute><AdminSidebar><AdminManagers/></AdminSidebar></SuperAdminPrivateRoute> } />
      <Route path="/manager-profile/:id" element={<SuperAdminPrivateRoute><AdminSidebar><Manager_Profile_Rating/></AdminSidebar></SuperAdminPrivateRoute> } />
      <Route path="/events" element={<SuperAdminPrivateRoute><AdminSidebar><AdminEvents/></AdminSidebar></SuperAdminPrivateRoute> } />





 
     
 
  </Routes>
      
    </div>
  )
}

export default AdminWrapper
