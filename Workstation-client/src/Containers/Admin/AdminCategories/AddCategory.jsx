import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor.js';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import Swal from 'sweetalert2';

function AddCategory() {
    const { Authenticated, loading } = useContext(AdminAuth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        categoryName: '',
        description: ''
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
            const response = await axiosInstance.post('admin-addCategory', { formData });    
            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/admin-categories')
                setFormData({
                    categoryName: '',
                    description: ''
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setFormData({
                    categoryName: '',
                    description: ''
                });
            }
        } catch (error) {
            if(error.response && error.response.data){
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data.message || 'Failed to add category. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setFormData({
                    categoryName: '',
                    description: ''
                });
            }
        }
    };
    return (
        <>
            <AdminSideNavigation />
            <AdminNavigation />

            <div className="main-content">
                <Container fluid className="add-category-container">
                    <Row className="justify-content-center align-items-center h-100">
                        <Col md={6}>
                            <h2 className="text-center mb-4">Add New Category</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="categoryName">
                                    <Form.Label>Category Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter category name"
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" style={{width:'200px'}}>
                                    Add Category
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default AddCategory;
