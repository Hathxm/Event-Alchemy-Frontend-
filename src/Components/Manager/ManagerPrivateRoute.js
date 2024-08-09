import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthAdmin from '../../utils/IsAuthManager';

function AdminPrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const authInfo = await isAuthAdmin();
        setIsAuthenticated(authInfo);
        setLoading(false);
      };
  
      fetchData();
    }, []);

  if (isLoading) {
    // Handle loading state, you might show a loading spinner
    return <div>Loading...</div>;
  }

  
   
  

  if (!isAuthenticated.isAuthenticated || !isAuthenticated.isAdmin || isAuthenticated.isSuperAdmin ) {
    // If not authenticated, redirect to login page with the return URL
    return <Navigate to="/manager/login" />;
  }

  // If authenticated, render the child components
  return children;
}

export default AdminPrivateRoute;
