import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaUserTie, FaBriefcase, FaUser, FaThList, FaBuilding,FaStar  } from 'react-icons/fa';
import './CompanySideNavigation.css';

function CompanySideNavigation() {
  return (
    <div className="company-side-nav">
      <Nav className="flex-column">
        <Nav.Item className="company-side-nav-item">
          <Link to="/company-home">
            <FaTachometerAlt /> Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item className="company-side-nav-item">
          <Link to="/company-profile">
            <FaUser /> Profile
          </Link>
        </Nav.Item>
        <Nav.Item className="company-side-nav-item">
          <Link to="/company-reviews">
            <FaStar /> Reviews
          </Link>
        </Nav.Item>
        <Nav.Item className="company-side-nav-item">
          <Link to="/company-recruiters">
            <FaUserTie /> Employees
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default CompanySideNavigation;
