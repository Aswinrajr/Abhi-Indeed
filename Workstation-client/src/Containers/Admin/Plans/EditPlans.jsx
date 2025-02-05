import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import Swal from 'sweetalert2';
import './EditPlans.css';

function EditPlans() {
    const { Authenticated, loading } = useContext(AdminAuth);
    const navigate = useNavigate();
    const {id} = useParams(); 

    const [formData, setFormData] = useState({
        planName: '',
        planDescription: '',
        planPrice: '',
        planType: 'duration',
        planDuration: ''
    });

    useEffect(() => {
            const fetchPlanDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/admin-getPlans/${id}`);
                    if (response.data.success) {
                        const { planName, description, amount, planType, planDuration } = response.data.plan;
                        setFormData({
                            planName:planName,
                            planDescription:description,
                            planPrice:amount,
                            planType,
                            planDuration: planType === 'duration' ? planDuration : ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching plan details:', error);
                }
            };
            fetchPlanDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`/admin-updatePlan/${id}`,{formData});
            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/admin-plans');
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update plan. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <>
            <AdminSideNavigation />
            <AdminNavigation />

            <div className="main-content edit-plans-main-content">
                <Container fluid className="edit-plans-container">
                    <Row className="justify-content-center align-items-center h-100">
                        <Col md={6}>
                            <h2 className="text-center mb-4">Edit Plan</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="planName">
                                    <Form.Label>Plan Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter plan name"
                                        name="planName"
                                        value={formData.planName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="planDescription">
                                    <Form.Label>Plan Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter plan description"
                                        name="planDescription"
                                        value={formData.planDescription}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="planPrice">
                                    <Form.Label>Plan Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter plan price"
                                        name="planPrice"
                                        value={formData.planPrice}
                                        onChange={handleChange}
                                        min={"0"}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="planType">
                                    <Form.Label>Plan Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="planType"
                                        value={formData.planType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="duration">Duration-based</option>
                                        <option value="lifetime">Lifetime</option>
                                    </Form.Control>
                                </Form.Group>
                                {formData.planType === 'duration' && (
                                    <Form.Group className="mb-3" controlId="planDuration">
                                        <Form.Label>Plan Duration (in Months)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter plan duration"
                                            name="planDuration"
                                            value={formData.planDuration}
                                            onChange={handleChange}
                                            min={"0"}
                                            required={formData.planType === 'duration'}
                                        />
                                    </Form.Group>
                                )}
                                <Button variant="primary" type="submit" style={{width:'200px'}}>
                                    Update Plan
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default EditPlans;
