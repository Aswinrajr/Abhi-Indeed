import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaEnvelope, FaCaretDown, FaLaptopCode, FaHome } from 'react-icons/fa';
import logo from '../assets/logo2.png';
import { RecruiterAuth } from '../Context/RecruiterContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReNavigation.css';

function ReNavigation() {
  const { recruiter, Authenticated, RecruiterLogout } = useContext(RecruiterAuth)
  const navigate = useNavigate()
  const handleLogout = async () => {
    await RecruiterLogout();
    navigate('/recruiter-login');
  };
  return (
    <Navbar className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Workstation" style={{ height: '70px', width: '150px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/recruiter-home" className="text-dark me-3">
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/recruiter-Chat" className="text-dark me-3">
              <FaEnvelope />
              <span className="ms-1">Messages</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/recruiter-postJob" className="text-dark me-3">
              <FaLaptopCode />
              <span className="ms-1">Post a Job</span>
            </Nav.Link>
            <NavDropdown
              title={<span className="text-dark">{recruiter?.email}<FaCaretDown className="ms-1" /></span>}
              id="userDropdown"
              align="end"
            >
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ReNavigation;
