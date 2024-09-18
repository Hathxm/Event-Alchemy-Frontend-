import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function AdminPrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.authentication_user);
  console.log(isAuthenticated)
  
    


  
   
  

  if (!isAuthenticated.isAuthenticated || !isAuthenticated.isAdmin || isAuthenticated.isSuperAdmin ) {
    toast.error("User not Authenticated Please Log In",{
      position: "top-right",
      autoClose: 5000,
    })
    // If not authenticated, redirect to login page with the return URL
    return <Navigate to="/manager/login" />;
  }

  // If authenticated, render the child components
  return children;
}

export default AdminPrivateRoute;
