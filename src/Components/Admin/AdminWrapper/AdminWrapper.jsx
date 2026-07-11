import React, { useEffect, useState } from 'react';
import Loader from '../../Common/Loader/Loader';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
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
import ManagerProfileRating from '../../../Pages/SuperAdmin/AdminManagers/ProfileWithRatings';
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
        } catch (error) {
            const status = error.response?.status;
            if (status === 400) {
                toast.error('You are not authorized to access this page.');
            } else if (status === 401 || status === 403) {
                // Stored token was rejected — clear it and reset auth so the app
                // recovers to a logged-out state instead of hanging on the loader.
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
                console.error("Error fetching admin data:", error);
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
    }, [location.pathname, authentication_user]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route element={<SuperAdminPrivateRoute><AdminSidebar><Outlet /></AdminSidebar></SuperAdminPrivateRoute>}>
                    <Route path="/dashboard" element={<AdminHome />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/managers" element={<AdminManagers />} />
                    <Route path="/manager-profile/:id" element={<ManagerProfileRating />} />
                    <Route path="/events" element={<AdminEvents />} />
                </Route>
            </Routes>
        </div>
    );
};

export default AdminWrapper;
