import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PageNotFound.css';

function PageNotFound() {
  return (
    <div className="page-not-found">
      <Container className="text-center d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <Row>
          <Col>
            <h1 className="display-4">404</h1>
            <p className="lead">Oops! The page you are looking for does not exist.</p>
            <Button as={Link} to="/" variant="primary">Go Home</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PageNotFound;
