import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './Reviews.css';
import ReactStars from 'react-rating-stars-component';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../../Components/Navigation.jsx';

function Reviews() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get('/employee-getCompanies');
        if (response.data.success) {
          setCompanies(response.data.companies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1); 
  };

  const handleCompanyView = (id) => {
    navigate(`/employee-companyView/${id}`);
  };

  const handleViewReviews = (id) => {
    navigate(`/employee-viewReviews/${id}`);
  };

  return (
    <>
    <Navigation/>
    <Container className="candidate-company-reviews-container">
      <Row className="justify-content-center">
        <Col md={10} className="text-center">
          <h1 className="reviews-main-heading">
            Find great places to work
          </h1>
          <p className="reviews-subheading">
            Get access to millions of company reviews
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <h2 className="reviews-section-title">Popular Companies</h2>
        </Col>
      </Row>

      <Row className="reviews-list">
        {companies.map((company) => (
          <Col md={3} sm={6} xs={12} key={company._id} className="mb-4">
            <Card className="reviews-card">
              <div className="reviews-logo">
                <img
                  src={company.logo}
                  alt={company.companyName}
                  className="img-fluid"
                />
              </div>
              <Card.Title
                className="reviews-company-title"
                onClick={() => handleCompanyView(company._id)}
              >
                {company.companyName}
              </Card.Title>
              <div className="reviews-rating">
                <ReactStars
                  count={5}
                  value={parseFloat(calculateAverageRating(company.reviewsId))}
                  size={20}
                  isHalf={true}
                  edit={false}
                  activeColor="#ffd700"
                />
                <span className="reviews-count">
                  {calculateAverageRating(company.reviewsId)} 
                </span>
              </div>
              <Button
                variant="link"
                onClick={() => handleViewReviews(company._id)}
                className="view-reviews-button"
              >
                View Reviews
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
}

export default Reviews;
