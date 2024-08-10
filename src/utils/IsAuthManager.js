import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
const BASEUrl = process.env.REACT_APP_BASE_URL

const updateAdminToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    console.log("Refresh Token:", refreshToken);

    try {
        const res = await axios.post(BASEUrl + 'token/refresh', { 'refresh': refreshToken });
     

        if (res.status === 200) {
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Error in updateAdminToken:", error);
        return false;
    }
};

const fetchisAdmin = async () => {
    const token = localStorage.getItem('access');

    try {
        const res = await axios.get(BASEUrl + 'managers/details/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        return res.data
    } catch (error) {
        console.log("Error in fetchisAdmin:", error);
        return false;
    }
};

const isAuthAdmin = async () => {
    let accessToken = localStorage.getItem("access");

    if (!accessToken) {
        return { 'name': null, isAuthenticated: false, isAdmin: false, isSuperAdmin: false };
    }

    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);

    if (decoded.exp > currentTime) {
        let checkAdmin = await fetchisAdmin();
        return { 'name': decoded.username, isAuthenticated: checkAdmin.is_active, isAdmin: checkAdmin.is_Manager, isSuperAdmin: checkAdmin.is_superuser };
    } else {
        const updateSuccess = await updateAdminToken();

        if (updateSuccess) {
            accessToken = localStorage.getItem("access");
            let decoded = jwtDecode(accessToken);
            let checkAdmin = await fetchisAdmin();
            console.log('update success');
            return { 'name': decoded.username, isAuthenticated: checkAdmin.is_active, isAdmin: checkAdmin.is_Manager, isSuperAdmin: checkAdmin.is_superuser  };
        } else {
            return { 'name': null, isAuthenticated: false, isAdmin: false , isSuperAdmin:false};
        }
    }
};

export default isAuthAdmin;
