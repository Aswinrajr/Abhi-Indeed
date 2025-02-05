import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaPlus,FaEdit, FaTrash} from 'react-icons/fa';
import { AuthContext } from '../../../Context/UserContext';
import Navigation from '../../../Components/Navigation';
import WorkExperienceModal from './WorkExperienceModal';
import './WorkExperience.css';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';

const WorkExperience = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [initialData,setInitialData]=useState(null)
  const { user, loading } = useContext(AuthContext);  

  useEffect(() => {
    if (user) {
      fetchWorkExperience();
    }
  }, [user]);

  const fetchWorkExperience = async () => {
    try {
      const response = await axiosInstance.get('/employee-getWorkExperience');
      if (response.data.success) {
        setWorkExperiences(response.data.experiences);
      }
    } catch (error) {
      console.error('Error fetching work experiences:', error);
    }
  };

  const handleOpenModal = (experience=null) => {
    setInitialData(experience);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInitialData(null)
  };

  const refreshWorkExperiences = async () => {
    try {
      const response = await axiosInstance.get('/employee-getWorkExperience');
      if (response.data.success) {
        setWorkExperiences(response.data.experiences);
      }
    } catch (error) {
      console.error('Error refreshing work experiences:', error);
    }
  };

  const handleDelete = async (experienceId) => {
    try {
      const response=await axiosInstance.delete(`/employee-deleteWorkExperience/${experienceId}`);      
      if(response.data.success){
        fetchWorkExperience();
      }
    } catch (error) {
      console.error('Error deleting work experience:', error);
    }
  };

  if (!user && !loading) {
    navigate('/employee-login');
  }

  return (
    <div>
      <Navigation />
      <div className="workexperience-container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mb-3">Work Experience</h2>
            <p className="text-muted mb-4">
              List your past work experience to help employers understand your professional background.
            </p>

            <div className="workexperience-section">
              {workExperiences && workExperiences.length > 0 ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <FaBriefcase className="me-3" size={20} color="#6c757d" />
                    <h3 className="flex-grow-1">Work Experience</h3>
                    <FaPlus
                      size={20}
                      color="#0d6efd"
                      onClick={handleOpenModal}
                      style={{ cursor: 'pointer', marginLeft: 'auto' }}
                    />
                  </div>
                  {workExperiences.map((experience, index) => (
                    <div key={index} className="workexperience-card">
                      <div className="workexperience-details">
                        <h5 className="job-title">{experience.jobTitle}</h5>
                        <p className="company-name">{experience.companyName}</p>
                        <p>{experience.city}, {experience.state}, {experience.country}</p>
                        <p>{experience.startDate} - {experience.endDate}</p>
                        <p>Salary: {experience.currentSalary ? `$${experience.currentSalary}` : 'N/A'}</p>
                      </div>
                      <div className="workexperience-actions">
                      <FaEdit 
                        className="edit-icon" 
                        onClick={() => handleOpenModal(experience)} 
                      />
                      <FaTrash 
                        className="delete-icon" 
                        onClick={() => handleDelete(experience._id)} 
                      />
                    </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="workexperience-item d-flex align-items-center py-3 border-bottom">
                  <FaBriefcase className="me-3" size={20} color="#6c757d" />
                  <span className="flex-grow-1">Add work experience</span>
                  <FaPlus size={20} color="#0d6efd" onClick={handleOpenModal} style={{ cursor: 'pointer' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <WorkExperienceModal
          show={showModal}
          handleClose={handleCloseModal}
          onSuccess={refreshWorkExperiences} 
          initialData={initialData}
        />
      )}
    </div>
  );
};

export default WorkExperience;
