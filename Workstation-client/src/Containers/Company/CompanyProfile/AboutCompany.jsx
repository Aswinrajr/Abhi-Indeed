import React, { useContext, useEffect } from 'react';
import { CompanyAuth } from '../../../Context/CompanyContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaUserTie, FaUsers, FaQuoteLeft, FaFacebook, FaTwitter, FaLinkedin, FaEdit } from 'react-icons/fa';
import './AboutCompany.css';
import CompanyNavigation from '../../../Components/CompanyNavigation';

function AboutCompany() {
    const { company, loading, Authenticated } = useContext(CompanyAuth);
    const navigate = useNavigate();

    return (
        <>
            <CompanyNavigation />
            <Container className="about-company-container">
            <i
                  className="fas fa-arrow-left fa-lg mb-3 edit-about-back-icon"
                  onClick={() => navigate('/company-profile')}
                ></i>
                <h1 className="company-name">{company.companyName}</h1>
                
                <Row className="info-section">
                    <Col md={6}>
                        <h2>Company Overview</h2>
                        <ul className="info-list">
                            <li><FaBuilding /> <span>Type:</span> {company.typeOfCompany}</li>
                            <li><FaGlobe /> <span>Website:</span> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></li>
                            <li><FaMapMarkerAlt /> <span>Headquarters:</span> {company.headQuarters}</li>
                            <li><FaUserTie /> <span>CEO:</span> {company.ceoName}</li>
                            <li><FaUsers /> <span>Employees:</span> {company.minEmployees}- {company.maxEmployees}</li>
                        </ul>
                    </Col>
                    <Col md={6}>
                        <h2>Mission Statement</h2>
                        <blockquote className="mission-statement">
                            <FaQuoteLeft className="quote-icon" />
                            {company.missionStatement}
                        </blockquote>
                    </Col>
                </Row>
                <Row className="social-section">
    <Col>
        <h2>Connect With Us</h2>
        <div className="social-links">
            {company.socialMedia?.facebook && (
                <a href={company.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                    <FaFacebook size={24} />
                    <span>Facebook</span>
                </a>
            )}
            {company.socialMedia?.twitter && (
                <a href={company.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                    <FaTwitter size={24} />
                    <span>Twitter</span>
                </a>
            )}
            {company.socialMedia?.linkedin && (
                <a href={company.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                    <FaLinkedin size={24} />
                    <span>LinkedIn</span>
                </a>
            )}
        </div>
    </Col>
</Row>
                <div className="edit-section">
                    <Button variant="outline-secondary" onClick={() => navigate('/company-editAboutDetails')}>
                        <FaEdit /> Edit Company Details
                    </Button>
                </div>
            </Container>
        </>
    );
}

export default AboutCompany;