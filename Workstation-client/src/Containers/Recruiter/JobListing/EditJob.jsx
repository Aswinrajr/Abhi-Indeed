import React, { useContext, useEffect, useState } from 'react';
import './EditJob.css';
import ReNavigation from '../../../Components/ReNavigation';
import Swal from 'sweetalert2';
import SideNav from '../../../Components/SideNav';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';
import { RecruiterAuth } from '../../../Context/RecruiterContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { Authenticated, loading } = useContext(RecruiterAuth);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    minPrice: '',
    maxPrice: '',
    jobLocation: '',
    yearsOfExperience: '',
    employmentType: '',
    skills: [],
    description: '',
    education: '',
    categoryName: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
      const fetchJobDetails = async () => {
        try {
          const response = await axiosInstance.get(`/recruiter-viewJob/${id}`);
          if (response.data.success) {
            const job = response.data.job;
            setFormData({
              jobTitle: job.jobTitle,
              companyName: job.companyName,
              minPrice: job.minPrice,
              maxPrice: job.maxPrice,
              jobLocation: job.jobLocation,
              yearsOfExperience: job.yearsOfExperience,
              employmentType: job.employmentType,
              skills: job.skills,
              description: job.description,
              education: job.education,
              categoryName: job.categoryName,
            });
          }
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };
      fetchJobDetails();
  }, [id]);

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    const skillArray = value.split(',').map((skill) => skill.trim());
    setFormData({ ...formData, skills: skillArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/recruiter-updateJob/${id}`, {formData});
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          position: 'top-center',
        });
        navigate('/recruiter-listJob');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message,
          position: 'top-center',
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
          text: 'An error occurred. Please try again later',
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
        <div className="back-icon" onClick={() => navigate('/recruiter-listJob')}>
          <FaArrowLeft size={24} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="jobTitle" className="form-label">Job Title</label>
              <input
                type="text"
                className="form-control"
                id="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Web developer"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="companyName" className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                readOnly
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Ex: Microsoft"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="minPrice" className="form-label">Minimum Salary</label>
              <input
                type="number"
                className="form-control"
                value={formData.minPrice}
                onChange={handleChange}
                id="minPrice"
                placeholder="100000"
                min="0" 
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="maxPrice" className="form-label">Maximum Salary</label>
              <input
                type="number"
                className="form-control"
                value={formData.maxPrice}
                onChange={handleChange}
                id="maxPrice"
                placeholder="500000"
                min="0" 
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="jobLocation" className="form-label">Job Location</label>
              <input
                type="text"
                className="form-control"
                id="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                placeholder="Ex: New York"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="yearsOfExperience" className="form-label">Years of Experience</label>
              <input
                type="number"
                className="form-control"
                id="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="5"
                min="0" 
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="employmentType" className="form-label">Employment Type</label>
              <select
                className="form-select"
                value={formData.employmentType}
                onChange={handleChange}
                id="employmentType"
                required
              >
                <option>Select job type</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="education" className="form-label">Education</label>
              <input
                type="text"
                className="form-control"
                id="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Ex: Bachelor's degree"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.categoryName}
                onChange={handleChange}
                id="categoryName"
                required
              >
                <option>Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="skills" className="form-label">Skills</label>
              <input
                type="text"
                className="form-control"
                id="skills"
                value={formData.skills.join(', ')}
                onChange={handleSkillChange}
                placeholder="e.g., HTML, CSS, JavaScript"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label">Job Description</label>
              <textarea
                className="form-control"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Job description"
                required
              ></textarea>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditJob;
