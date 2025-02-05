import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card,Button } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor';
import Navigation from '../../../Components/Navigation';
import './CompanyView.css';

function CompanyView() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/employee-getCompanyDetails/${id}`);
        if (response.data.success) {            
          setCompany(response.data.company);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return <p>Loading company details...</p>;
  }

  if (!company) {
    return <p>Company not found.</p>;
  }
  const handleViewReviews=()=>{
    navigate(`/employee-viewReviews/${id}`)
  }

  return (
    <>
    <Navigation/>
    <Container className="company-view-container mt-5">
      <Row className="text-center mb-4">
        <Col>
          {company.logo && (
            <img
              src={company.logo}
              alt={`${company.companyName} logo`}
              className="company-view-logo"
            />
          )}
          <h1 className="company-view-title">{company.companyName}</h1>
          <p className="company-view-type">{company.typeOfCompany}</p>
        </Col>
        <Col md="auto" className="text-right">
            <Button variant="primary" onClick={handleViewReviews}>View Reviews</Button>
          </Col>
      </Row>

      {/* Snapshot Section */}
      <Row className="company-view-snapshot mb-4">
        <Col>
          <Card className="company-view-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">CEO</h5>
                <p>{company.ceoName}</p>
              </div>
              <div>
                <h5 className="mb-0">Founded</h5>
                <p>{company.establishedYear}</p>
              </div>
              <div>
                <h5 className="mb-0">Company Employees</h5>
                <p>{company.minEmployees} - {company.maxEmployees}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Information Section */}
      <Row className="mb-4">
        <Col>
          <Card className="company-view-card">
            <Card.Body>
              <Card.Title>Contact Information</Card.Title>
              <p><strong>Email:</strong> {company.email}</p>
              <p><strong>Contact Number:</strong> {company.contactNumber}</p>
              <p><strong>Website:</strong> <a href={company.website}>{company.website}</a></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="company-view-card">
            <Card.Body>
              <Card.Title>Social Media</Card.Title>
              {company?.socialMedia?.linkedin && <p><strong>LinkedIn:</strong> <a href={company?.socialMedia?.linkedin}>{company?.socialMedia?.linkedin}</a></p>}
              {company?.socialMedia?.twitter && <p><strong>Twitter:</strong> <a href={company?.socialMedia?.twitter}>{company?.socialMedia?.twitter}</a></p>}
              {company?.socialMedia?.facebook && <p><strong>Facebook:</strong> <a href={company?.socialMedia?.facebook}>{company?.socialMedia?.facebook}</a></p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {company.companyaddress && company.companyaddress.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="company-view-card">
              <Card.Body>
                <Card.Title>Company Addresses</Card.Title>
                {company.companyaddress.map((address, index) => (
                  <div key={index} className="mb-3">
                    <p><strong>Building Name:</strong> {address.Buildingname}</p>
                    <p><strong>Area:</strong> {address.area}</p>
                    <p><strong>Street:</strong> {address.street}</p>
                    <p><strong>City:</strong> {address.city}</p>
                    <p><strong>State:</strong> {address.state}</p>
                    <p><strong>Country:</strong> {address.country}</p>
                    <p><strong>Pincode:</strong> {address.pincode}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {company.reviews && company.reviews.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="company-view-card">
              <Card.Body>
                <Card.Title>Reviews</Card.Title>
                {company.reviews.map((review, index) => (
                  <div key={index} className="mb-3">
                    <p><strong>Reviewer:</strong> {review.reviewerName}</p>
                    <p><strong>Rating:</strong> {review.rating} / 5</p>
                    <p><strong>Comment:</strong> {review.comment}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
    </>
  );
}

export default CompanyView;
