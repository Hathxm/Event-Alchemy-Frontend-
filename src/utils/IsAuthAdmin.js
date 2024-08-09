import { jwtDecode } from "jwt-decode";
import axios from 'axios'

const updateUserToken = async ()=>{
    const refreshToken = localStorage.getItem("refresh");
   
    const baseURL = "http://127.0.0.1:8000/";
    console.log(refreshToken)


    try {
        const res = await axios.post(baseURL+'token/refresh', 
        {
            'refresh':refreshToken
        })
       
        if(res.status === 200){
          localStorage.setItem('access', res.data.access)
          localStorage.setItem('refresh', res.data.refresh)
          let decoded = jwtDecode(res.data.access);
          return {'name':decoded.username,isAuthenticated:true}
        }
        else
        {
            return {'name':null,isAuthenticated:false}
        }  
        
      }
      catch (error) {
         return {'name':null,isAuthenticated:false}
      }
}


const fetchisAdmin = async () => {
  const token = localStorage.getItem('access');
  const baseURL = "http://127.0.0.1:8000/";

  try {
      const res = await axios.get(baseURL + 'superadmin/details/', {
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
      return { 'name': null, isAuthenticated: false, isAdmin: false, isSuperAdmin:false };
  }

  const currentTime = Date.now() / 1000;
  let decoded = jwtDecode(accessToken);

  if (decoded.exp > currentTime) {
      let checkAdmin = await fetchisAdmin();
    //   console.log(checkAdmin) 
      return { 'name': decoded.username, isAuthenticated: checkAdmin.is_active, isAdmin: false, isSuperAdmin: checkAdmin.is_superuser  };
  } else {
      const updateSuccess = await updateUserToken();

      if (updateSuccess) {
          accessToken = localStorage.getItem("access");
          let decoded = jwtDecode(accessToken);
          let checkAdmin = await fetchisAdmin();
        console.log(checkAdmin)

          return { 'name': decoded.username, isAuthenticated: true, isAdmin: false,  isSuperAdmin:checkAdmin.is_superuser  };
      } else {
          return { 'name': null, isAuthenticated: false, isAdmin: false , isSuperAdmin:false};
      }
  }
};
export default isAuthAdmin ;