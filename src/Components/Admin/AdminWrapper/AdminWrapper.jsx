import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import axios from '../../../axiosinstance/axiosinstance';
import AdminLogin from '../../../Pages/SuperAdmin/AdminLogin/AdminLogin';
import AdminHome from '../../../Pages/SuperAdmin/AdminHome/AdminHome';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminUsers from '../../../Pages/SuperAdmin/AdminUsers/AdminUsers';
import AdminManagers from '../../../Pages/SuperAdmin/AdminManagers/AdminManagers';
import AdminEvents from '../../../Pages/SuperAdmin/AdminEvents/AdminEvents';
import SuperAdminPrivateRoute from '../SuperAdminPrivateRoute';
import Manager_Profile_Rating from '../../../Pages/SuperAdmin/AdminManagers/ProfileWithRatings';
import { toast } from 'react-toastify';

const BASEUrl = process.env.REACT_APP_BASE_URL;

const AdminWrapper = () => {
    const dispatch = useDispatch();
    const authentication_user = useSelector(state => state.authentication_user);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('access');

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${BASEUrl}superadmin/details/`);

            dispatch(
                set_Authentication({
                    name: res.data.username,
                    isAuthenticated: res.data.is_active,
                    isAdmin: res.data.is_manager,
                    isSuperAdmin: res.data.is_superuser,
                })
            );

            dispatch(
                set_user_basic_details({
                    name: res.data.username,
                    profile_pic: res.data.profile_pic,
                    manager_type: res.data.event_name,
                    email: res.data.email,
                })
            );
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('You are not authorized to access this page.');
            } else {
                console.error("Error fetching admin data:", error);
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setIsLoading(false);
        }
    }, [location.pathname, authentication_user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/dashboard" element={<SuperAdminPrivateRoute><AdminSidebar><AdminHome /></AdminSidebar></SuperAdminPrivateRoute>} />
                <Route path="/users" element={<SuperAdminPrivateRoute><AdminSidebar><AdminUsers /></AdminSidebar></SuperAdminPrivateRoute>} />
                <Route path="/managers" element={<SuperAdminPrivateRoute><AdminSidebar><AdminManagers /></AdminSidebar></SuperAdminPrivateRoute>} />
                <Route path="/manager-profile/:id" element={<SuperAdminPrivateRoute><AdminSidebar><Manager_Profile_Rating /></AdminSidebar></SuperAdminPrivateRoute>} />
                <Route path="/events" element={<SuperAdminPrivateRoute><AdminSidebar><AdminEvents /></AdminSidebar></SuperAdminPrivateRoute>} />
            </Routes>
        </div>
    );
};

export default AdminWrapper;
