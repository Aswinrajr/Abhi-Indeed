import React, { useState,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './WorkExperienceModal.css';

const WorkExperienceModal = ({ show, handleClose, onSuccess,initialData }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    city: '',
    state: '',
    country: '',
    startDate: '',
    endDate: '',
    salary: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }else{
      setFormData({jobTitle: '',
        companyName: '',
        city: '',
        state: '',
        country: '',
        startDate: '',
        endDate: '',
        salary: ''
      })
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      let response
      if(initialData){
        response=await axiosInstance.put(`/employee-editWorkExperience/${initialData._id}`,formData)
      }else{
        response = await axiosInstance.post('/employee-addworkexperience', formData);
        setFormData({
          jobTitle: '',
          companyName: '',
          city: '',
          state: '',
          country: '',
          startDate: '',
          endDate: '',
          salary: ''
        });
      }
      if (response.data.success) {
        onSuccess(); 
        handleClose(); 
        setFormData({
          jobTitle: '',
          companyName: '',
          city: '',
          state: '',
          country: '',
          startDate: '',
          endDate: '',
          salary: ''
        });
      }
    } catch (error) {
      console.error('Error adding work experience:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="workexperience-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Work Experience</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formJobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCompanyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formState">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formSalary">
            <Form.Label>Salary</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              placeholder="Enter salary"
              value={formData.currentSalary}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
        {initialData ? 'Update' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkExperienceModal;
