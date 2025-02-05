import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaDollarSign, FaBriefcase, FaPhone, FaLightbulb, FaUsers, FaComments, FaChartBar, FaTools, FaUserTie , FaThList,FaBuilding,FaClipboardList } from 'react-icons/fa';
import './AdminSideNavigation.css';

function AdminSideNavigation() {
  return (
    <div className="side-nav">
    <Nav className="flex-column">
      <Nav.Item className="side-nav-item">
        <Link to="/admin-home">
          <FaTachometerAlt /> Dashboard
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/admin-plans">
          <FaDollarSign /> Plans
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/admin-candidates">
          <FaUsers /> Candidates
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/admin-recruiters">
          <FaUserTie /> Recruiters
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/admin-jobs">
          <FaBriefcase /> Jobs
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
          <Link to="/admin-categories">
            <FaThList /> Categories
          </Link>
        </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/admin-companies">
          <FaBuilding /> Companies
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/admin-orders">
          <FaClipboardList  /> Orders
        </Link>
      </Nav.Item>
      {/* <Nav.Item className="side-nav-item">
        <Link to="/analytics">
          <FaChartBar /> Analytics
        </Link>
      </Nav.Item>
      <Nav.Item className="side-nav-item">
        <Link to="/tools">
          <FaTools /> Tools
        </Link>
      </Nav.Item> */}
    </Nav>
  </div>

  )
}

export default AdminSideNavigation
