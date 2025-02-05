import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor.js';
import { useParams, useNavigate } from 'react-router-dom';
import './CompanyDetailedView.css';
import AdminNavigation from '../../../Components/AdminNavigation.jsx';

function CompanyDetailedView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axiosInstance.get(`/admin-companyDetails/${id}`);
                if (response.data.success) {
                    setCompany(response.data.company);
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        };
        fetchCompany();
    }, [id]);

    const handleBack = () => {
        navigate('/admin-companies');
    };

    if (!company) return <div className="loading">Loading...</div>;

    return (
        <>
        <AdminNavigation/>
        <Container className="company-detailed-view">
            <Button variant="outline-primary" onClick={handleBack} className="back-button">
                ← Back to List
            </Button>
            <Row className="mt-4">
                <Col lg={4}>
                    <Card className="company-card">
                        <Card.Img variant="top" src={company.logo || '/default-logo.png'} className="company-logo" />
                        <Card.Body>
                            <Card.Title className="company-name">{company.companyName}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={8}>
                    <Card className="details-card">
                        <Card.Body>
                            <Card.Title className="details-title">Company Details</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Email:</strong> {company.email}</ListGroup.Item>
                                <ListGroup.Item><strong>Contact Number:</strong> {company.contactNumber}</ListGroup.Item>
                                <ListGroup.Item><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></ListGroup.Item>
                                <ListGroup.Item><strong>Established Year:</strong> {company.establishedYear}</ListGroup.Item>
                                <ListGroup.Item><strong>Type of Company:</strong> {company.typeOfCompany}</ListGroup.Item>
                                <ListGroup.Item><strong>Headquarters:</strong> {company.headQuarters}</ListGroup.Item>
                                <ListGroup.Item><strong>CEO Name:</strong> {company.ceoName}</ListGroup.Item>
                                <ListGroup.Item><strong>Employees:</strong> {company.minEmployees} - {company.maxEmployees}</ListGroup.Item>
                                <ListGroup.Item><strong>Mission Statement:</strong> {company.missionStatement}</ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Social Media:</strong>
                                    <ul className="social-media-list">
                                        {company.socialMedia.linkedin && <li><a href={company.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>}
                                        {company.socialMedia.twitter && <li><a href={company.socialMedia.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></li>}
                                        {company.socialMedia.facebook && <li><a href={company.socialMedia.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
                                    </ul>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Company Address:</strong>
                                    <ul className="address-list">
                                        {company.companyaddress.map((address, index) => (
                                            <li key={index}>
                                                {address.Buildingname}, {address.area}, {address.street}, {address.city}, {address.state}, {address.country} - {address.pincode}
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroup.Item>
                                <ListGroup.Item><strong>Registration Certificate:</strong> {company.registrationCertificate ? <a href={company.registrationCertificate} target="_blank" rel="noopener noreferrer">View Certificate</a> : 'Not Available'}</ListGroup.Item>
                                <ListGroup.Item><strong>License:</strong> {company.license ? <a href={company.license} target="_blank" rel="noopener noreferrer">View License</a> : 'Not Available'}</ListGroup.Item>
                                <ListGroup.Item><strong>Tax Certificate:</strong> {company.taxCertificate ? <a href={company.taxCertificate} target="_blank" rel="noopener noreferrer">View Tax Certificate</a> : 'Not Available'}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default CompanyDetailedView;