import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './Otp.css';

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [timer, setTimer] = useState(300);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(countdown);
          setShowResend(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post('/employee-resentOtp', { email });
      setTimer(300);
      setShowResend(false);
      setError('');
      setOtp(new Array(4).fill(''));
      Swal.fire({
        title: 'OTP Resent',
        text: 'OTP resent successfully!',
        icon: 'success',
        timer: 5000,
        position: 'top-center',
      });
    } catch (error) {
      console.error('Error resending OTP:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error resending OTP. Please try again later.',
        icon: 'error',
        timer: 5000,
        position: 'top-center',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 4) {
      setError('Please enter the complete OTP.');
      return;
    }
    try {
      const response = await axiosInstance.post('/employee-verifyOtp', {
        email,
        otp: enteredOtp,
      });
      if (response.data.success) {
        console.log(response.data);
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('email')
            navigate('/employee-login');
          }
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data);
        setError(error.response.data.message);
      } else {
        console.error("An error occurred:", error);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="otp-template d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="otp-container bg-transparent">
        <div className="otp-card">
          <h2 className="otp-title">OTP Verification</h2>
          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs">
              {otp.map((data, index) => (
                <input
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
            {error && <div className="otp-error">{error}</div>}
            <div className="otp-actions">
              {showResend ? (
                <button type="button" className="otp-btn otp-resend" onClick={handleResend}>
                  Resend OTP
                </button>
              ) : (
                <button type="submit" className="otp-btn otp-verify">Verify OTP</button>
              )}
            </div>
          </form>
          <div className="otp-timer">
            {timer > 0 ? (
              <p>Resend OTP in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p>
            ) : (
              <p>OTP has expired</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
