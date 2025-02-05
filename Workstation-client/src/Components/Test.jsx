import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaDollarSign, FaBriefcase, FaPhone, FaLightbulb, FaUsers, FaComments, FaChartBar, FaTools, FaUserTie } from 'react-icons/fa';
import './Test.css';

const Test = () => {
  return (
    <div className="side-nav">
      <Nav className="flex-column">
        <Nav.Item className="side-nav-item">
          <Link to="/dashboard">
            <FaTachometerAlt /> Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/payments">
            <FaDollarSign /> Payments
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/candidates">
            <FaUsers /> Candidates
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/recruiters">
            <FaUserTie /> Recruiters
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/jobs">
            <FaBriefcase /> Jobs
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/phone-calls">
            <FaPhone /> Phone calls
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/smart-sourcing">
            <FaLightbulb /> Smart Sourcing
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/interviews">
            <FaComments /> Interviews
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/analytics">
            <FaChartBar /> Analytics
          </Link>
        </Nav.Item>
        <Nav.Item className="side-nav-item">
          <Link to="/tools">
            <FaTools /> Tools
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default Test
