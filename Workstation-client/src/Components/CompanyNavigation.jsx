import React, { useContext,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaQuestionCircle, FaBell, FaEnvelope, FaCaretDown, FaLaptopCode, FaHome } from 'react-icons/fa';
import { CompanyAuth } from '../Context/CompanyContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyNavigation.css';

function CompanyNavigation() {
    const { company, Authenticated, CompanyLogout } = useContext(CompanyAuth);
    const navigate = useNavigate();


    useEffect(() => {
        if (!Authenticated) {
            navigate('/company-login');
        }
    }, [Authenticated, navigate]);

    const handleLogout = () => {
        CompanyLogout();
        navigate('/company-login');
    };

   
    return (
        <Navbar className="companynav-navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <Container fluid>
            <Navbar.Brand as={Link} to="/company-home">
    {company?.logo && (
        <img
            src={company.logo}
            alt="Company Logo"
            className="companynav-logo" 
        />
    )}
</Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/company-home" className="companynav-text-dark me-3">
                            <FaHome className="me-1" />
                            Home
                        </Nav.Link>
                        
                        <NavDropdown
                            title={<span className="companynav-text-dark">{company?.email}<FaCaretDown className="ms-1" /></span>}
                            id="companyUserDropdown"
                            align="end"
                        >
                            <NavDropdown.Item as={Link} to="/company-profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CompanyNavigation;
