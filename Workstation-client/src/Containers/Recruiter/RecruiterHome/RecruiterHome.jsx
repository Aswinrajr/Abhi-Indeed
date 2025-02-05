import React, { useContext, useEffect } from 'react'
import ReNavigation from '../../../Components/ReNavigation'
import SideNav from '../../../Components/SideNav'
import './RecruiterHome.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { RecruiterAuth } from '../../../Context/RecruiterContext';
import employee from '../../../assets/employee.jpg'
import { useNavigate } from 'react-router-dom';

function RecruiterHome() {
    const navigate=useNavigate()
    const {recruiter,setRecruiter,loading,Authenticated}=useContext(RecruiterAuth)

    if (loading) {
        return <div>Loading...</div>;
      }
  return (
    <div>
      <SideNav/>
      <ReNavigation/>
      <div className="home-component">
        <Container fluid className="bg-primary text-white py-5">
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4">Let’s hire your next great candidate. <span className="highlight">Fast.</span></h1>
              <p>No matter the skills, experience or qualifications you’re looking for, you’ll find the right people here.</p>
              <Button variant="warning" className="mt-3" onClick={()=>navigate('/recruiter-postJob')}>Post a job</Button>
            </Col>
            <Col md={6} className="text-center">
              <img src={employee} alt="Person working on laptop" className="img-fluid rounded-circle" />
            </Col>
          </Row>
        </Container>

        {/* New Section */}
        <Container fluid className="bg-light text-dark py-5">
          <h2 className="text-center mb-4">Manage your hiring from start to finish</h2>
          <Row>
            <Col md={3} className="text-center">
              <h5>Post a job</h5>
              <p>Get started with a job post. Indeed has 2.54 crore unique monthly users.</p>
            </Col>
            <Col md={3} className="text-center">
              <h5>Find quality applicants</h5>
              <p>Customize your post with screening tools and assessments to help narrow down to potential candidates.</p>
            </Col>
            <Col md={3} className="text-center">
              <h5>Make connections</h5>
              <p>Track, message, invite and interview directly on Indeed with no extra apps to download.</p>
            </Col>
            <Col md={3} className="text-center">
              <h5>Hire confidently</h5>
              <p>You're not alone on your hiring journey. We have helpful resources for every step of the hiring process.</p>
            </Col>
          </Row>
        </Container>

        {/* Matched Candidates Section */}
        <Container fluid className="bg-white text-dark py-5">
          <Row className="align-items-center">
            <Col md={6} className="text-center">
              <Card className="matched-candidate-card mx-auto">
                <Card.Body>
                  <Card.Title className="text-left">Match candidates by job</Card.Title>
                  <Card.Text className="text-left">116 resumes match your criteria</Card.Text>
                  <Card className="candidate-card">
                    <Card.Body>
                      <Card.Title>Aisha Negi <span className="location">Pune, MH</span></Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Paediatric Nursing</Card.Subtitle>
                      <Card.Text>
                        <span className="d-block">A&L Medical Center, 2020 - present</span>
                        <span className="d-block">Education: Bachelor's Degree, Central College</span>
                        <span className="d-block">Skills: EMR systems, Nursing, Vital signs</span>
                      </Card.Text>
                      <Button variant="primary" className="w-100">Message</Button>
                      <Card.Text className="text-muted mt-2">Active today</Card.Text>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <h2>Unlock matched candidates with Indeed Smart Sourcing</h2>
              <p>When you have a job posted and add an Indeed Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Indeed fit your job description. When someone stands out, invite them to apply.</p>
              <a href="/explore-smart-sourcing" className="btn btn-link">Explore Smart Sourcing &rarr;</a>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default RecruiterHome
