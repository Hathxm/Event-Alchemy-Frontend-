import {createSlice} from '@reduxjs/toolkit'


export const authenticationSlice = createSlice(
   {
    name: 'authentication_user',
    initialState: {
      name: null,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      isVendor: false,


    },
    reducers: {
      set_Authentication: (state, action) => {
        state.name = action.payload.name;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isAdmin = action.payload.isAdmin;
        state.isSuperAdmin = action.payload.isSuperAdmin;
        state.isVendor = action.payload.isVendor;


       

      },
  
    }


})

export const {set_Authentication} =  authenticationSlice.actions

export default authenticationSlice.reducer