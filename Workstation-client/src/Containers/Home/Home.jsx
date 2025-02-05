import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../Services/Interceptor/candidateInterceptor.js';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../../Context/UserContext.jsx';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation.jsx';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFlag, FaArrowRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import ReportJobModal from '../User/ReportJob/ReportJobModal.jsx';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priceRanges, setPriceRanges] = useState([
    '1000-10000',
    '10001-20000',
    '20001-30000',
    '30001-40000'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [hasReported, setHasReported] = useState(false);
  const [hasApplied, setHasApplied] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 7;
  const navigate = useNavigate();

  const { isAuthenticated, user } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/employee-listJobs?page=${page}&limit=${limit}`);
        if (response.data.success) {
          setJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs);
          setTotal(response.data.total)
          const locations = [...new Set(response.data.jobs.map(job => job.jobLocation))];
          setLocations(locations);

          if (response.data.jobs.length > 0) {
            setSelectedJob(response.data.jobs[0]);
          }
        }
        const categoryResponse = await axiosInstance.get('/employee-getCategories');
        if (categoryResponse.data.success) {
          setCategories(categoryResponse.data.categories.map(cat => cat.categoryName));
        }
      } catch (error) {
        console.error('Error fetching jobs or categories:', error);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let response;
        if (isAuthenticated && user) {
          response = await axiosInstance.get('/employee-unappliedJobs');
        } else {
          response = await axiosInstance.get('/employee-listJobs');
        }
        if (response.data.success) {
          setJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs);

          if (response.data.jobs.length > 0) {
            setSelectedJob(response.data.jobs[0]);
          } else {
            setSelectedJob(null);
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const checkIfReported = async () => {
      if (selectedJob) {
        try {
          const response = await axiosInstance.get(`/employee-checkReported/${selectedJob._id}`)
          if (response.data.success) {
            setHasReported(response.data.hasReported)
          }
        } catch (error) {
          console.error('Error checking report status:', error);
        }
      }
    }
    checkIfReported()
  }, [selectedJob])

  useEffect(() => {
    const checkIfApplied = async () => {
      if (selectedJob) {
        try {
          const response = await axiosInstance.get(`/employee-checkApplied/${selectedJob._id}`)
          if (response.data.success) {
            setHasApplied(response.data.hasApplied)
          }
        } catch (error) {
          console.error('Error checking applied status:', error);
        }
      }
    }
    checkIfApplied()
  }, [selectedJob])

  const applyJob = (id, easyApply, application) => {
    if (!isAuthenticated) {
      navigate('/employee-login')
      return
    }
    if (easyApply) {
      navigate(`/employee-reviewApplication/${id}`);
    } else if (!easyApply && application) {
      window.location.href = application;
    } else {
      console.error("Application URL is not provided for this job.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);

    const filtered = jobs.filter((job) =>
      (job.jobTitle.toLowerCase().includes(lowerSearchTerm) || job.companyName.toLowerCase().includes(lowerSearchTerm))
      && (selectedCategory ? job.categoryName === selectedCategory : true)
      && (selectedLocation ? job.jobLocation === selectedLocation : true)
      && (selectedPriceRange ? job.minPrice >= minPrice && job.maxPrice <= maxPrice : true)
    );
    setFilteredJobs(filtered);

    if (filtered.length === 0) {
      setSelectedJob(null);
    } else if (filtered.length > 0 && !filtered.find(job => job._id === selectedJob?._id)) {
      setSelectedJob(filtered[0]);
    }
  };


  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedPriceRange('');
    setFilteredJobs(jobs);
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    } else {
      setSelectedJob(null);
    }

  };

  const handleReportJob = () => {
    if (!isAuthenticated) {
      navigate('/employee-login');
      return;
    }
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleCompanyClick = (id) => {
    navigate(`/employee-companyView/${id}`)

  }

  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  return (
    <div>
      <Navigation />
      <Container className="home-container mt-4">
        <Form onSubmit={handleSearch} className="home-search-form mb-4">
          <Row className="home-search-row">
            <Col md={5} className="home-search-col">
              <Form.Control
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="home-search-input"
              />
            </Col>
            <Col md={4} className="home-category-col">
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="home-category-dropdown"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3} className="home-find-jobs-col">
              <Button variant="primary" type="submit" className="home-find-jobs-button">
                Find
              </Button>
              <Button
                variant="secondary"
                className="home-clear-filters-button"
                onClick={handleBackClick}
              >
                Clear
              </Button>
            </Col>
          </Row>
          <Row className="home-location-price-row">
            <Col md={5} className="home-location-col">
              <Form.Control
                as="select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="home-location-dropdown"
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={4} className="home-price-range-col">
              <Form.Control
                as="select"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="home-price-range-dropdown"
              >
                <option value="">Select Price Range</option>
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
        </Form>
        <h2 className="home-jobs-heading mb-4">Jobs based on your activity</h2>
        <div className="home-row">
          <div className="home-col-md-6">
            <div className="home-job-list">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`home-job-card ${selectedJob && selectedJob._id === job._id ? 'home-job-card-active' : ''}`}
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="home-job-card-header">
                      <h5 className="home-job-title">{job.jobTitle}</h5>
                      <span className="home-company-name" onClick={(e) => { e.stopPropagation(); handleCompanyClick(job.company); }}>
                        {job.companyName}
                      </span>
                    </div>
                    <p className="home-job-location">{job.jobLocation}</p>
                    {job.easyApply &&
                      <div className="home-easy-apply">
                        <span className="home-easy-apply-tag">🚀 Easily apply</span>
                      </div>
                    }
                    <p className="home-job-posted">Posted on {job.jobPostedOn}</p>
                  </div>
                ))
              ) : (
                <p>No jobs found. Please try again.</p>
              )}
            </div>
          </div>
          <div className="home-col-md-6">
            <div className="home-job-details-container">
              {selectedJob ? (
                <div className="home-job-details">
                  <h2 className="home-job-title-highlight">{selectedJob.jobTitle}</h2>
                  <span
                    className="home-company-name-highlight"
                    onClick={() => handleCompanyClick(selectedJob.company)}>
                    {selectedJob.companyName}
                  </span>
                  <div className="home-action-buttons">
                    <button className="btn btn-primary" style={{width:'150px'}} onClick={() => applyJob(selectedJob._id, selectedJob.easyApply, selectedJob.applicationUrl)}
                      disabled={hasApplied}>
                      {hasApplied ? 'Already Applied' : selectedJob.easyApply ? 'Easy Apply' : 'Apply now'}
                    </button>
                  </div>
                  <div className="home-job-info">
                    <div className="home-job-field">
                      <h4>Location</h4>
                      <p>{selectedJob.jobLocation}</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Salary</h4>
                      <p>₹{selectedJob.minPrice} - ₹{selectedJob.maxPrice} a month</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Education (Preferred)</h4>
                      <p>{selectedJob.education}</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Experience</h4>
                      <p>{selectedJob.yearsOfExperience} years</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Employment Type</h4>
                      <p>{selectedJob.employmentType}</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Posted On</h4>
                      <p>{selectedJob.jobPostedOn}</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Description</h4>
                      <p>{selectedJob.description}</p>
                    </div>
                    <div className="home-job-field">
                      <h4>Skills</h4>
                      <ul>
                        {selectedJob.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="home-action-buttons">
                    <button className="home-button" onClick={handleReportJob} disabled={hasReported}>
                      <FaFlag className="home-button-icon" /> {hasReported ? 'Reported' : "Report Job"}
                    </button>
                  </div>
                  {selectedJob && (
                    <ReportJobModal
                      show={showReportModal}
                      handleClose={handleCloseReportModal}
                      jobTitle={selectedJob.jobTitle}
                      jobId={selectedJob._id}
                      companyName={selectedJob.companyName}
                    />
                  )}
                </div>
              ) : (
                <div className="home-job-details">
                  <p></p>
                </div>
              )}
            </div>
          </div>
          {filteredJobs.length > 0 && (
            <ReactPaginate
              previousLabel={<FaArrowLeft />}
              nextLabel={<FaArrowRight />}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(total / limit)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
