import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="py-4">
          <Col md={3} sm={6} className="mb-3">
            <h5 className="footer-heading">Company Name</h5>
            <p>WORK STATION</p>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <h5 className="footer-heading">Services</h5>
            <ul className="footer-list">
              <li>About</li>
              <li>Contact Us</li>
            </ul>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <h5 className="footer-heading">Useful Links</h5>
            <ul className="footer-list">
              <li>Shipping</li>
            </ul>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <h5 className="footer-heading">Address</h5>
            <p>WorkStation,Palarivattom,Kochi-3</p>
            <p>PH:9874563210</p>
          </Col>
        </Row>
      </Container>
      <div className="copyright">
        <Container>
          <Row>
            <Col className="text-center py-3">
              <p className="mb-0">&copy; Copyright WorkStation 2024</p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;