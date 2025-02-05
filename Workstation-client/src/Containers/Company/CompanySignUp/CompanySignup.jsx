import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { validateCompanySignupForm } from '../../../Utilis/helper.js';
import { CompanyAuth } from '../../../Context/CompanyContext.jsx';
import logo from '../../../assets/logo2.png';
import './CompanySignup.css';

function CompanySignup() {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const {company} = useContext(CompanyAuth);
    const navigate = useNavigate();

    useEffect(() => {
        if (company) {
            navigate('/company-home');
        }
    }, [company, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            companyName: companyName.trim(),
            email: email.trim(),
            password: password.trim(),
            confirmPassword: confirmPassword.trim(),
        };

        try {
            await validateCompanySignupForm.validate(formData, { abortEarly: false });
            setErrors({});
            const response = await axiosInstance.post('/company-signup', formData);
            console.log(response.data);
            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    timer: 5000,
                    position: 'top-center',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/company-login');
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
            }
            setCompanyName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
        } catch (validationErrors) {
            if (validationErrors.inner) {
                const formErrors = validationErrors.inner.reduce((acc, error) => {
                    return { ...acc, [error.path]: error.message };
                }, {});
                setErrors(formErrors);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: "Company already exists",
                    icon: 'error',
                    timer: 5000,
                    position: 'top-center',
                });
            }
            setCompanyName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
        }
    };

    return (
        <div className="company-signup-container d-flex align-items-center justify-content-center">
            <div className="d-flex">
                <div className="company-banner p-4 d-flex flex-column align-items-center justify-content-center">
                    <img src={logo} alt="Logo" width="300" className="mb-3" />
                </div>
                <div className="company-form p-4 bg-white d-flex flex-column align-items-center justify-content-center">
                    <div className='company-link'>
                        <Link to="/employee-signup" id="forgot" className="text-muted">
                            Are you a candidate?
                        </Link>
                    </div>
                    <h2 className="mb-3">Company Signup</h2>
                    <img
                        src="https://i.pinimg.com/236x/4d/a8/bb/4da8bb993057c69a85b9b6f2775c9df2.jpg"
                        alt="profile"
                        width="70"
                        className="mb-3 rounded-circle shadow"
                    />
                    <form onSubmit={handleSubmit} className="w-100">
                        <small className="mb-3 d-flex justify-content-center align-items-center">
                            Do you have an Account? <Link to="/company-login">Login</Link>
                        </small>
                        <input
                            type="text"
                            className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                            placeholder="Company Name"
                            autoComplete="off"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value.replace(/[^a-zA-Z.]/g, ''))}
                        />
                        {errors.companyName && <div className="invalid-feedback mb-2">{errors.companyName}</div>}
                        <input
                            type="text"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Email"
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
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
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
    );
}

export default CompanySignup;
