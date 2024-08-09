import {configureStore} from '@reduxjs/toolkit'
import authenticationSliceReducer from './AuthenticationSlice/AuthenticationSlice'
import userBasicDetailsSliceReducer from './UserDetails/UserdetailsSlice'


export default configureStore({
    reducer:{
        authentication_user:authenticationSliceReducer,
        user_basic_details:userBasicDetailsSliceReducer
    }
})