import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthUser from '../../utils/IsAuthUser';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


const UserPrivateRoute = ({children}) => {
    const isAuthenticated = useSelector((state) => state.authentication_user);

  

  
    if (!isAuthenticated.isAuthenticated || isAuthenticated.isAdmin || isAuthenticated.isSuperAdmin) {
      // If not authenticated, or is an admin, or is a superadmin, redirect to the login page

      toast.error("User not Authenticated Please Log In",{
        position: "bottom-right",
        autoClose: 5000,
      })

      return <Navigate to="/login" />;
      
    }
  
    // If authenticated and not an admin or superadmin, render the children
    return children;
  };
  

export default UserPrivateRoute
