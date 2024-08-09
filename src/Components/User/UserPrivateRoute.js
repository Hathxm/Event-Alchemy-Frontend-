import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthUser from '../../utils/IsAuthUser';

const UserPrivateRoute = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const authInfo = await isAuthUser();
        setIsAuthenticated(authInfo);
        setLoading(false);
      };
  
      fetchData();
    }, []);
  
    if (isLoading) {
      // Handle loading state, you might show a loading spinner
      return <div>Loading...</div>;
    }
  
    if (!isAuthenticated.isAuthenticated || isAuthenticated.isAdmin || isAuthenticated.isSuperAdmin) {
      // If not authenticated, or is an admin, or is a superadmin, redirect to the login page
      return <Navigate to="/login" />;
    }
  
    // If authenticated and not an admin or superadmin, render the children
    return children;
  };
  

export default UserPrivateRoute
