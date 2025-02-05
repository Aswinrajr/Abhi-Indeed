import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ForgotPassword.css'; 
import logo from '../../../assets/logo3.png'
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/employee-forgotPassword', { email });
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/employee-login');
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
    <div className='forgot-container d-flex justify-content-center align-items-center vh-100 bg-dark'>
      <div className="card forgot-password-card">
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
          <button type="submit" style={{width:'200px'}} className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
        <small className="mb-3 d-flex justify-content-center align-items-center">
              Remember the password? <Link to="/employee-login">Login</Link>
            </small>
      </div>
    </div>
  );
}

export default ForgotPassword;
