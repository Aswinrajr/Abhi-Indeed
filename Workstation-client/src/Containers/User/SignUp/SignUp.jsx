import React, { useContext, useEffect, useState } from 'react';
import logo from '../../../assets/logo2.png';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { validateSignupForm } from '../../../Utilis/helper.js';
import { AuthContext } from '../../../Context/UserContext.jsx';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './SignUp.css';

function SignUp() {
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState("")
    const [errors,setErrors]=useState({})
    const {user}=useContext(AuthContext)
    const navigate=useNavigate()

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[user,navigate])

    const handleSubmit=async(e)=>{
     e.preventDefault()

     const formData={
      username:username.trim(),
      email:email.trim(),
      password:password.trim(),
      confirmPassword:confirmPassword.trim()
     }

     try {
      await validateSignupForm.validate(formData, { abortEarly: false });
      setErrors({});
     const response=await axiosInstance.post('/employee-signup',formData)
     setErrors({});
     if(response.data.success){
        localStorage.setItem("email",email)
        console.log(response.data);
        Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
            timer: 5000, 
            position: 'top-center', 
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/employee-verifyOtp');
            }
          });
     }else{
        console.log(response.data);
        Swal.fire({
            title: 'Error!',
            text: response.data.message,
            icon: 'error',
            timer: 5000,
            position: 'top-center',
          });}
     } catch (validationErrors) {
      if (validationErrors.inner) {
        const formErrors = validationErrors.inner.reduce((acc, error) => {
          return { ...acc, [error.path]: error.message };
        }, {});
        setErrors(formErrors);
      }else {
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
        <div className="signup-container d-flex align-items-center justify-content-center ">
      <div className="d-flex">
        <div className="banner p-4 d-flex flex-column align-items-center justify-content-center">
          <img alt="Logo" src={logo} width="300" className="mb-3" />
        </div>
        <div className="form p-4 bg-white d-flex flex-column align-items-center justify-content-center">
            <div className='link'>
            <Link to="/recruiter-signup" id="forgot" className="text-muted ">
            Are you a recruiter?
            </Link>
            </div>
        
          <h2 className="mb-3">Candidate Signup</h2>
          <img
            src="https://i.pinimg.com/236x/4d/a8/bb/4da8bb993057c69a85b9b6f2775c9df2.jpg"
            alt="profile"
            width="70"
            className="mb-3 rounded-circle shadow"
          />
          <form onSubmit={handleSubmit} className="w-100">
            <small className="mb-3 d-flex justify-content-center align-items-center">
              Do you have an Account? <Link to="/employee-login">Login</Link>
            </small>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
              placeholder="Username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z.]/g, ''))}
            />
            {errors.username && <div className="invalid-feedback mb-2">{errors.username}</div>}
            <input
              type="text"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              placeholder="Email"
              pattern='.*'
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback mb-2">{errors.email}</div>}
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}              
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback mb-2">{errors.password}</div>}
             <input
              type="password"
              className={`form-control  ${errors.confirmPassword ? 'is-invalid' : ''}`} 
              placeholder="Confirm password"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <div className="invalid-feedback mb-2">{errors.confirmPassword}</div>}
            <button type="submit" className="btn btn-primary mb-4 w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
     )
 }

export default SignUp

                  