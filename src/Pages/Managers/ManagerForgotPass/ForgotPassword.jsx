import React from 'react'
import ForgotPassword from '../../../Components/User/ForgotPass/ForgotPassword'

const ManagerForgotPassword = () => {
  return (
    <div>
      <ForgotPassword usertype='/managers' otp_link='manager/changepass/otp' ></ForgotPassword>
    </div>
  )
}

export default ManagerForgotPassword
