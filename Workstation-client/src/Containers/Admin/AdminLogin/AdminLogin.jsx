import React, { useContext, useState, useEffect } from 'react';
import logo from '../../../assets/logo2.png'
import backgroundImage from '../../../assets/front.jpeg'
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { validateLoginForm } from '../../../Utilis/helper.js';
import { AdminAuth } from '../../../Context/AdminContext.jsx';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const { AdminLogin, admin } = useContext(AdminAuth)

  useEffect(() => {
    if (admin) {
      navigate('/admin-home')
    }
  }, [admin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateLoginForm.validate({ email, password }, { abortEarly: false })
      setErrors({})
      const success = await AdminLogin(email, password)
      if (success) {
        Swal.fire({
          title: 'Success!',
          text: "Admin login successfully",
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/admin-home');
          }
        });
      } else {
        setEmail("")
        setPassword("")
      }
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
  };
  
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  return (
    <div className="adminlogin-container d-flex align-items-center justify-content-center w-100 h-100" style={containerStyle}>
        <div style={overlayStyle}></div>
      <div className="d-flex" style={{ position: 'relative', zIndex: 2 }}>
        <div className="banner p-4 d-flex flex-column align-items-center justify-content-center">
          <img src={logo} alt="Logo" width="300" className="mb-3" />
        </div>
        <div className="form p-4 bg-white d-flex flex-column align-items-center justify-content-center">
          <div className='link'>
            <Link to="/employee-login" id="forgot" className="text-muted ">
              Are you a candidate?
            </Link>
          </div>
          <h2 className="mb-3">Admin Login</h2>
          <img
            src="https://i.pinimg.com/236x/4d/a8/bb/4da8bb993057c69a85b9b6f2775c9df2.jpg"
            alt="profile"
            width="70"
            className="mb-3 rounded-circle shadow"
          />
          <form onSubmit={handleSubmit} className="w-100">
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback ">{errors.password}</div>}
            <button type="submit" className="btn btn-primary mb-3 w-100">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin