import React, { useContext, useEffect, useState } from 'react';
import logo from '../../../assets/logo2.png';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { validateRecruiterSignupForm } from '../../../Utilis/helper.js';
import './RecruiterSignup.css';
import { RecruiterAuth } from '../../../Context/RecruiterContext.jsx';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';

function RecruiterSignup() {  
    const [recruitername, setRecruitername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const { recruiter } = useContext(RecruiterAuth);

    const navigate = useNavigate();

    useEffect(() => {
        if (companyName) {
            const fetchCompanySuggestions = async () => {
                try {
                    const response = await axiosInstance.get('/get-companies');
                    const suggestions = response.data.companyNames.filter(name =>
                        name.toLowerCase().includes(companyName.toLowerCase())
                    );
                    setCompanySuggestions(suggestions);
                } catch (error) {
                    console.error('Error fetching company suggestions:', error);
                }
            };
            fetchCompanySuggestions();
        } else {
            setCompanySuggestions([]);
        }
    }, [companyName]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            recruitername: recruitername.trim(),
            email: email.trim(),
            companyName: companyName,
            password: password.trim(),
            confirmPassword: confirmPassword.trim(),
        };

        try {
            await validateRecruiterSignupForm.validate(formData, { abortEarly: false });
            setErrors({});
            const response = await axiosInstance.post('/recruiter-signup', {
                recruitername: recruitername.trim(),
                email: email.trim(),
                password: password.trim(),
                companyName
            });
            setErrors({});
            if (response.data.success) {
                localStorage.setItem("recruiteremail", email);
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    timer: 5000,
                    position: 'top-center',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/recruiter-verifyOtp');
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
        } catch (validationErrors) {
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
        <div className="recruitersignup-container d-flex align-items-center justify-content-center">
            <div className="d-flex">
                <div className="banner p-4 d-flex flex-column align-items-center justify-content-center">
                    <img src={logo} alt="Logo" width="300" className="mb-3" />
                </div>
                <div className="recruitersignup-form p-4 bg-white d-flex flex-column align-items-center justify-content-center">
                    <div className='recruitersignup-link'>
                        <Link to="/employee-signup" id="forgot" className="text-muted">
                            Are you a candidate?
                        </Link>
                    </div>

                    <h2 className="mb-3">Recruiter Signup</h2>
                    <img
                        src="https://i.pinimg.com/236x/4d/a8/bb/4da8bb993057c69a85b9b6f2775c9df2.jpg"
                        alt="profile"
                        width="70"
                        className="mb-3 rounded-circle shadow"
                    />
                    <form onSubmit={handleSubmit} className="w-100">
                        <small className="mb-3 d-flex justify-content-center align-items-center">
                            Do you have an Account? <Link to="/recruiter-login">Login</Link>
                        </small>
                        <input
                            type="text"
                            className={`form-control ${errors.recruitername ? 'is-invalid' : ''}`}
                            placeholder="Recruiter name"
                            autoComplete="off"
                            value={recruitername}
                            onChange={(e) => setRecruitername(e.target.value.replace(/[^a-zA-Z.]/g, ''))}
                        />
                        {errors.recruitername && <div className="invalid-feedback mb-2">{errors.recruitername}</div>}
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
                            type="text"
                            className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                            list="companyNames"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Select or type company name"
                        />
                        <datalist id="companyNames">
                            {companySuggestions.map((name, index) => (
                                <option key={index} value={name} />
                            ))}
                        </datalist>
                        {errors.companyName && <div className="invalid-feedback mb-2">{errors.companyName}</div>}
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
                        <div className="recruitersignup-company-link">
                          <Link to="/company-signup">Register a Company?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RecruiterSignup;
