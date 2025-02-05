import React from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css';
import { FaPlus, FaBriefcase, FaPhone, FaUsers, FaUserTie, FaChartBar, FaFolder, FaTimes } from 'react-icons/fa';

function SideNav() {
  return (
    <div className="side-nav">
      <div className="nav-header">
        <FaTimes className="close-icon" />
        <span>Collapse</span>
      </div>
      <Link to="/recruiter-postJob" className="side-nav-link create-new">
        <FaPlus /> <span>Create new</span>
      </Link>
      <Link to="/recruiter-listJob" className="side-nav-link">
        <FaBriefcase /> <span>Jobs</span>
      </Link>
    </div>
  );
}

export default SideNav;