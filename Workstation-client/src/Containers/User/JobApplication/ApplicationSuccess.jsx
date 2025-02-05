import React, { useState } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './ApplicationSuccess.css';
import Navigation from '../../../Components/Navigation';

function ApplicationSuccess() {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <>
            <Navigation />
            <Container className="d-flex align-items-center justify-content-center">
                <Card className="text-center application-success-card mt-3">
                    <Card.Body>
                        <div className="success-icon">✓</div>
                        <Card.Title className="mb-3">Application Submitted!</Card.Title>
                        <Card.Text className="mb-4">
                            Thank you for applying. 
                        </Card.Text>
                        <Button variant="success" onClick={handleGoHome} className="go-home-button ms-2">
                            Go Home
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default ApplicationSuccess;
