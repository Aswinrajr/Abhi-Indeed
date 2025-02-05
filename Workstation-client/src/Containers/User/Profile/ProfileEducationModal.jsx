import React, { useState, useContext,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../../Context/UserContext';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './ProfileEducationModal.css';

const ProfileEducationModal = ({ show, handleClose,educationData }) => {
  const { user, setUser } = useContext(AuthContext);
  const [education, setEducation] = useState({
    levelOfEducation: '',
    degree: '',
    specialization: '',
    city: '',
    state: '',
    country: '',
    collegeName: '',
    startDate: '',
    endDate: '',
    courseType: '',
    percentage: ''
  });

  useEffect(()=>{
    if(educationData){
      setEducation(educationData)
    }else{
      setEducation({
        levelOfEducation: '',
        degree: '',
        specialization: '',
        city: '',
        state: '',
        country: '',
        collegeName: '',
        startDate: '',
        endDate: '',
        courseType: '',
        percentage: ''
      });
    }
  },[educationData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducation((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response
      if(educationData){
        response=await axiosInstance.put(`/employee-editEducation/${educationData._id}`,{education})
      }else{
        response = await axiosInstance.post(`/employee-addQualification/education/${user.email}`, {
          education
        });
      }
      console.log(response,"RESSSSS");
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        handleClose();
        setEducation({
          levelOfEducation: '',
          degree: '',
          specialization: '',
          city: '',
          state: '',
          country: '',
          collegeName: '',
          startDate: '',
          endDate: '',
          courseType: '',
          percentage: ''
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="profile-education-modal">
      <Modal.Header closeButton>
        <Modal.Title>{educationData ? 'Edit Education' : 'Add Education'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formLevelOfEducation">
            <Form.Label>Level of Education</Form.Label>
            <Form.Control
              type="text"
              name="levelOfEducation"
              value={education.levelOfEducation}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDegree">
            <Form.Label>Degree</Form.Label>
            <Form.Control
              type="text"
              name="degree"
              value={education.degree}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSpecialization">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              name="specialization"
              value={education.specialization}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={education.city}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formState">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={education.state}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={education.country}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCollegeName">
            <Form.Label>College Name</Form.Label>
            <Form.Control
              type="text"
              name="collegeName"
              value={education.collegeName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={education.startDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={education.endDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCourseType">
            <Form.Label>Course Type</Form.Label>
            <Form.Control
              type="text"
              name="courseType"
              value={education.courseType}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPercentage">
            <Form.Label>Percentage/CGPA</Form.Label>
            <Form.Control
              type="text"
              name="percentage"
              value={education.percentage}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Education
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileEducationModal;
