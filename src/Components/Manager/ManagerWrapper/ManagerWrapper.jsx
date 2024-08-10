import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import axios from 'axios';
import isAuthAdmin from '../../../utils/IsAuthManager';
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



const BASEUrl = process.env.REACT_APP_BASE_URL


const ManagerWrapper = () => {
    const dispatch = useDispatch();
    const authentication_user = useSelector(state => state.authentication_user);
    const [manager_id,set_manager_id] = useState(null)
    const location = useLocation();


    // const baseURL = 'http://127.0.0.1:8000/';
    const token = localStorage.getItem('access');

    const checkAuth = async () => {
       
        const isAuthenticated = await isAuthAdmin();
        console.log(isAuthenticated)

      
        
        dispatch(
            set_Authentication({
                name: isAuthenticated.username,
                isAuthenticated: isAuthenticated.isAuthenticated,
                isAdmin: isAuthenticated.isAdmin,
                isSuperAdmin: isAuthenticated.isSuperAdmin,

            })
        );
    };

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${BASEUrl}managers/details/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            dispatch( 
                set_user_basic_details({
                    name: res.data.username,
                    profile_pic: res.data.profile_pic,
                    manager_type: res.data.event_name,
                    email:res.data.email
                })
            );
            set_manager_id(res.data.id)
        } catch (error) {
            console.log("Error in fetchUserData:", error);
        }
    };

    useEffect(() => {
  
        if (!authentication_user.name) {
            checkAuth();
        }
        if (authentication_user.isAdmin) {
            fetchUserData();
        }
    },[location.pathname]);

    
    

    return (
        <>
            
            <Routes>
                <Route path="/login" element={<ManagerLogin/>} />
                <Route path="/forgotpassword" element={<ManagerForgotPassword/>} />
                <Route path="/changepass/otp" element={<ChangePassOTP/>} />
                <Route path="/dashboard" element={<ManagerPrivateRoute> <ManagerSidebar manager_id={manager_id} > <ManagerDashboard/> </ManagerSidebar> </ManagerPrivateRoute>} />
                <Route path="/locations" element={<ManagerPrivateRoute><ManagerSidebar  manager_id={manager_id}> <ManagerLocations/> </ManagerSidebar></ManagerPrivateRoute>} />
                <Route path="/profile" element={<ManagerPrivateRoute><ManagerSidebar manager_id={manager_id}> <ManagersProfile/> </ManagerSidebar></ManagerPrivateRoute>} />
                <Route path="/services" element={<ManagerPrivateRoute><ManagerSidebar manager_id={manager_id}> <ManagerServices/> </ManagerSidebar></ManagerPrivateRoute>} />
                <Route path="/chat" element={<ManagerPrivateRoute><ManagerSidebar  manager_id={manager_id}> <ChatComponent/> </ManagerSidebar></ManagerPrivateRoute>} />
                <Route path="/vendors" element={<ManagerPrivateRoute><ManagerSidebar  manager_id={manager_id}> <ManagerVendors/> </ManagerSidebar></ManagerPrivateRoute>} />



            </Routes>
        </>
    );
};

export default ManagerWrapper;

