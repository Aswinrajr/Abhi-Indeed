import React from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoutes() {
  const token=localStorage.getItem('token')
  return token ? <Outlet/> : <Navigate to='/employee-login'/>
}
export default PrivateRoutes

export function RecruiterPrivateRoutes() {
    const recruiterToken=localStorage.getItem('recruitertoken')
    return recruiterToken ? <Outlet/> : <Navigate to='/recruiter-login'/>
  }
  
  export function AdminPrivateRoutes() {
    const adminToken = localStorage.getItem('admintoken')
    return adminToken ? <Outlet/> : <Navigate to='/admin-login'/>
  }

  export function CompanyPrivateRoutes() {
    const companyToken = localStorage.getItem('companytoken')
    return companyToken ? <Outlet/> : <Navigate to='/company-login'/>
  }
