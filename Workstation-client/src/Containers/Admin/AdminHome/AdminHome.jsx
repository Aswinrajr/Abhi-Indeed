import React, { useEffect, useContext, useState } from 'react';
import AdminSideNavigation from '../../../Components/AdminSideNavigation';
import AdminNavigation from '../../../Components/AdminNavigation';
import { AdminAuth } from '../../../Context/AdminContext';
import { Bar,Pie} from 'react-chartjs-2'; 
import Chart from 'chart.js/auto'; 
import { useNavigate } from 'react-router-dom';
import './AdminHome.css'; 
import axiosInstance from '../../../Services/Interceptor/adminInterceptor.js';

function AdminHome() {
  const { Authenticated, loading } = useContext(AdminAuth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    recruiters: 0,
    candidates: 0,
    jobs: 0,
  });

  const [categoryData, setCategoryData] = useState({
    categories: [],
    categoryCounts: [],
  });

  const [orderData, setOrderData] = useState({
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchStats=async()=>{
      try {
        const response=await axiosInstance.get('/admin-getStats')
        if(response.data.success){
          setStats(response.data.stats)
        }else{
          console.log('Failed to fetch statistics');
        }
      } catch (error) {
        console.error('An error occurred while fetching statistics', error);
      }
    }
    const fetchCategoryStats=async()=>{
      try {
        const response=await axiosInstance.get('/admin-getCategoryStats')        
        if(response.data.success){
          const categories = response.data.categories.map(cat => cat.name);
          const categoryCounts = response.data.categories.map(cat => cat.count);
          setCategoryData({ categories, categoryCounts });
        }else{
          console.log('Failed to fetch categories');
        }
      } catch (error) {
        console.error('An error occurred while fetching categories', error);
      }
    }
    const fetchOrderStats = async () => {
      try {
        const response = await axiosInstance.get('/admin-getOrderStats');
        if (response.data.success) {
          setOrderData({
            totalOrders: response.data.totalOrders,
          });
        } else {
          console.log('Failed to fetch order statistics');
        }
      } catch (error) {
        console.error('An error occurred while fetching order statistics', error);
      }
    };
    if(Authenticated){
      fetchStats()
      fetchCategoryStats()
      fetchOrderStats()
    }
  }, [Authenticated, navigate, loading]);


  const orderChartData = {
    labels: ['Orders'],
    datasets: [
      {
        label: 'Orders',
        data: [orderData.totalOrders],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const data = {
    labels: ['Recruiters', 'Candidates', 'Jobs'],
    datasets: [
      {
        label: 'STATISTICS',
        data: [stats.recruiters, stats.candidates, stats.jobs],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: categoryData.categories, 
    datasets: [
      {
        label:'Count',
        data: categoryData.categoryCounts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Orders', // Title for the Bar chart
        font: {
          size: 16,
        },
        padding: {
          bottom: 20,
        },
      },
    },
  };

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Categories',
        font: {
          size: 16,
        },
        padding: {
          bottom: 20,
        },
      },
    },
  };

  return (
    <div>
      <AdminSideNavigation />
      <AdminNavigation />
      <div className="admin-home-dashboard">
        <div className="admin-home-stats-cards">
          <div className="admin-home-card" onClick={() => navigate('/admin-recruiters')}>
            <h3>Recruiters</h3>
            <p>{stats.recruiters}</p>
          </div>
          <div className="admin-home-card" onClick={() => navigate('/admin-candidates')}>
            <h3>Candidates</h3>
            <p>{stats.candidates}</p>
          </div>
          <div className="admin-home-card" onClick={() => navigate('/admin-jobs')}>
            <h3>Jobs</h3>
            <p>{stats.jobs}</p>
          </div>
        </div>

        <div className="admin-home-chart-container">
          <Bar data={data} options={options} />
        </div>

        <div className="admin-home-charts">
        <div className="admin-home-pie-chart-container">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
          <div className="admin-home-orders-chart">
            <Bar data={orderChartData} options={options} />
          </div>
      </div>
    </div>
    </div>
  );
}

export default AdminHome;
