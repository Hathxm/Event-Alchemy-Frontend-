import React, { useEffect, useState } from 'react';
import Loader from '../../Common/Loader/Loader';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import axios from '../../../axiosinstance/axiosinstance';
import ManagerLogin from '../../../Pages/Managers/ManagerLogin/ManagerLogin';
import ManagerDashboard from '../../../Pages/Managers/ManagerDashboard/ManagerDashboard';
import ManagerServices from '../../../Pages/Managers/ManagerServices/ManagerServices';
import ManagerLocations from '../../../Pages/Managers/ManagerLocations/ManagerLocations';
import ManagerPrivateRoute from '../ManagerPrivateRoute';
import ManagerSidebar from '../ManagerSidebar/ManagerSidebar';
import ManagersProfile from '../../../Pages/Managers/ManagersProfile/ManagersProfile';
import ChatComponent from '../../../Pages/Managers/Chat/ChatPage';
import ManagerVendors from '../../../Pages/Managers/ManagerVendors/ManagerVendors';
import ManagerForgotPassword from '../../../Pages/Managers/ManagerForgotPass/ForgotPassword';
import ChangePassOTP from '../../../Pages/Managers/ChangePassOTP/ChangePassOTP';
import { toast } from 'react-toastify';


const BASEUrl = process.env.REACT_APP_BASE_URL;

function ManagerWrapper() {
    const dispatch = useDispatch();
    const authentication_user = useSelector(state => state.authentication_user);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [manager_id, set_manager_id] = useState(null);

    const token = localStorage.getItem('access');

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${BASEUrl}managers/details/`);
            console.log(res.data)

            dispatch(
                set_Authentication({
                    name: res.data.username,
                    isAuthenticated: res.data.is_active,
                    isAdmin: res.data.is_Manager,
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
            set_manager_id(res.data.id);

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
                console.error("Error fetching manager data:", error);
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
        <>
            <Routes>
                <Route path="/login" element={<ManagerLogin />} />
                <Route path="/forgotpassword" element={<ManagerForgotPassword />} />
                <Route path="/changepass/otp" element={<ChangePassOTP />} />
                <Route element={<ManagerPrivateRoute><ManagerSidebar manager_id={manager_id}><Outlet /></ManagerSidebar></ManagerPrivateRoute>}>
                    <Route path="/dashboard" element={<ManagerDashboard />} />
                    <Route path="/locations" element={<ManagerLocations />} />
                    <Route path="/profile" element={<ManagersProfile />} />
                    <Route path="/services" element={<ManagerServices />} />
                    <Route path="/chat" element={<ChatComponent />} />
                    <Route path="/vendors" element={<ManagerVendors />} />
                </Route>
            </Routes>
        </>
    );
}

export default ManagerWrapper;
