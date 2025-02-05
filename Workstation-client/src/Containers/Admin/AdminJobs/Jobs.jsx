import React, { useContext, useEffect, useState } from 'react';
import { Table, Button,Form,InputGroup } from 'react-bootstrap';
import axiosInstance from '../../../Services/Interceptor/adminInterceptor.js';
import './Jobs.css';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import { AdminAuth } from '../../../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight,FaSearch } from 'react-icons/fa';

function Jobs() {
    const { Authenticated, loading } = useContext(AdminAuth);
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(''); 
    const [categories, setCategories] = useState([]); 
    const [noResults, setNoResults] = useState(false);
    const limit = 5;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/admin-categories');                 
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get(`/admin-jobs?page=${page}&limit=${limit}&search=${search}&category=${category}`);
                if (response.data.success) {
                    setJobs(response.data.jobs);
                    setTotal(response.data.total);
                    setNoResults(response.data.jobs.length === 0);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, [page,search,category]);

    const handlePageClick = (data) => {
        setPage(data.selected + 1);
    };
    const handleSearch = (e) => {
        setSearch(searchQuery);
        setPage(1);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1); 
    };
    const handleClear=()=>{
        setSearchQuery('');
        setSearch(''); 
        setCategory(''); 
        setPage(1);
        setNoResults(false); 
    }

    const toggleListStatus = async (id, listStatus) => {
        try {
            const response = await axiosInstance.put(`/admin-jobs/${id}/list`);
            if (response.data.success) {
                setJobs(jobs.map(job =>
                    job._id === id ? { ...job, delete: !listStatus } : job
                ));
            }
        } catch (error) {
            console.error('Error updating list status:', error);
        }
    };

    const handleToggleListStatus = (id, listStatus) => {
        Swal.fire({
            title: listStatus ? 'List Job?' : 'Unlist Job?',
            text: `Are you sure you want to ${listStatus ? 'List' : 'Unlist'} this job?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${listStatus ? 'List' : 'Unlist'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                toggleListStatus(id, listStatus);
                Swal.fire(
                    'Success!',
                    `Job has been ${listStatus ? 'Listed' : 'Unlisted'}.`,
                    'success'
                );
            }
        });
    };

    const viewJob = (id) => {
        navigate(`/admin-jobdetails/${id}`);
    };

    return (
        <>
            <AdminSideNavigation />
            <AdminNavigation />
            <div className="admin-panel">
                <div className="content-wrapper">
                    <div className="user-management-header">
                        <h1>Job Management</h1>
                    </div>
                    <InputGroup className="adminjobs-input-group mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                         <Form.Select value={category} onChange={handleCategoryChange} style={{ marginLeft: '10px', width: '100px' }}>
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.categoryName}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </Form.Select>
                        <Button variant="outline-primary" onClick={handleSearch}>
                            <FaSearch /> Search
                        </Button>
                        <Button variant="outline-secondary" onClick={handleClear}>
                             Clear
                        </Button>
                    </InputGroup>
                    <div className="user-management-section">
                    {noResults ? (
                            <p>No jobs found matching your search criteria.</p>
                        ) : (
                         <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sl. No</th>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Company</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, index) => (
                                    <tr key={job._id}>
                                        <td>{index + 1}</td>
                                        <td>{job.jobTitle}</td>
                                        <td>{job.categoryName}</td>
                                        <td>{job.companyName}</td>
                                        <td>
                                            <Button
                                                variant={job.delete ? 'success' : 'danger'}
                                                onClick={() => handleToggleListStatus(job._id, job.delete)}
                                            >
                                                {job.delete ? 'List' : 'Unlist'}
                                            </Button>
                                            <Button
                                                variant="info"
                                                onClick={() => viewJob(job._id)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                View
                                            </Button>
                                        </td>
                                        <td>
                                       {(job.reportCount > 5 && !job.delete)&& (
                                       <div className="blinking-dot"></div>
                                       )}
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
    );
}

export default Jobs;
