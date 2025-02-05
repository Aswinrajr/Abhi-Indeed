import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import './CompanyReviews.css';
import AdminNavigation from '../../../Components/AdminNavigation';
import CompanyNavigation from '../../../Components/CompanyNavigation';

function CompanyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get('/company-getCompanyReviews');
        if (response.data.success) {
          setReviews(response.data.reviews);
        } else {
          setError('No reviews found.');
        }
      } catch (error) {
        setError('Error fetching reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star" />);
    }
    if (halfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading reviews...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <>
    <CompanyNavigation/>
    <Container className="company-reviews-container mt-5">
      <Button variant="link" className="back-arrow" onClick={() => window.history.back()}>
        <FaArrowLeft /> Back
      </Button>
      <Row>
        <Col>
          <Card className="company-reviews-card">
            <Card.Body>
              <Card.Title className="mb-4">Reviews</Card.Title>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <Card className="mb-4 company-review-card" key={index}>
                    <Card.Body>
                      <Card.Title className="d-flex align-items-center">
                        {review.reviewerName}
                        <div className="ml-2">{renderStars(review.rating)}</div>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Rating: {review.rating} / 5</Card.Subtitle>
                      <Card.Text>{review.comment}</Card.Text>
                      <Card.Footer className="text-muted">
                        Reviewed on {new Date(review.reviewDate).toLocaleDateString()}
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No reviews available for this company.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default CompanyReviews;
