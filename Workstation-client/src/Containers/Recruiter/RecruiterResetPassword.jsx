import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import logo from '../../assets/logo3.png'
import '../User/ResetPassword/ResetPassword.css'
import { validateResetPassword } from '../../Utilis/helper.js';
import axiosInstance from '../../Services/Interceptor/recruiterInterceptor.js';
function ResetPassword() {

    const[password,setPassword]=useState('')
    const [errors,setErrors]=useState({})
  
    const navigate=useNavigate()
    const {token}=useParams()

    const handleSubmit=async(e)=>{
       e.preventDefault()
     const formData={password:password.trim()}
     

       try {
        await validateResetPassword.validate(formData, { abortEarly: false });
        setErrors({});
         const response=await axiosInstance.post(`/recruiter-resetPassword/${token}`,formData)
         if(response.data.success){
            console.log(response.data);
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
              timer: 5000,
              position: 'top-center',
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/recruiter-login');
              }
            });
     }else{
      Swal.fire({
        title: 'Error!',
        text: response.data.message,
        icon: 'error',
        timer: 5000,
        position: 'top-center',
    });
    setPassword('')
}
}catch (validationErrors) {
  if (validationErrors.inner) {
    const formErrors = validationErrors.inner.reduce((acc, error) => {
      return { ...acc, [error.path]: error.message };
    }, {});
    setErrors(formErrors);
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'An error occurred. Please try again later.',
      icon: 'error',
      timer: 5000,
      position: 'top-center',
    });
  }
}
}
  return (
<div className='reset-container d-flex justify-content-center align-items-center vh-100 bg-dark'>
            <div className="card reset-password-card">
                <img
                    src={logo}
                    alt="profile"
                    className="logo"
                />
                <h3 className="text-center mb-4">Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Please enter your new password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}              
                            id="password"
                            placeholder="New Password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <div className="invalid-feedback mb-2">{errors.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Reset
                    </button>
                </form>
            </div>
        </div>
  )
}

export default ResetPassword

