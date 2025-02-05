import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Container, Card,Alert } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';
import { RecruiterAuth } from '../../../Context/RecruiterContext';
import ReNavigation from '../../../Components/ReNavigation.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import './JobApplications.css';
import { useNavigate, useParams } from 'react-router-dom';

const JobApplications = () => {
    const {id}=useParams()
    const [applications, setApplications] = useState([]);
    const { recruiter } = useContext(RecruiterAuth);
    const navigate=useNavigate()

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get(`/recruiter-getApplication/${id}`);                
                setApplications(response.data.application);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, [recruiter._id]);

    const handleBackClick = () => {
        navigate(`/recruiter-viewJob/${id}`)
    };

    const viewDetails=(id)=>{
        navigate(`/recruiter-viewApplicationDetails/${id}`)
    }



    return (
        <>
            <ReNavigation />
            <Container className="mt-5">
                <Card>
                    <Card.Header className="card-header-custom">
                        <Button variant="link" className="back-button" onClick={handleBackClick}>
                            <FaArrowLeft />
                        </Button>
                        <span className="header-title">Job Applications</span>
                    </Card.Header>
                    <Card.Body>
                    {applications.length === 0 ? (
                            <Alert variant="warning" className="text-center">
                                No applications available for this job.
                            </Alert>
                        ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover className="job-applications-table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Applicant Name</th>
                                        <th>Email</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((application) => (
                                        <tr key={application._id}>
                                            <td>{application.jobId.jobTitle}</td>
                                            <td>{application.name}</td>
                                            <td>{application.email}</td>
                                            <td>{application.contact}</td>
                                            <td>{application.status}</td>
                                            <td>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>viewDetails(application._id)}
                                                >
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                         )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default JobApplications;
