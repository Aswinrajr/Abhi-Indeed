import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import { Container, Card, Button, Form } from 'react-bootstrap';
import './ReviewApplication.css';
import { FaTrash, FaEdit, FaFile } from 'react-icons/fa';
import { AuthContext } from '../../../Context/UserContext';
import Navigation from '../../../Components/Navigation.jsx';
import ProfileSkillModal from '../Profile/ProfileSkillModal.jsx';
import ProfileEducationModal from '../Profile/ProfileEducationModal.jsx';
import WorkExperienceModal from '../Profile/WorkExperienceModal.jsx';


function ReviewApplication() {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentCompany, setCurrentCompany] = useState('')
  const [currentSalary, setCurrentSalary] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [showSkillModal,setShowSkillModal]=useState(false)
  const [skillToEdit, setSkillToEdit] = useState(null);
  const [showEducationModal,setShowEducationModal]=useState(false)
  const [educationToEdit,setEducationToEdit]=useState(null)
  const [showWorkExperienceModal, setShowWorkExperienceModal] = useState(false);
  const [workExperienceToEdit, setWorkExperienceToEdit] = useState(null);
  const [currentSalaryError, setCurrentSalaryError] = useState('');
const [expectedSalaryError, setExpectedSalaryError] = useState('');
const [yearsOfExperienceError, setYearsOfExperienceError] = useState('');



  useEffect(() => {
    if (user) {
      const fetchJobDetails = async () => {
        try {
          const response = await axiosInstance.get(`/employee-getIndividualJobDetails/${id}`);

          if (response.data.success) {
            setJobDetails(response.data.job);
          }
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };
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

      fetchJobDetails();
      fetchWorkExperience();
    }
  }, [user, id]);

  if (!jobDetails) {
    return <div className="loading">Loading...</div>;
  }

  const handleApply = async () => {
    try {
      const applicationData = {
        name: user.username,
        email: user.email,
        contact: user.contact,
        dob: user.dob,
        totalExperience: yearsOfExperience,
        currentCompany: currentCompany,
        currentSalary: currentSalary,
        expectedSalary: expectedSalary,
        preferredLocation: preferredLocation,
        resume: user.resume
      }
      const response = await axiosInstance.post(`/employee-applyJob?jobid=${id}&recruiterid=${jobDetails.jobPostedBy}`, applicationData)
      if (response.data.success) {
        navigate(`/employee-jobApplicationSuccess/${jobDetails.company}`)
      } else {
        navigate('/employee-jobApplicationFailure')
      }
    } catch (error) {
      navigate('/employee-jobApplicationFailure')
    }
  };

  const handleViewResume = () => {
    if (user.resume) {
      window.open(user.resume, '_blank');
    }
  };

  const handleEdit = (section, index) => {
    if (section === 'skills') {
      setSkillToEdit(user.Qualification.skills[index]);
      setShowSkillModal(true);
    } else if(section==='education') {
      setEducationToEdit(user.Qualification.education[index])
      setShowEducationModal(true)
    }else if(section==='experience'){
      setWorkExperienceToEdit(workExperiences[index]);
      setShowWorkExperienceModal(true);
    }
  };

  const handleDeleteResume=async()=>{
    try {
      const response = await axiosInstance.delete('/employee-deleteResume'); 
      console.log(response,"RES");
      
      if (response.data.success) {
          setUser(prevUser => ({
              ...prevUser,
              resume: '' 
          }));
          localStorage.setItem('user', JSON.stringify({ ...user, resume: '' })); 
          console.log('Resume deleted successfully');
      } else {
          console.error('Error deleting resume:', response.data.message);
      }
  } catch (error) {
      console.error('Error deleting resume:', error);
  }

  }

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

  const handleDelete = async (section, index) => {
    try {
      let skillToDelete
      if (section === 'skills') {
        skillToDelete = user.Qualification.skills[index]
        const response = await axiosInstance.delete(`/employee-delteSkills/${skillToDelete}`)
        if (response.data.success) {
          setUser(response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else if (section === 'education') {
        const educationId = user.Qualification.education[index]._id
        const response = await axiosInstance.delete(`/employee-deleteEducation/${educationId}`);
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else if (section === 'experience') {
        const experienceId = workExperiences[index]._id;
        const response = await axiosInstance.delete(`/employee-deleteWorkExperience/${experienceId}`);
        if (response.data.success) {
          setWorkExperiences(prev => prev.filter((_, i) => i !== index));
        }
      }
      console.log(`Deleted ${section} at index ${index}`);
    } catch (error) {
      console.error(`Error deleting ${section}:`, error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
    });
  };

  return (
    <>
      <Navigation />
      <Container className="review-application-container">
        <Card className="review-application-card">
          <Card.Body>
            <div className="review-application-header">
              <Button variant="link" className="back-button" onClick={() => navigate('/')}>
                Exit
              </Button>
            </div>
            <div className="job-details-container">
              <Card className="job-details-card">
                <Card.Body>
                  <h5 className="job-title">{jobDetails?.jobTitle}</h5>
                  <p className="company-name">{jobDetails?.companyName}</p>
                </Card.Body>
              </Card>
            </div>
            <hr className="divider" />
            <div className="user-details">
              <h4 className="review-application-heading">Please review user application</h4>
              <div className="user-details-container">
                <div className="user-detail">
                  <h5 className="detail-label">Candidate Name:</h5>
                  <p className="detail-value">{user.username}</p>
                </div>
                <div className="user-detail">
                  <h5 className="detail-label">Date of Birth:</h5>
                  <p className="detail-value">{user.dob}</p>
                </div>
                <div className="user-detail">
                  <h5 className="detail-label">Email address:</h5>
                  <p className="detail-value">{user.email}</p>
                </div>
                <div className="user-detail">
                  <h5 className="detail-label">Phone:</h5>
                  <p className="detail-value">{user.contact}</p>
                </div>
                <div className="user-detail">
                  <h5 className="detail-label">Education:</h5>
                  {user.Qualification.education && user.Qualification.education.length > 0 ? (
                    <ul className="detail-list">
                      {user.Qualification.education.map((edu, index) => (
                        <li key={index}>
                          {edu.degree} in {edu.specialization} - {edu.collegeName}, {edu.city}, {edu.state}, {edu.country}-
                          ({edu.levelOfEducation } , {formatDate(edu.startDate)}  -  {formatDate(edu.endDate)})
                          <div className="icon-container">
                            <FaEdit className="edit-icon" onClick={() => handleEdit('education', index)} />
                            <FaTrash className="delete-icon" onClick={() => handleDelete('education', index)} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data-message">No education available</p>
                  )}
                </div>

                <div className="user-detail">
                  <h5 className="detail-label">Skills:</h5>
                  {user.Qualification.skills && user.Qualification.skills.length > 0 ? (
                    <ul className="detail-list">
                      {user.Qualification.skills.map((skill, index) => (
                        <li key={index}>
                          {typeof skill === 'object' ? JSON.stringify(skill) : skill}
                          <div className="icon-container">
                            <FaEdit className="edit-icon" onClick={() => handleEdit('skills', index)} />
                            <FaTrash className="delete-icon" onClick={() => handleDelete('skills', index)} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data-message">No skills available</p>
                  )}
                </div>
                <div className="user-detail">
                  <h5 className="detail-label">Experience:</h5>
                  {workExperiences.length > 0 ? (
                    <ul className="detail-list">
                      {workExperiences.map((experience, index) => (
                        <li key={index}>
                          {experience.jobTitle} at {experience.companyName} ({experience.startDate} - {experience.endDate})
                          <div className="icon-container">
                            <FaEdit className="edit-icon" onClick={() => handleEdit('experience', index)} />
                            <FaTrash className="delete-icon" onClick={() => handleDelete('experience', index)} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data-message">No experience available</p>
                  )}
                </div>

                <div className="user-detail">
                  <h5 className="detail-label">Resume:</h5>
                  {user.resume ? (
                    <div className="resume-container">
                      <Button variant="link" onClick={handleViewResume}>
                          View Resume
                      </Button>
                      <FaTrash className="delete-icon" onClick={handleDeleteResume} title="Delete Resume" />
                    </div>) : (
                    <p className="detail-value">No resume available</p>
                  )}

                </div>
              </div>
              <div className="additional-details">
                <Form.Group className="mb-3">
                  <Form.Label>Current Company:</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Current Salary:</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentSalary}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value>=0) {
                        setCurrentSalary(value);
                        setCurrentSalaryError('');  
                      } else {
                        setCurrentSalaryError("Don't insert negative values");
                      }
                    }}
                  />
                  {currentSalaryError && <p style={{ color: 'red' }}>{currentSalaryError}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Expected Salary:</Form.Label>
                  <Form.Control
                    type="number"
                    value={expectedSalary}
                    onChange={(e) =>{
                      const value = e.target.value;
                      if (value >= 0) {
                        setExpectedSalary(value);
                        setExpectedSalaryError('');  
                      } else {
                        setExpectedSalaryError("Don't insert negative values");
                      }
                    }}
                  />
                    {expectedSalaryError && <p style={{ color: 'red' }}>{expectedSalaryError}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience:</Form.Label>
                  <Form.Control
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) =>{
                      const value = e.target.value;
                      if (value >= 0) {
                        setYearsOfExperience(value);
                        setYearsOfExperienceError('');  
                      } else {
                        setYearsOfExperienceError('Years of experience cannot be negative.');
                      }
                    }}
                  />
                    {yearsOfExperienceError && <p style={{ color: 'red' }}>{yearsOfExperienceError}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Location:</Form.Label>
                  <Form.Control
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="review-application-footer">
              <Button variant="primary" onClick={handleApply}>
                Submit
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <ProfileSkillModal show={showSkillModal} handleClose={()=>setShowSkillModal(false)} skillToEdit={skillToEdit}/>
        <ProfileEducationModal show={showEducationModal} handleClose={()=>setShowEducationModal(false)} educationData={educationToEdit}/>
        <WorkExperienceModal show={showWorkExperienceModal} handleClose={()=>setShowWorkExperienceModal(false)} onSuccess={refreshWorkExperiences} initialData={workExperienceToEdit}/>
    </>
  );
}

export default ReviewApplication;