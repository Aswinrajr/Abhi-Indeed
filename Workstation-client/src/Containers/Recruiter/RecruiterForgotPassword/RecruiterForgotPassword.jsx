import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './RecruiterForgotPassword.css'; 
import logo from '../../../assets/logo3.png'
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
   
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/recruiter-forgotPassword', { email });
      if (response.data.success) {
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
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
        setEmail('')
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire({
          title: 'Error!',
          text: error.response.data.message,
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
        setEmail('')
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred. Please try again later.',
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
        setEmail('')
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className='recruiterforgot-container d-flex justify-content-center align-items-center vh-100 bg-dark'>
      <div className="card recruiterforgot-password-card">
      <img
            src={logo}
            alt="profile"
            width="70"
            className="logo"
          />
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-align-center">Please enter your email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
        <small className="mb-3 d-flex justify-content-center align-items-center">
              Remember the password? <Link to="/recruiter-login">Login</Link>
            </small>
      </div>
    </div>
  );
}

export default ForgotPassword;
