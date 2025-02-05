import React, { useContext, useEffect, useState } from 'react';
import { Table, Button,Form,InputGroup} from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor';
import './Recruiters.css';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight,FaSearch } from 'react-icons/fa';



function Recruiters() {
    const {Authenticated,loading}=useContext(AdminAuth)
    const navigate=useNavigate()
    const [recruiters, setRecruiters] = useState([]);
    const [page,setPage]=useState(1)
    const [total,setTotal]=useState(0)
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const limit=5


    useEffect(() => {
        const fetchRecruiters = async () => {
            try {
                const response = await axiosInstance.get(`/admin-recruiters?page=${page}&limit=${limit}&companyName=${search}`);
                if (response.data.success) {
                    setRecruiters(response.data.recruiters);
                    setTotal(response.data.total)
                    setNoResults(response.data.recruiters.length === 0);
                }
            } catch (error) {
                console.error('Error fetching recruiters:', error);
            }
        };
        fetchRecruiters();
    }, [page,search]);

    
    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };

    const handleSearch = () => {
        setSearch(searchQuery);
        setPage(1);
    };

    const handleClear=()=>{
        setSearchQuery('');
        setSearch(''); 
        setPage(1);
        setNoResults(false); 
    }

    const toggleBlockStatus = async (id,blockStatus) => {
        try {
            const response = await axiosInstance.put(`/admin-recruiters/${id}/block`);
            if (response.data.success) {
                setRecruiters(recruiters.map(c =>
                    c._id === id ? { ...c, block: response.data.block } : c
                ));
            }
        } catch (error) {
            console.error('Error updating block status:', error);
        }
    };
    const handleToggleBlockStatus = (id, blockStatus) => {
        Swal.fire({
            title: blockStatus ? 'Unblock Recruiter?' : 'Block Recruiter?',
            text: `Are you sure you want to ${blockStatus ? 'unblock' : 'block'} this recruiter?`,
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
                    `Recruiter has been ${blockStatus ? 'unblocked' : 'blocked'}.`,
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
                        <h1>Recruiter Management</h1>
                    </div>
                    <InputGroup className="recruiter-input-group mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search recruiter by company"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="outline-primary" onClick={handleSearch}>
                            <FaSearch /> Search
                        </Button>
                        <Button variant="outline-secondary" onClick={handleClear}>
                             Clear
                        </Button>
                    </InputGroup>
                    <div className="user-management-section">
                    {noResults ? (
                            <p>No recruiters found matching your search criteria.</p>
                        ) : (
                         <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sl. No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiters.map((recruiter, index) => (
                                    <tr key={recruiter._id}>
                                        <td>{index + 1}</td>
                                        <td>{recruiter.recruitername}</td>
                                        <td>{recruiter.email}</td>
                                        <td>{recruiter.companyName}</td>
                                        <td>
                                            <Button
                                                variant={recruiter.block ? 'success' : 'danger'}
                                                onClick={() => handleToggleBlockStatus(recruiter._id,recruiter.block)}
                                            >
                                                {recruiter.block ? 'Unblock' : 'Block'}
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
                        </>
                        )}
                    </div>
                </div>
            </div>
        </>
  )
}

export default Recruiters
