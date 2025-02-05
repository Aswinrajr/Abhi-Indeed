import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaQuestionCircle, FaBell, FaEnvelope, FaCaretDown, FaLaptopCode, FaHome, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo2.png';
import { AdminAuth } from '../Context/AdminContext';
import './AdminNavigation.css'
function AdminNavigation() {
    const {admin,AdminLogout}=useContext(AdminAuth)
    const navigate=useNavigate()
    const handleLogout=async()=>{
        await AdminLogout()
        navigate('/admin-login')
    }

  return (
    <Navbar className="navbar adminnav navbar-expand-lg navbar-light bg-white border-bottom">
            <Container fluid>
                <Navbar.Brand as={Link} to="/admin-home">
                    <img src={logo} alt="Workstation" style={{ height: '70px', width: '150px' }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/admin-home" className="text-dark me-3">
                            <FaHome className="me-1" />
                            Home
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout} className="text-dark me-3">
                            <FaSignOutAlt />
                            <span className="ms-1">Logout</span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}

export default AdminNavigation
