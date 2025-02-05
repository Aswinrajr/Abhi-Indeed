import React, { useContext, useEffect, useState } from 'react';
import { Table, Button,Form } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor';
import './Categories.css';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight, FaEdit } from 'react-icons/fa';

function Categories() {
    const { Authenticated, loading } = useContext(AdminAuth);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(`/admin-categories?page=${page}&limit=${limit}`);
                if (response.data.success) {
                    setCategories(response.data.categories);
                    setTotal(response.data.total);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [page]);

    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };

    const editCategory = (id) => {
        navigate(`/admin-editcategory/${id}`);
    };

    const addCategory = () => {
        navigate('/admin-categories/add');
    };

    return (
        <>
            <AdminSideNavigation />
            <AdminNavigation />
            <div className="category-management-panel">
                <div className="category-management-content-wrapper">
                    <div className="category-management-header">
                        <h1>Category Management</h1>
                    </div>
                    <Button 
                        variant="primary" 
                        onClick={addCategory} 
                        className="category-management-add-category-button"
                    >
                        Add Category
                    </Button>
                    <div className="category-management-section">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sl. No</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td>{index + 1}</td>
                                        <td>{category.categoryName}</td>
                                        <td>{category.categoryDescription}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                onClick={() => editCategory(category._id)}
                                            >
                                                <FaEdit /> Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="category-management-pagination-wrapper">
                            <ReactPaginate
                                previousLabel={<FaArrowLeft />}
                                nextLabel={<FaArrowRight />}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(total / limit)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'category-management-pagination'}
                                subContainerClassName={'pages category-management-pagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Categories;
