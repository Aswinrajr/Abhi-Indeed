import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaChevronRight, FaUpload, FaBirthdayCake,FaTimes  } from 'react-icons/fa';
import Navigation from '../../../Components/Navigation';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './Profile.css';

function Profile() {
    const { user, loading, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [remainingWords, setRemainingWords] = useState(1000);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (user?.block) {
            navigate("/employee-login");
        }
    }, [user?.block]);

    useEffect(() => {
        if (user.description) {
            setDescription(user?.description);
        }
    }, [user?.description]);    

    useEffect(() => {
        setRemainingWords(1000 - description.split(/\s+/).filter(Boolean).length);
    }, [description]);

    const handleDescriptionChange = (e) => {
        const words = e.target.value.split(/\s+/).filter(Boolean);
        if (words.length <= 1000) {
            setDescription(e.target.value);
        }
    };

    useEffect(() => {
        if (user._id) {
            const fetchDescription = async () => {
                try {
                    const response = await axiosInstance.get(`/employee-getDescription/${user._id}`);
                    if (response.data.success) {
                        setDescription(response.data.result);
                    }
                } catch (error) {
                    console.error('Error fetching description:', error);
                }
            };

            fetchDescription();
        }
    }, [user._id]);

    useEffect(() => {
        const fetchResumeUrl = async () => {
            if (user._id) {
                try {
                    const response = await axiosInstance.get('/employee-getResumeUrl');
                    if (response.data.success) {
                        setResumeUrl(response.data.resumeUrl);  
                    }
                } catch (error) {
                    console.error('Error fetching resume URL:', error);
                }
            }
        };

        fetchResumeUrl();
    }, [user._id]);

    const handleDescriptionSubmit = async () => {
        try {
            const response = await axiosInstance.put('/employee-addDescription', {
                userId: user._id,
                description
            });
            if (response.data.success) {
                setDescription(response.data.description.description);
            }
        } catch (error) {
            console.error('Error updating description:', error);
            alert('Failed to update description');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
        } else {
            alert('Please select a PDF file.');
        }
    };

    const handleUpload = async () => {
        if (resumeFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('resume', resumeFile);

            try {
                const response = await axiosInstance.post('/employee-addResume', formData);
                if (response.data.success) {
                    setResumeUrl(response.data.resumeUrl);  
                    setResumeFile(null);
                }
            } catch (error) {
                console.error('Error uploading resume:', error);
                alert('Failed to upload resume');
            } finally {
                setIsUploading(false);
            }
        }
    };

    if (loading) {
        return <div>....Loading</div>;
    }
    if (!isAuthenticated) {
        navigate("/employee-login");
        return null;
    }

    const handleDeleteResume = async () => {
            try {
                const response = await axiosInstance.delete('/employee-deleteResume');
                if (response.data.success) {
                    setResumeUrl('');
                }
            } catch (error) {
                console.error('Error deleting resume:', error);
        }
    };

    const userAddress = user.useraddress && user.useraddress.length > 0 ? user.useraddress[0] : {};
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = String(date.getFullYear()).slice(-2); 
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <Navigation />
            <Container className="profile-container mt-2 d-flex justify-content-center">
                <Card className="p-4 shadow-sm" style={{ width: '100%', maxWidth: '600px' }}>
                    <i
                        className="fas fa-arrow-left fa-lg mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    ></i>
                    <Row className="align-items-center mb-4">
                        <Col xs={10}>
                            <h1 className="fw-bold">{user.username}</h1>
                        </Col>
                        <Col xs={2} className="text-end">
                            <div className="profile-initials-circle bg-dark text-white d-flex align-items-center justify-content-center">
                                {user.username[0]}
                            </div>
                        </Col>
                    </Row>
                    <div className='profile-details p-2'>
                        <div className="profile-detail-row">
                            <div className="profile-detail-icon-text">
                                <FaEnvelope />
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <div className="profile-detail-row">
                            <div className="profile-detail-icon-text">
                                <FaPhone />
                                <p>{user.contact || "N/A"}</p>
                            </div>
                            <Link to="/employee-profile/editcontact">
                                <FaChevronRight />
                            </Link>
                        </div>
                        <div className="profile-detail-row">
                            <div className="profile-detail-icon-text">
                                < FaBirthdayCake />
                                <p>{user.dob || "N/A"}</p>
                            </div>
                        </div>
                        <div className="profile-detail-row">
                            <div className="profile-detail-icon-text">
                                <FaMapMarkerAlt />
                                <p>{userAddress.city || 'N/A'}, {userAddress.state || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <h5 className="profile-heading fw-bold">Resume</h5>
                    <Row className="align-items-center mb-3">
                        <Col xs={10}>
                            <Card className="p-2">
                                <Row>
                                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                                        <FaFileAlt style={{ fontSize: '2rem' }} />
                                    </Col>
                                    <Col xs={10}>
                                        <p className="mb-0 fw-bold">Resume</p>
                                        <small>Updated on {formatDate(user.updatedAt)}</small>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col xs={12}>
                                        {resumeUrl ? (
                                            <>
                                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                                <Button variant="link">View Resume</Button>
                                            </a>
                                             <FaTimes
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                    onClick={handleDeleteResume}
                                                    title="Delete Resume"
                                                />
                                            </>
                                        ) : (
                                            <div>
                                                <input 
                                                    type="file" 
                                                    accept=".pdf" 
                                                    onChange={handleFileChange} 
                                                />
                                                <Button 
                                                    variant="primary" 
                                                    onClick={handleUpload} 
                                                    disabled={isUploading}
                                                    style={{width:'110px'}}
                                                >
                                                    {isUploading ? 'Uploading...' : 'Attach Resume'}
                                                </Button>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <h5 className="profile-heading fw-bold">Improve your job matches</h5>
                    <Row className="align-items-center mt-3 mb-3">
                        <Col xs={10}>
                            <p className="mb-0">Qualifications</p>
                        </Col>
                        <Col xs={2} className="text-end">
                            <Link to="/employee-profile/qualifications">
                                <FaChevronRight />
                            </Link>
                        </Col>
                    </Row>
                    <Row className="align-items-center  mt-3 mb-3">
                        <Col xs={10}>
                            <p className="mb-0">Work Experience</p>
                        </Col>
                        <Col xs={2} className="text-end">
                            <Link to="/employee-profile/workexperience">
                                <FaChevronRight />
                            </Link>
                        </Col>
                    </Row>
                    <Form.Group className="mt-3">
                        <Form.Label className="profile-heading">Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Add your description here..."
                        />
                        <Form.Text className="text-muted">
                            {remainingWords} words remaining
                        </Form.Text>
                        <Button 
                            variant="primary" 
                            className="mt-2" style={{width:'200px'}}
                            onClick={handleDescriptionSubmit}
                        >
                            Update Description
                        </Button>
                    </Form.Group>
                </Card>
            </Container>
        </div>
    );
}

export default Profile;
