import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import Swal from 'sweetalert2';
import './AddPlans.css';

function AddPlans() {
    const { Authenticated, loading } = useContext(AdminAuth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        planName: '',
        planDescription: '',
        planPrice: '',
        planType: 'duration',
        planDuration: '' 
    });

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
            const response = await axiosInstance.post('/admin-addPlans', formData);
            console.log(response);
            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/admin-plans');
                setFormData({
                    planName: '',
                    planDescription: '',
                    planPrice: '',
                    planType: 'duration',
                    planDuration: ''
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setFormData({
                    planName: '',
                    planDescription: '',
                    planPrice: '',
                    planType: 'duration',
                    planDuration: ''
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data.message || 'Failed to add plan. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setFormData({
                    planName: '',
                    planDescription: '',
                    planPrice: '',
                    planType: 'duration',
                    planDuration: ''
                });
            }
        }
    };

    return (
        <>
            <AdminSideNavigation />
            <AdminNavigation />

            <div className="main-content add-plans-main-content">
                <Container fluid className="add-plans-container">
                    <Row className="justify-content-center align-items-center h-100">
                        <Col md={6}>
                            <h2 className="text-center mb-4">Add New Plan</h2>
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
                                <Button variant="primary" type="submit">
                                    Add Plan
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default AddPlans;
