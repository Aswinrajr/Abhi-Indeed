import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button} from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import Navigation from '../../../Components/Navigation';
import ReactStars from 'react-rating-stars-component'; 


import './ViewReviews.css';

function ViewReviews() {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/employee-getCompanyDetails/${id}`);
                if (response.data.success) {
                    setCompany(response.data.company);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching company reviews:', error);
                setLoading(false);
            }
        };
        fetchReviews();
    }, [id]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    return (
        <>
            <Navigation />
            <Container className="view-reviews-container">
                <div className="view-reviews-header">
                    <h2 className="view-reviews-title">{company?.companyName} - Reviews</h2>
                </div>
                {company && (!company.reviewsId || company.reviewsId.length === 0) ? (
                    <p>No reviews available for this company.</p>
                ) : (
                    <Row>
                        {company.reviewsId.map((review, index) => (
                            <Col md={12} key={index} className="mb-4">
                                <div className="review-item">
                                    <div className="review-header">
                                        <div className="review-rating">
                                            <span className="review-rating-value">
                                                {review.rating.toFixed(1)}
                                            </span>
                                            <ReactStars
                                                count={5}
                                                value={review.rating}
                                                size={24}
                                                edit={false}
                                                isHalf={true}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <h5 className="reviewer-name">{review.reviewerName}</h5>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <small className="review-date">{new Date(review.reviewDate).toLocaleDateString()}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
}

export default ViewReviews;
