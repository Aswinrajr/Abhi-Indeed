import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CompanyNavigation from '../../../Components/CompanyNavigation';
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js';
import { useNavigate } from 'react-router-dom';
import { CompanyAuth } from '../../../Context/CompanyContext';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './EditAboutDetails.css';

function EditAboutDetails() {
  const { company,setCompany, Authenticated, loading } = useContext(CompanyAuth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    typeOfCompany: '',
    website: '',
    headQuarters: '',
    ceoName: '',
    minEmployees: '',
    maxEmployees: '',
    missionStatement: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
    },
  });

  useEffect(() => {
      setFormData({
        typeOfCompany: company.typeOfCompany || '',
        website: company.website || '',
        headQuarters: company.headQuarters || '',
        ceoName: company.ceoName || '',
        minEmployees: company.minEmployees || '',
        maxEmployees: company.maxEmployees || '',
        missionStatement: company.missionStatement || '',
        socialLinks: {
          facebook: company.socialMedia?.facebook || '',
          twitter: company.socialMedia?.twitter || '',
          linkedin: company.socialMedia?.linkedin || '',
        },
      });
  }, [company]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (['facebook', 'twitter', 'linkedin'].includes(id)) {
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [id]: value,
        },
      });
    } else if (id === 'minEmployees' || id === 'maxEmployees') {
      setFormData({
        ...formData,
        [id]: value,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const updatedCompanyAbout={
    ...company,
    typeOfCompany:formData.typeOfCompany,
    website:formData.website,
    headQuarters:formData.headQuarters,
    ceoName:formData.ceoName,
    minEmployees:formData.minEmployees,
    maxEmployees:formData.maxEmployees,
    missionStatement:formData.missionStatement,
    socialMedia:formData.socialLinks
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/company-updateAboutDetails/${company.email}`, {updatedCompanyAbout}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('companytoken')}`,
        },
      });
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        });
        navigate('/company-profile');
        setCompany(response.data.company);
        localStorage.setItem('company', JSON.stringify(response.data.company));
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again later.';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        timer: 5000,
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <CompanyNavigation />
      <div className="edit-about-container">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <Card.Body>
                <i
                  className="fas fa-arrow-left fa-lg mb-3 edit-about-back-icon"
                  onClick={() => navigate('/company-about')}
                ></i>
                <h5 className="card-title text-center">Edit Company Details</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="typeOfCompany">Company Type</Form.Label>
                    <Form.Control
                      type="text"
                      id="typeOfCompany"
                      value={formData.typeOfCompany}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="website">Website</Form.Label>
                    <Form.Control
                      type="text"
                      id="website"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="headQuarters">Headquarters</Form.Label>
                    <Form.Control
                      type="text"
                      id="headQuarters"
                      value={formData.headQuarters}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="ceoName">CEO Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="ceoName"
                      value={formData.ceoName}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="minEmployees">Minimum Number of Employees</Form.Label>
                    <Form.Control
                      type="number"
                      id="minEmployees"
                      value={formData.minEmployees}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="maxEmployees">Maximum Number of Employees</Form.Label>
                    <Form.Control
                      type="number"
                      id="maxEmployees"
                      value={formData.maxEmployees}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="missionStatement">Mission Statement</Form.Label>
                    <Form.Control
                      as="textarea"
                      id="missionStatement"
                      value={formData.missionStatement}
                      onChange={handleChange}
                      rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Social Media Links</Form.Label>
                    <InputGroup className="mb-2">
                      <InputGroup.Text><FaFacebook /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        id="facebook"
                        placeholder="Facebook URL"
                        value={formData.socialLinks.facebook}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <InputGroup.Text><FaTwitter /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        id="twitter"
                        placeholder="Twitter URL"
                        value={formData.socialLinks.twitter}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <InputGroup.Text><FaLinkedin /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        id="linkedin"
                        placeholder="LinkedIn URL"
                        value={formData.socialLinks.linkedin}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-center mt-4">
                    <Button type="submit" className="edit-about-btn">
                      Save
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default EditAboutDetails;
