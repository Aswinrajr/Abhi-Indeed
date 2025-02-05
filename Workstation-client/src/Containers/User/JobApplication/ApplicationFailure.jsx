import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ApplicationFailure.css';
import Navigation from '../../../Components/Navigation';

const ApplicationFailure = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
    <Navigation/>
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="text-center application-result-card failure-card">
        <Card.Body>
          <div className="result-icon failure-icon">✕</div>
          <Card.Title className="mb-4">Application Submission Failed</Card.Title>
          <Card.Text>
            We're sorry, but there was an error submitting your application. Please try again or contact support if the issue persists.
          </Card.Text>
          <div className="mt-4">
            <Button variant="outline-secondary" onClick={handleGoHome} className="action-button go-home-button">
              Go to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default ApplicationFailure;