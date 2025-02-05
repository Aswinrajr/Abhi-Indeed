import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CompanyNavigation from '../../../Components/CompanyNavigation';
import './CompanyProfileForm.css'
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js';
import { useNavigate } from 'react-router-dom';
import { CompanyAuth } from '../../../Context/CompanyContext';


function CompanyProfileForm() {
    
    const { company,setCompany, loading, Authenticated}=useContext(CompanyAuth)
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        companyName: '',
        contactNumber: '',
        establishedYear: '',
        companyaddress: {
          Buildingname: '',
          area: '',
          street: '',
          pincode: '',
          city: '',
          state: '',
          country: 'India'
        }
      });

      useEffect(() => {
          setFormData({
            companyName: company.companyName || '',
            contactNumber: company.contactNumber || '',
            establishedYear: company.establishedYear || '',
            companyaddress: company.companyaddress.length > 0 ? company.companyaddress[0] : {
              Buildingname: '',
              area: '',
              street: '',
              pincode: '',
              city: '',
              state: '',
              country: 'India'
            }
          });
      }, [company]);
    
      const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'companyName' || id === 'contactNumber' || id === 'establishedYear') {
          setFormData({
            ...formData, [id]: value
          });
        } else {
          setFormData({
            ...formData,
            companyaddress: {
              ...formData.companyaddress,
              [id]: value,
            }
          });
        }
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCompanyContact = {
        ...company,
        companyName: formData.companyName,
        contactNumber: formData.contactNumber,
        establishedYear: formData.establishedYear,
        companyaddress: [formData.companyaddress]
      };
      const response = await axiosInstance.put(`/company-updateContact/${company.email}`, { updatedCompanyContact }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('companytoken')}`
        }
      });
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          position: 'top-center'
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
          position: 'top-center'
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again later.';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        timer: 5000,
        position: 'top-center'
      });
    }
  };

  return (
    <>
      <CompanyNavigation/>
      <div className="company-contact-container">
        <Row className="justify-content-center">
          <Col lg={6}>
            <Card>
              <Card.Body>
                <i
                  className="fas fa-arrow-left fa-lg mb-3 company-back-icon"
                  onClick={() => navigate('/company-profile')}
                ></i>
                <h5 className="card-title text-center">Company Contact Information</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="companyName">Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="companyName"
                      readOnly
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="contactNumber">Contact Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>+91</InputGroup.Text>
                      <Form.Control
                        type="text"
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="establishedYear">Established Year</Form.Label>
                    <Form.Control
                      type="text"
                      id="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="Buildingname">Building Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="Buildingname"
                      value={formData.companyaddress.Buildingname}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="area">Area</Form.Label>
                    <Form.Control
                      type="text"
                      id="area"
                      value={formData.companyaddress.area}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="street">Street</Form.Label>
                    <Form.Control
                      type="text"
                      id="street"
                      value={formData.companyaddress.street}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="city">City</Form.Label>
                    <Form.Control
                      type="text"
                      id="city"
                      value={formData.companyaddress.city}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="state">State</Form.Label>
                    <Form.Control
                      type="text"
                      id="state"
                      value={formData.companyaddress.state}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="pincode">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      id="pincode"
                      value={formData.companyaddress.pincode}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="country">Country</Form.Label>
                    <Form.Control
                      type="text"
                      id="country"
                      value={formData.companyaddress.country}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-center mt-4">
                    <Button type="submit" className="company-contact-btn">
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

export default CompanyProfileForm
