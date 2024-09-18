import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthVendor from '../../utils/IsAuthVendor';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function VendorPrivateRoute({ children }) {
    const authentication_user = useSelector(state => state.authentication_user);



  
   
  

  if (!authentication_user.isAuthenticated || authentication_user.isAdmin || authentication_user.isSuperAdmin || !authentication_user.isVendor) {
    if(!authentication_user.isVendor){
      toast.warning("Your Account Has Not Been Verified By The Admin",{
        position: "top-right",
        autoClose: 5000,
      }); 
    }
    // If not authenticated, redirect to login page with the return URL
    return <Navigate to="/vendor/login" />;
  }
  else{
    return children;
  }

  // If authenticated, render the child components




  
  
}

export default VendorPrivateRoute;
