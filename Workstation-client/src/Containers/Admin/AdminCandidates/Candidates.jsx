import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor';
import './Candidates.css';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Candidates() {
    const {Authenticated,loading}=useContext(AdminAuth)
    const navigate=useNavigate()
    const [candidates, setCandidates] = useState([]);
    const [page,setPage]=useState(1)
    const [total,setTotal]=useState(0)
    const limit=5


    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axiosInstance.get(`/admin-candidates?page=${page}&limit=${limit}`);
                if (response.data.success) {
                    setCandidates(response.data.candidates);
                    setTotal(response.data.total)
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };
        fetchCandidates();
    }, [page]);


    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };

    const toggleBlockStatus = async (id,blockStatus) => {
        try {
            const response = await axiosInstance.put(`/admin-candidates/${id}/block`);
            if (response.data.success) {
                setCandidates(candidates.map(c =>
                    c._id === id ? { ...c, block: response.data.block } : c
                ));
            }
        } catch (error) {
            console.error('Error updating block status:', error);
        }
    };
    const handleToggleBlockStatus = (id, blockStatus) => {
        Swal.fire({
            title: blockStatus ? 'Unblock Candidate?' : 'Block Candidate?',
            text: `Are you sure you want to ${blockStatus ? 'unblock' : 'block'} this candidate?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${blockStatus ? 'unblock' : 'block'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                toggleBlockStatus(id, blockStatus);
                Swal.fire(
                    'Success!',
                    `Candidate has been ${blockStatus ? 'unblocked' : 'blocked'}.`,
                    'success'
                );
            }
        });
    };

    return (
        <>
            <AdminSideNavigation />
            <AdminNavigation />
            <div className="admin-panel">
                <div className="content-wrapper">
                    <div className="user-management-header">
                        <h1>Candidate Management</h1>
                    </div>
                    <div className="user-management-section">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sl. No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={candidate._id}>
                                        <td>{index + 1}</td>
                                        <td>{candidate.username}</td>
                                        <td>{candidate.email}</td>
                                        <td>
                                            <Button
                                                variant={candidate.block ? 'success' : 'danger'}
                                                onClick={() => handleToggleBlockStatus(candidate._id,candidate.block)}
                                            >
                                                {candidate.block ? 'Unblock' : 'Block'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
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
    );
}

export default Candidates;
