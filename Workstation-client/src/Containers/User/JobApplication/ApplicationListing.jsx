import React, { useState, useEffect } from 'react';
import Navigation from '../../../Components/Navigation';
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaStar, FaArrowRight, FaArrowLeft, FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

function ApplicationListing() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axiosInstance.get(`/employee-getApplications?page=${page}&limit=${limit}`)
        if (response.data.success) {
          const fetchedApplications = response.data.applications;
          setApplications(fetchedApplications);
          setFilteredApplications(fetchedApplications);
          fetchedApplications.forEach(app => {
            checkIfUserReviewed(app.companyId);
          });
          setTotal(response.data.total)
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchApplication();
  }, [page]);

  const handleSearchFilter = () => {
    const filtered = applications.filter(application =>
      application.jobId.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplications(filtered);
  }

  const checkIfUserReviewed = async (companyId) => {
    try {
      const response = await axiosInstance.get(`/employee-checkReview/${companyId}`);
      if (response.data.success && response.data.hasReviewed) {
        setHasReviewed(prev => ({ ...prev, [companyId]: true }));
      } else {
        setHasReviewed(prev => ({ ...prev, [companyId]: false }));
      }
    } catch (error) {
      console.error('Error checking review status:', error);
    }
  };

  const handleMessageClick = async (jobId, employerId) => {
    try {
      const response = await axiosInstance.get(`/employee-getChatRoom/${jobId}/${employerId}`);
      if (response.data.success) {
        navigate(`/employee-startChat/${jobId}/${employerId}`, {
          state: {
            room: response.data.room.chatRoom,
            recruiter: response.data.room.recruiter
          }
        });
      } else {
        const createResponse = await axiosInstance.post('/employee-createRoom', { jobId, employerId });
        if (createResponse.data.success) {
          navigate(`/employee-startChat/${jobId}/${employerId}`, {
            state: {
              room: createResponse.data.room.chatRoom,
              recruiter: createResponse.data.room.recruiter
            }
          });
        } else {
          console.error('Failed to create chat room:', createResponse.data.message);
        }
      }
    } catch (error) {
      console.error('Error handling chat room:', error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewData = {
        rating,
        comment: review,
        company: selectedCompanyId,
      };
      const response = await axiosInstance.post('/employee-addReviewAndRating', { reviewData });
      if (response.data.success) {
        Swal.fire({
          title: 'Review Submitted!',
          text: 'Thank you for your review.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          setShowModal(false);
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };



  const handleShowModal = (id) => {
    setSelectedCompanyId(id);
    checkIfUserReviewed(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRating(0);
    setReview('');
  }

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/employee-getSearchApplication?searchTerm=${searchTerm}&page=${page}&limit=${limit}`);
      if (response.data.success) {
        const fetchedApplications = response.data.applications;
        setApplications(fetchedApplications);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <FaSpinner className="status-icon status-icon-applied" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon status-icon-rejected" />;
      case 'interviewing':
        return <FaClock className="status-icon status-icon-interviewing" />;
      case 'hired':
        return <FaCheckCircle className="status-icon status-icon-hired" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'interviewing':
        return 'Interviewing';
      case 'hired':
        return 'Hired';
      default:
        return status;
    }
  };

  const isReviewButtonDisabled = (companyId) => {
    return hasReviewed[companyId] || false;
  };


  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredApplications(applications);
  };

  return (
    <>
      <Navigation />
      <Container className="employee-application-listing-container">
        <div className="search-wrapper">
          <InputGroup>
            <Form.Control
              type="text"
              style={{
                marginTop: '20px',
                maxWidth: '1000px',
                borderRadius: '5px',
              }}
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              style={{
                backgroundColor: '#007bff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                padding: '0 10px',
                width: '100px',
                height: '35px',
                marginTop: '20px',
                transition: 'background-color 0.3s ease'
              }}
              onClick={handleSearchFilter}
            >
              Search
            </button>
            <button style={{
              backgroundColor: 'grey', color: 'black', border: 'none',
              borderRadius: '5px',
              padding: '0 10px',
              width: '100px',
              height: '35px',
              marginTop: '20px',
              transition: 'background-color 0.3s ease'
            }}
              onClick={handleClearSearch}
              variant="secondary" disabled={!searchTerm}>
              Clear
            </button>
          </InputGroup>
        </div>
        {filteredApplications.length === 0 ? (
          <div className="employee-no-applications-message">No applications available</div>
        ) : (
          filteredApplications.map((application, index) => (
            <Card key={index} className="employee-application-item mt-4">
              <Card.Body>
                <Row>
                  <Col md={4} className="employee-application-details">
                    <div className="employee-job-header">
                      <h3 className="employee-job-title">{application.jobId.jobTitle}</h3>
                    </div>
                    <p className="employee-company-name">{application.jobId.companyName}</p>
                    <p className="employee-location">{application.jobId.jobLocation}</p>
                    <p className="employee-applied-on">Applied on: {application.appliedOn}</p>
                  </Col>
                  <Col md={4}>
                    <div className="employee-job-listingstatus">
                      <p className="status-listingheading">Status</p>
                      <div className="status-indicator">
                        {getStatusIcon(application.status)}
                        <span className={`status-listingtext status-text-${application.status.toLowerCase()}`}>
                          {getStatusText(application.status)}
                        </span>
                        {application.status.toLowerCase() === 'hired' && (
                          <Button variant="link" disabled={isReviewButtonDisabled(application.companyId)} className="write-review-button" onClick={() => handleShowModal(application.companyId)}>
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="employee-application-actions">
                    <Button
                      className="employee-message-employer" style={{width:'160px'}}
                      onClick={() => handleMessageClick(application.jobId._id, application.employerId)}
                    >
                      Message to employer <span className="employee-arrow-symbol">&rarr;</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Write a Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Rate Your Experience</h5>
            <div className="star-rating mb-4">
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`star-button ${index <= (hover || rating) ? 'on' : 'off'}`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <FaStar className="star" />
                  </button>
                );
              })}
            </div>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
           
            <Button variant="primary" style={{width:'150px'}} onClick={handleSubmitReview}>
              Submit Review
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default ApplicationListing;
