import React from 'react'
import { Navigate } from 'react-router-dom';
import isAuthAdmin from '../../utils/IsAuthAdmin';
import { useState,useEffect } from 'react';

const SuperAdminPrivateRoute = ({children}) => {
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

  
   
  

  if (!isAuthenticated || isAuthenticated.isAdmin || !isAuthenticated.isSuperAdmin) {
    // if(!isAuthenticated){
    //   console.log("not authenticated")
    // }
    // else if(isAuthenticated.isAdmin){
    //   console.log("Admin is True")
    // }
    // else if( !isAuthenticated.isSuperAdmin){
    //   console.log("SuperAdmin is False")
    // }
    // If not authenticated, redirect to login page with the return URL
    return <Navigate to="/admin/login" />;
  }

  // If authenticated, render the child components
  return children;
}

export default SuperAdminPrivateRoute
