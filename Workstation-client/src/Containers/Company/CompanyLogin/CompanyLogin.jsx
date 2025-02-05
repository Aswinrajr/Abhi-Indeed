import React, { useContext, useEffect, useState } from 'react';
import logo from '../../../assets/logo2.png'
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { validateLoginForm } from '../../../Utilis/helper.js';
import './CompanyLogin.css';
import { CompanyAuth } from '../../../Context/CompanyContext.jsx';

function CompanyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { CompanyLogin, company, Authenticated } = useContext(CompanyAuth);

  useEffect(()=>{
    if(company){
        navigate('/company-home')
    }
  },[company,navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateLoginForm.validate({ email, password }, { abortEarly: false });
      setErrors({});
      const success = await CompanyLogin(email, password);
      if (success) {
        Swal.fire({
          title: 'Success!',
          text: "Company login successfully",
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/company-home');
          }
        });
      } else {
        setEmail("");
        setPassword("");
      }
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  return (
    <div className="companylogin-container d-flex align-items-center justify-content-center ">
      <div className="d-flex">
        <div className="company-banner p-4 d-flex flex-column align-items-center justify-content-center">
          <img src={logo} alt="Logo" width="300" className="mb-3" />
        </div>
        <div className="company-form p-4 bg-white d-flex flex-column align-items-center justify-content-center">
        <div className='company-link'>
                        <Link to="/employee-login" id="forgot" className="text-muted">
                            Are you a candidate?
                        </Link>
                    </div>
          <h2 className="mb-3">Company Login</h2>
          <img
            src="https://i.pinimg.com/236x/4d/a8/bb/4da8bb993057c69a85b9b6f2775c9df2.jpg"
            alt="profile"
            width="70"
            className="mb-3 rounded-circle shadow"
          />
          <form onSubmit={handleSubmit} className="w-100">
            <small className="mb-3 d-flex justify-content-center align-items-center">
              Need an Account? <Link to="/company-signup">Sign Up</Link>
            </small>
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
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            <button type="submit" className="btn btn-primary mb-3 w-100">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;
