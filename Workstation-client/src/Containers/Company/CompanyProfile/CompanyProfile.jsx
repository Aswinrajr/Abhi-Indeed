import React, { useContext, useEffect, useState } from 'react';
import { CompanyAuth } from '../../../Context/CompanyContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaChevronRight, FaUpload, FaBirthdayCake, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import Navigation from '../../../Components/Navigation';
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js';
import './CompanyProfile.css';
import CompanyNavigation from '../../../Components/CompanyNavigation.jsx';

function CompanyProfile() {
    const { company, loading, Authenticated } = useContext(CompanyAuth);
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [remainingWords, setRemainingWords] = useState(1000);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState(company?.resumeUrl || '');
    const [isUploading, setIsUploading] = useState(false);
    const [logoUrl,setLogoUrl]=useState(company?.logo||'')

    useEffect(() => {
        if ( company?.block) {
            navigate("/company-login");
        }
    }, [ company?.block]);

    useEffect(() => {
        if (company.description) {
            setDescription(company?.description);
        }
    }, [company?.description]);

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
        if (company._id) {
            const fetchDescription = async () => {
                try {
                    const response = await axiosInstance.get(`/company-getDescription/${company._id}`);
                    if (response.data.success) {
                        setDescription(response.data.result);
                    }
                } catch (error) {
                    console.error('Error fetching description:', error);
                }
            };

            fetchDescription();
        }
    }, [company._id]);

    const handleDescriptionSubmit = async () => {
        try {
            const response = await axiosInstance.put('/company-addDescription', {
                companyId: company._id,
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
    const handleLogoUpload=async(e)=>{
        try {
            const file=e.target.files[0]
            if(file){
                const formData=new FormData()
                formData.append('logo', file);
                setIsUploading(true)
                const response=await axiosInstance.put('/company-uploadLogo',formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                if(response.data.success){
                    setLogoUrl(response.data.logoUrl)
                    setIsUploading(false)
                }
            }
        } catch (error) {
            console.error('Error uploading logo:', error); 
            setIsUploading(false) 
        }
    }

    if (loading) {
        return <div>....Loading</div>;
    }
    if (!Authenticated) {
        navigate("/company-login");
        return null;
    }

    const companyAddress = company.companyaddress && company.companyaddress.length > 0 ? company.companyaddress[0] : {};
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <CompanyNavigation />
            <Container className="company-profile-container mt-2 d-flex justify-content-center">
                <Card className="p-4 shadow-sm" style={{ width: '100%', maxWidth: '600px' }}>
                    <i
                        className="fas fa-arrow-left fa-lg mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/company-home')}
                    ></i>
                    <Row className="align-items-center mb-4">
                        <Col xs={9}>
                            <h1 className="fw-bold">{company.companyName}</h1>
                        </Col>
                        <Col xs={3} className="text-end">
                            <div className="company-logo-container">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt="Company Logo"
                                        className="company-logo"
                                    />
                                ) : (
                                    <div
                                        className="company-logo-placeholder"
                                        onClick={() => document.getElementById('logoUpload').click()}
                                    >
                                        <FaUpload style={{ fontSize: '24px', color: '#666' }} />
                                    </div>
                                )}
                                {logoUrl && (
                                    <div
                                        className="logo-change-icon"
                                        onClick={() => document.getElementById('logoUpload').click()}
                                    >
                                        +
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="logoUpload"
                                style={{ display: 'none' }}
                                onChange={handleLogoUpload}
                            />
                        </Col>

                    </Row>
                    <div className='company-profile-details p-2'>
                        <div className="company-profile-detail-row">
                            <div className="company-profile-detail-icon-text">
                                <FaEnvelope />
                                <p>{company.email || "N/A"}</p>
                            </div>
                        </div>
                        <div className="company-profile-detail-row">
                            <div className="company-profile-detail-icon-text">
                                <FaPhone />
                                <p>{company.contactNumber || "N/A"}</p>
                            </div>
                            <Link to="/company-profile/editForm">
                                <FaChevronRight />
                            </Link>
                        </div>
                        <div className="company-profile-detail-row">
                            <div className="company-profile-detail-icon-text">
                                <FaBuilding />
                                <p>{company.typeOfCompany || "N/A"}</p>
                            </div>
                        </div>
                        <div className="company-profile-detail-row">
                            <div className="company-profile-detail-icon-text">
                                <FaMapMarkerAlt />
                                <p>{companyAddress.city || 'N/A'}, {companyAddress.state || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <Row className="align-items-center mt-3 mb-3">
                        <Col xs={10}>
                            <p className="mb-0">About Us</p>
                        </Col>
                        <Col xs={2} className="text-end">
                            <Link to="/company-about">
                                <FaChevronRight />
                            </Link>
                        </Col>
                    </Row>
                    <Row className="align-items-center mt-3 mb-3">
                        <Col xs={10}>
                            <p className="mb-0">Documents</p>
                        </Col>
                        <Col xs={2} className="text-end">
                            <Link to="/company-documents">
                                <FaChevronRight />
                            </Link>
                        </Col>
                    </Row>
                    {/* <Form.Group className="mt-3">
                        <Form.Label className="company-profile-heading">Company Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Add your company description here..."
                        />
                        <Form.Text className="text-muted">
                            {remainingWords} words remaining
                        </Form.Text>
                        <Button
                            variant="primary"
                            className="mt-2"
                            onClick={handleDescriptionSubmit}
                        >
                            Save Description
                        </Button>
                    </Form.Group> */}
                </Card>
            </Container>
        </div>
    );
}

export default CompanyProfile;
