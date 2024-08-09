import {createSlice} from '@reduxjs/toolkit'


export const userBasicDetailsSlice = createSlice(
   {
    name: 'user_basic_details',
    initialState: {
      name: null,
      profile_pic:null,
      manager_type:null,
      email:null,
    },
    reducers: {
      set_user_basic_details: (state, action) => {
        state.name = action.payload.name;
        state.profile_pic = action.payload.profile_pic;
        state.manager_type = action.payload.manager_type;
        state.email = action.payload.email;

      }
    }


})

export const {set_user_basic_details} =  userBasicDetailsSlice.actions

export default userBasicDetailsSlice.reducer