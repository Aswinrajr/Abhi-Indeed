import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor.js';
import './Companies.css';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
function Companies() {

    const { Authenticated, loading } = useContext(AdminAuth);
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axiosInstance.get(`/admin-companies?page=${page}&limit=${limit}`);
                if (response.data.success) {
                    setCompanies(response.data.companies);
                    setTotal(response.data.total);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, [page]);

    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };

    const toggleCompanyStatus = async (id, status) => {
        try {
            const response = await axiosInstance.put(`/admin-companies/${id}/block`);
            if (response.data.success) {
                setCompanies(companies.map(company =>
                    company._id === id ? { ...company, block: response.data.block } : company
                ));
            }
        } catch (error) {
            console.error('Error updating company status:', error);
        }
    };
    const handleToggleCompanyStatus = (id, status) => {
        Swal.fire({
            title: status ? 'Activate Company?' : 'Deactivate Company?',
            text: `Are you sure you want to ${status ? 'Activate' : 'Deactivate'} this company?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${status ? 'Activate' : 'Deactivate'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                toggleCompanyStatus(id, status);
                Swal.fire(
                    'Success!',
                    `Company has been ${status ? 'Activated' : 'Deactivated'}.`,
                    'success'
                );
            }
        });
    };

    const viewCompany = (id) => {
        navigate(`/admin-companydetails/${id}`);
    };


  return (
    <>
    <AdminSideNavigation />
    <AdminNavigation />
    <div className="admin-company-panel">
        <div className="admin-company-content-wrapper">
            <div className="admin-company-header">
                <h1>Company Management</h1>
            </div>
            <div className="admin-company-section">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Company Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company, index) => (
                            <tr key={company._id}>
                                <td>{index + 1}</td>
                                <td>{company.companyName}</td>
                                <td>{company.email}</td>
                                <td>{company.typeOfCompany}</td>
                                <td>
                                    <Button
                                        variant={company.block ? 'success' : 'danger'}
                                        onClick={() => handleToggleCompanyStatus(company._id, company.block)}
                                    >
                                        {company.block ? 'Activate' : 'Deactivate'}
                                    </Button>
                                    <Button
                                        variant="info"
                                        onClick={() => viewCompany(company._id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="admin-company-pagination-wrapper">
                    <ReactPaginate
                        previousLabel={<FaArrowLeft />}
                        nextLabel={<FaArrowRight />}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(total / limit)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'admin-company-pagination'}
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

export default Companies
