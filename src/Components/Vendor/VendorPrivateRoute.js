import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthVendor from '../../utils/IsAuthVendor';
import { toast } from 'react-toastify';


function VendorPrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const authInfo = await isAuthVendor();
        setIsAuthenticated(authInfo);
        setLoading(false);
      };
  
      fetchData();
    }, []);

  if (isLoading) {
    // Handle loading state, you might show a loading spinner
    return <div>Loading...</div>;
  }

  
   
  

  if (!isAuthenticated.isAuthenticated || isAuthenticated.isAdmin || isAuthenticated.isSuperAdmin || !isAuthenticated.isVendor) {
    if(!isAuthenticated.isVendor){
      toast.warning("Your Account Has Not Been Verified By The Admin",{
        position: "top-right",
        autoClose: 5000,
      }); 
    }
    // If not authenticated, redirect to login page with the return URL
    return <Navigate to="/vendor/login" />;
  }

  // If authenticated, render the child components

return children;


  
  
}

export default VendorPrivateRoute;
