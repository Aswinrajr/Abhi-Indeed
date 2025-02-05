import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js';
import './CompanyRecruiters.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa';
import CompanySideNavigation from '../../../Components/CompanySideNavigation.jsx';
import CompanyNavigation from '../../../Components/CompanyNavigation.jsx';
function CompanyRecruiters() {
    const navigate = useNavigate();
    const [recruiters, setRecruiters] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    useEffect(() => {
        const fetchRecruiters = async () => {
            try {
                const response = await axiosInstance.get(`/company-recruiters?page=${page}&limit=${limit}`);
                if (response.data.success) {
                    setRecruiters(response.data.recruiters);
                    setTotal(response.data.total);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchRecruiters();
    }, [page]);

    

    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };

    const handleDeleteRecruiter = async (id) => {
        try {
            const response = await axiosInstance.delete(`/company-recruiters/${id}`);            
            if (response.data.success) {
                setRecruiters(recruiters.filter(r => r._id !== id));  
               }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Delete Recruiter?',
            text: 'Are you sure you want to delete this recruiter?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteRecruiter(id);
                Swal.fire('Deleted!', 'Recruiter has been deleted.', 'success');
            }
        });
    };
    return (
        <>
            <CompanyNavigation />
            <CompanySideNavigation />
            <div className="company-admin-panel">
                <div className="company-content-wrapper">
                    <div className="company-management-header">
                        <h1>Recruiter Management</h1>
                    </div>
                    <div className="company-management-section">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sl. No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Date of register</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiters && recruiters.length > 0 ? (
                                    recruiters.map((recruiter, index) => (
                                        <tr key={recruiter._id}>
                                            <td>{index + 1}</td>
                                            <td>{recruiter.recruitername}</td>
                                            <td>{recruiter.email}</td>
                                            <td>{new Date(recruiter.createdAt).toLocaleDateString('en-GB')}</td>                                            <td>
                                                <Button variant="danger" onClick={() => confirmDelete(recruiter._id)}>
                                                    <FaTrash /> Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No recruiters found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </Table>
                        <div className="pagination-wrapper">
                            <ReactPaginate
                                previousLabel={<FaArrowLeft />}
                                nextLabel={<FaArrowRight />}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(total / limit)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyRecruiters
