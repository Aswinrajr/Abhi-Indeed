import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import Navigation from '../../../Components/Navigation.jsx';
import {  Container, Row, Col, Card, Button, Modal, Form} from 'react-bootstrap';
import { FaEdit, FaTrash ,FaStar } from 'react-icons/fa';
import RatingStars from 'react-rating-stars-component';
import Swal from 'sweetalert2'; 
import './IndividualReviews.css';
import { AuthContext } from '../../../Context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

function IndividualReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
      const [showEditModal, setShowEditModal] = useState(false);
    const [editReview, setEditReview] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const {user,isAuthenticated}=useContext(AuthContext)
    const navigate=useNavigate()

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await axiosInstance.get('/employee-individualReviews');
                if (response.data.success) {
                    setReviews(response.data.reviews);
                }
            } catch (error) {
                console.error('Error fetching user reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserReviews();
    }, []);

    const handleEditClick = (review) => {
        setEditReview(review);
        setNewRating(review.rating);
        setNewComment(review.comment);
        setShowEditModal(true);
        };

        const handleEditSubmit = async () => {
            try {
                const updatedReview = {
                    rating: newRating,
                    comment: newComment,
                };
                const response = await axiosInstance.put(`/employee-updateReview/${editReview._id}`, updatedReview);
                if (response.data.success) {
                    const updatedReviewsResponse = await axiosInstance.get('/employee-individualReviews');
                    if (updatedReviewsResponse.data.success) {
                        setReviews(updatedReviewsResponse.data.reviews);
                    }
                    setShowEditModal(false);
                }
            } catch (error) {
                console.error('Error updating review:', error);
            }
        };

    const handleDelete = async (reviewId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this review?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                const response = await axiosInstance.delete(`/employee-deleteIndividualReviews/${reviewId}`);
                if (response.data.success) {
                    setReviews(reviews.filter(review => review._id !== reviewId));
                    Swal.fire(
                        'Deleted!',
                        'Your review has been deleted.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navigation />
            <Container className="individual-reviews-container">
                <h2>Your Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : (
                    <Row>
                        {reviews.map((review) => (
                            <Col md={4} key={review._id} className="mb-4">
                                <Card className="individual-reviews-card">
                                    <Card.Body>
                                        <div className="review-actions">
                                            <Button
                                                variant="link"
                                                onClick={() => handleEditClick(review)}
                                                className="me-2"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="link"
                                                onClick={() => handleDelete(review._id)}
                                                className="text-danger"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                        <Card.Title>{review.company.companyName}</Card.Title>
                                        <Card.Text className="rating-title">Rating</Card.Text>
                                        <div className="stars">
                                            <RatingStars
                                                count={5}
                                                value={review.rating}
                                                edit={false}
                                                size={24}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <Card.Text className="review-title">Review</Card.Text>
                                        <Card.Text>{review.comment}</Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">
                                        {new Date(review.reviewDate).toLocaleDateString()}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Update Your Rating</h5>
                    <div className="star-rating mb-4">
                        {[...Array(5)].map((_, index) => {
                            index += 1;
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    className={`star-button ${index <= newRating ? 'on' : 'off'}`}
                                    onClick={() => setNewRating(index)}
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
                            placeholder="Update your review..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IndividualReviews;
