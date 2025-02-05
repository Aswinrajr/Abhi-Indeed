import React, { useContext, useEffect, useState } from 'react';
import './JobPosting.css';
import ReNavigation from '../../../Components/ReNavigation';
import Swal from 'sweetalert2';
import SideNav from '../../../Components/SideNav';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';
import { RecruiterAuth } from '../../../Context/RecruiterContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function JobPosting() {
  const navigate = useNavigate();
  const { Authenticated, loading, recruiter } = useContext(RecruiterAuth);
  const [categories, setCategories] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: '',
    minPrice: '',
    maxPrice: '',
    jobLocation: '',
    yearsOfExperience: '',
    employmentType: '',
    skills: [],
    description: '',
    education: '',
    category: '',
    easyApply: true,
    applicationUrl: '',
    expiryDate: ''
  });


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/recruiter-getAllCategories');
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        const response = await axiosInstance.get(`/recruiter-getRecruiterDetails/${recruiter.email}`);
        if (response.data.success) {
          setCompanyName(response.data.companyName);
        }
      } catch (error) {
        console.error('Error fetching recruiter details:', error);
      }
    };
    fetchRecruiterDetails();
  }, [recruiter.email]);

  useEffect(() => {
    if (!loading && !recruiter.isSubscribed) {
      Swal.fire({
        title: 'Subscription Required',
        text: 'You need to subscribe to access this page.',
        icon: 'info',
        timer: 3000,
        didClose: () => navigate('/recruiter-planListing')
      });
    }
  }, [recruiter.isSubscribed, navigate, loading]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    const skillArray = value.split(',').map(skill => skill.trim());
    setFormData({ ...formData, skills: skillArray });
  };

  const handleToggleChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      easyApply: checked,
      applicationUrl: checked ? '' : formData.applicationUrl
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/recruiter-postJob', { ...formData, companyName: companyName });
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          position: 'top-center',
        });
        setFormData({
          jobTitle: '',
          minPrice: '',
          maxPrice: '',
          jobLocation: '',
          yearsOfExperience: '',
          employmentType: '',
          skills: [],
          description: '',
          education: '',
          category: '',
          easyApply: true,
          applicationUrl: '',
           expiryDate: ''
        });
        navigate('/recruiter-listJob');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message,
          position: 'top-center',
        });
        setFormData({
          jobTitle: '',
          minPrice: '',
          maxPrice: '',
          jobLocation: '',
          yearsOfExperience: '',
          employmentType: '',
          skills: [],
          description: '',
          education: '',
          category: '',
          easyApply: true,
          applicationUrl: '',
           expiryDate: ''
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire({
          title: 'Error!',
          text: error.response.data.message,
          icon: 'error',
          position: 'top-center',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: "An error occurred. Please try again later",
          icon: 'error',
          position: 'top-center',
        });
      }
    }
  };

  return (
    <>
      <ReNavigation />
      <SideNav />
      <div className="container job-posting-form">
        <div className="back-icon" onClick={() => navigate('/recruiter-home')}>
          <FaArrowLeft size={24} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="jobTitle" className="form-label">Job Title</label>
              <input type="text" className="form-control" id="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Web developer" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="companyName" className="form-label">Company Name</label>
              <input type="text" className="form-control" id="companyName" value={companyName} onChange={handleChange} readOnly placeholder="Ex: Microsoft" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="minPrice" className="form-label">Minimum Salary</label>
              <input type="number" className="form-control" value={formData.minPrice} onChange={handleChange} id="minPrice" placeholder="100000"    min="0"  required />
            </div>
            <div className="col-md-6">
              <label htmlFor="maxPrice" className="form-label">Maximum Salary</label>
              <input type="number" className="form-control" value={formData.maxPrice} onChange={handleChange} id="maxPrice" placeholder="500000"    min="0"  required />
            </div>
            <div className="col-md-6">
              <label htmlFor="jobLocation" className="form-label">Job Location</label>
              <input type="text" className="form-control" id="jobLocation" value={formData.jobLocation} onChange={handleChange} placeholder="Ex: New York" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="yearsOfExperience" className="form-label">Years of Experience</label>
              <input type="number" className="form-control" id="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="5"    min="0"  required />
            </div>
            <div className="col-md-6">
              <label htmlFor="employmentType" className="form-label">Employment Type</label>
              <select className="form-select" value={formData.employmentType} onChange={handleChange} id="employmentType" required>
                <option>Select job type</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="education" className="form-label">Education</label>
              <input type="text" className="form-control" id="education" value={formData.education} onChange={handleChange} placeholder="Ex: Bachelor's degree" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="category" className="form-label">Category</label>
              <select className="form-select" value={formData.category} onChange={handleChange} id="category" required>
                <option>Select category</option>
                {categories.map(category => (
                  <option key={category._id} value={category.categoryName}>{category.categoryName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label htmlFor="skills" className="form-label">Skills</label>
              <input type="text" className="form-control" id="skills" value={formData.skills.join(', ')} onChange={handleSkillChange} placeholder="e.g., HTML, CSS, JavaScript" required />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label">Job Description</label>
              <textarea className="form-control" id="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Job description" required />
            </div>
            <div className="col-12">
              <label htmlFor="applicationType" className="form-label">Application Type</label>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="applicationType" checked={formData.easyApply} onChange={handleToggleChange} />
                <label className="form-check-label" htmlFor="applicationType">
                  {formData.easyApply ? 'Easy Apply' : 'Job Apply'}
                </label>
              </div>
            </div>
            {!formData.easyApply && (
              <div className="col-12">
                <label htmlFor="applicationUrl" className="form-label">Application URL</label>
                <input type="url" className="form-control" id="applicationUrl" value={formData.applicationUrl} onChange={handleChange} placeholder="https://example.com/apply" required={!formData.easyApply} />
              </div>
            )}
            <div className="col-12">
              <button type="submit" className="btn btn-primary" style={{width:'200px'}}>Post Job</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default JobPosting;
