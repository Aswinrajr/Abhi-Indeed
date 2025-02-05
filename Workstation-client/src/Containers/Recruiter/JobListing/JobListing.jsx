import React, { useContext, useEffect, useState } from 'react';
import './JobListing.css';
import SideNav from '../../../Components/SideNav';
import ReNavigation from '../../../Components/ReNavigation';
import { RecruiterAuth } from '../../../Context/RecruiterContext';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaArrowLeft, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

function JobListing() {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { recruiter, Authenticated, loading } = useContext(RecruiterAuth);
    const navigate = useNavigate();

    const fetchJobs = async (page = currentPage) => {
        if (recruiter) {
            try {
                const response = await axiosInstance.get(`/recruiter-showJobs/${recruiter._id}`, {
                    params: {
                        page,
                        limit: 5,
                        searchTerm,
                    },
                });
                if (response.data.success) {
                    setJobs(response.data.jobs);
                    setTotalPages(response.data.totalPages);
                } else {
                    console.log("Failed to fetch data");
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [recruiter]);
    const handleSearch = () => {
        setCurrentPage(1);
        fetchJobs(1);
    };

    const clearSearch = () => {
        setSearchTerm('');
        window.location.reload();
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchJobs(pageNumber);
    };

    const viewJob = (id) => {
        navigate(`/recruiter-viewJob/${id}`);
    };

    const editJob = async (id) => {
        navigate(`/recruiter-editJob/${id}`);
    };

    if (!jobs) {
        return <div className="recruiter-job-loading">Loading...</div>;
    }

    const deleteJob = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosInstance.delete(`/recruiter-deleteJob/${id}`);
                console.log(response);
                if (response.data.success) {
                    setJobs(jobs.filter(job => job._id !== id));
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    

    return (
        <>
            <ReNavigation />
            <SideNav />
            <div className="recruiter-job-listing">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={clearSearch} className="joblisting-clear">Clear</button>
                </div>

                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <div key={job._id} className="recruiter-job-card">
                            <div className="recruiter-card-body">
                                <div className="recruiter-header">
                                    <div>
                                        <h3 className="recruiter-job-title">{job.jobTitle}
                                            <span className={`recruiter-status-indicator ${job.delete === true ? 'blocked' : 'active'}`}>
                                                {job.delete === true ? 'Blocked' : 'Active'}
                                            </span>
                                        </h3>
                                        <h6 className="recruiter-company-name">{job.companyName}</h6>
                                    </div>
                                    <div className="recruiter-action-icons">
                                        <FaEdit className="recruiter-edit-icon" onClick={() => editJob(job._id)} />
                                        <FaTrashAlt className="recruiter-delete-icon" onClick={() => deleteJob(job._id)} />
                                    </div>

                                </div>
                                <div className="recruiter-job-details">
                                    <span className="recruiter-detail-item">📍 {job.jobLocation}</span>
                                    <span className="recruiter-detail-item">🕒 {job.employmentType}</span>
                                    <span className="recruiter-detail-item">💰 ${job.minPrice}-${job.maxPrice}</span>
                                    <span className="recruiter-detail-item">📅 {job.jobPostedOn}</span>
                                    <span className="recruiter-detail-item">
                                        <FaCalendarAlt /> {formatDate(job.expiryDate)}
                                    </span>
                                </div>

                                <p className="recruiter-job-description">
                                    {job.description}
                                </p>
                                <button className="recruiter-view-job-button" onClick={() => viewJob(job._id)}>VIEW JOB</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="recruiter-no-jobs">
                        <h2>No jobs posted yet!</h2>
                        <p>You haven’t posted any jobs. Click the button below to start posting jobs and finding the right candidates.</p>
                        <button className="recruiter-post-job-button" onClick={() => navigate('/recruiter-postJob')}>
                            Post a Job
                        </button>
                    </div>
                )}

                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <FaArrowLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </>
    );
}

export default JobListing;
