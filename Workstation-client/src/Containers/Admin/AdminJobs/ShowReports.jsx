import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor.js';
import './ShowReports.css'; // Import the refined CSS
import AdminNavigation from '../../../Components/AdminNavigation';

function ShowReports() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/admin-jobdetails/${id}`);
                if (response.data.success) {
                    setJob(response.data.job);
                } else {
                    setError('Failed to load job details');
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('An error occurred while fetching job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="admin-show-reports-spinner">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div className="admin-show-reports-error">{error}</div>;
    }

    const jobReports = job?.jobReports || [];

    return (
        <>
        <AdminNavigation/>
        <Container className="admin-show-reports-container">
            <h2 className="admin-show-reports-title">Job Report Details</h2>
            {jobReports.length > 0 ? (
                jobReports.map((report, index) => (
                    <Card key={index} className="admin-show-reports-card mb-4">
                        <Card.Header className="admin-show-reports-card-header">
                            Report {index + 1}
                        </Card.Header>
                        <Card.Body className="admin-show-reports-card-body">
                            <div className="admin-show-reports-reporter">
                                <strong>Reported By: </strong>{report.reportedBy?.username || 'Unknown'}
                            </div>
                            <div className="admin-show-reports-reason">
                                <strong>Reason: </strong>{report?.reason || 'Not provided'}
                            </div>
                            <div className="admin-show-reports-description">
                                <strong>Description: </strong>{report?.description || 'N/A'}
                            </div>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="admin-show-reports-no-reports">No reports found for this job.</p>
            )}
            <Button
                variant="outline-primary"
                className="admin-show-reports-back-button"
                onClick={() => navigate('/admin-jobs')}
            >
                Back to Jobs
            </Button>
        </Container>
        </>
    );
}

export default ShowReports;
