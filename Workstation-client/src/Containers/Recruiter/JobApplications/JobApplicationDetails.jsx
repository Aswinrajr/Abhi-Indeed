import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Table, Button,Form } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';
import { FaArrowLeft } from 'react-icons/fa';
import './JobApplicationDetails.css';
import ReNavigation from '../../../Components/ReNavigation.jsx';

const JobApplicationDetails = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [status,setStatus]=useState('Applied')
    const navigate=useNavigate()

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axiosInstance.get(`/recruiter-getApplicationDetails/${id}`);
                console.log(response.data,"DATA");
                setApplication(response.data.application);
                setStatus(response.data.application.status || 'Applied')
            } catch (error) {
                console.error('Error fetching application details:', error);
            }
        };

        fetchApplicationDetails();
    }, [id]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const displayValue = (value) => {
        return value ? value : 'Nil';
    };


    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        try {
            await axiosInstance.put(`/recruiter-updateApplicationStatus/${id}`, {
                status: newStatus
            });
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!application) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Container className="mt-5">
            <Card>
                <Card.Header className="card-header-custom">
                    <Button variant="link" className="back-button" onClick={handleBackClick}>
                        <FaArrowLeft />
                    </Button>
                    <span className="header-title">Application Details</span>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive className="application-details-table">
                    <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{displayValue(application.name)}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{displayValue(application.email)}</td>
                                </tr>
                                <tr>
                                    <th>Contact</th>
                                    <td>{displayValue(application.contact)}</td>
                                </tr>
                                <tr>
                                    <th>Date of Birth</th>
                                    <td>{application.dob ? new Date(application.dob).toLocaleDateString() : 'Nil'}</td>
                                </tr>
                                <tr>
                                    <th>Total Experience</th>
                                    <td>{displayValue(application.totalExperience)} years</td>
                                </tr>
                                <tr>
                                    <th>Current Company</th>
                                    <td>{displayValue(application.currentCompany)}</td>
                                </tr>
                                <tr>
                                    <th>Current Salary</th>
                                    <td>{displayValue(application.currentSalary)}</td>
                                </tr>
                                <tr>
                                    <th>Expected Salary</th>
                                    <td>{displayValue(application.expectedSalary)}</td>
                                </tr>
                                <tr>
                                    <th>Preferred Location</th>
                                    <td>{displayValue(application.preferredLocation)}</td>
                                </tr>
                                <tr>
                                    <th>Resume Link</th>
                                    <td>
                                        {application.resume ? (
                                            <a href={application.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                                        ) : 'Nil'}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Job Name</th>
                                    <td>{displayValue(application.jobId ? application.jobId.jobTitle : null )}</td>
                                </tr>
                                <tr>
                                    <th>Job Id</th>
                                    <td>{displayValue(application.jobId ? application.jobId._id : null)}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <Form.Select value={status} onChange={handleStatusChange}>
                                        {status === 'Applied' && <option value="Applied">Applied</option>}            
                                        <option value="Interviewing">Interviewing</option>
                                        <option value="Hired">Hired</option>
                                        <option value="Rejected">Rejected</option>
                                    </Form.Select>
                                </tr>
                            </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
        </>
    );
};

export default JobApplicationDetails;
