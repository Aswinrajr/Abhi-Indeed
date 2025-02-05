import React, { useState, useContext, useEffect } from 'react';
import { CompanyAuth } from '../../../Context/CompanyContext.jsx';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { FaFileAlt, FaUpload, FaTrash, FaCheck } from 'react-icons/fa';
import './CompanyDocuments.css';
import CompanyNavigation from '../../../Components/CompanyNavigation.jsx';
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js';

function CompanyDocuments() {
    const { company, setCompany } = useContext(CompanyAuth);
    const [documents, setDocuments] = useState({
        registrationCertificate: '',
        license: '',
        taxCertificate: ''
    });

    useEffect(() => {
        setDocuments({
            registrationCertificate: company.registrationCertificate || '',
            license: company.license || '',
            taxCertificate: company.taxCertificate || ''
        });
    }, [company]);

    const uploadDocument = async (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('docType', docType);

                const response = await axiosInstance.post('/company-uploadDocuments', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const { fileUrl } = response.data;
                setDocuments(prevState => ({ ...prevState, [docType]: fileUrl }));
                setCompany(prevState => ({ ...prevState, [docType]: fileUrl }));
                setTimeout(() => {
                    window.location.reload(); 
                }, 100);
            } catch (error) {
                console.error('File upload error:', error);
            }
        }
    };

    const handleDeleteDocument = async (docType) => {
        try {
            await axiosInstance.delete(`/company-deleteDocument?docType=${docType}`);
            setDocuments(prevState => ({ ...prevState, [docType]: '' }));
            setCompany(prevState => ({ ...prevState, [docType]: '' }));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };
    

    return (
        <>
            <CompanyNavigation />
            <Container className="company-documents-container">
                <h2 className="text-center mb-4">Company Documents</h2>
                <Row>
                    {['registrationCertificate', 'license', 'taxCertificate'].map((docType, index) => (
                        <Col lg={4} md={6} className="mb-4" key={index}>
                            <Card className="document-card">
                                <Card.Body>
                                    <div className="document-header">
                                        <Card.Title>{docType.replace(/([A-Z])/g, ' $1').trim()}</Card.Title>
                                        {documents[docType] && <FaCheck className="text-success" />}
                                    </div>
                                    {documents[docType] ? (
                                        <div className="document-actions">
                                            <a href={documents[docType]} target="_blank" rel="noopener noreferrer" className="view-document">
                                                <FaFileAlt /> View Document
                                            </a>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDocument(docType)}>
                                                <FaTrash /> Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="upload-section">
                                            <Form.Control
                                                type="file"
                                                id={`${docType}File`}
                                                onChange={(e) => uploadDocument(e, docType)}
                                                accept=".pdf,.doc,.docx"
                                                hidden
                                            />
                                            <label htmlFor={`${docType}File`} className="upload-button">
                                                <FaUpload /> Upload {docType.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default CompanyDocuments;
