import React, { useContext, useEffect,useState } from 'react'
import CompanyNavigation from '../../../Components/CompanyNavigation'
import CompanySideNavigation from '../../../Components/CompanySideNavigation'
import axiosInstance from '../../../Services/Interceptor/companyInterceptor.js'
import { CompanyAuth } from '../../../Context/CompanyContext'
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom'
import './CompanyHome.css'
function CompanyHome() {

const {Authenticated,loading}=useContext(CompanyAuth)
const [stats, setStats] = useState({
  recruiters: 0,
  jobs: 0,
});
const navigate=useNavigate()

useEffect(()=>{
  const fetchCompanyStats = async () => {
    try {
      const response = await axiosInstance.get('/company-getStats');
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        console.log('Failed to fetch company statistics');
      }
    } catch (error) {
      console.error('An error occurred while fetching company statistics', error);
    }
  };
    fetchCompanyStats();
},[])

const data = {
  labels: ['Recruiters', 'Jobs'],
  datasets: [
    {
      label: 'STATISTICS',
      data: [stats.recruiters, stats.jobs],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

  return (
    <>
    <CompanyNavigation/>
    <CompanySideNavigation/>
    <div className="company-home-dashboard">
        <div className="company-home-stats-cards">
          <div className="company-home-card" onClick={() => navigate('/company-recruiters')}>
            <h3>Recruiters</h3>
            <p>{stats.recruiters}</p>
          </div>
          <div className="company-home-card" >
            <h3>Jobs</h3>
            <p>{stats.jobs}</p>
          </div>
        </div>

        <div className="company-home-chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </>
  )
}

export default CompanyHome
