import React, { createContext, useEffect, useState } from 'react'
import axiosInstance from '../Services/Interceptor/adminInterceptor.js'
import Swal from 'sweetalert2';
export const AdminAuth = createContext()

function AdminContext({ children }) {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('admin')) || null)
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const checkAuthenticated = async () => {
      const token = localStorage.getItem('admintoken')
      if (token) {
        try {
          const response = await axiosInstance.get('/admin-verify')
          if (response.data.success) {
            setAdmin(JSON.parse(localStorage.getItem('admin')))
          } else {
            setAdmin(null)
            localStorage.removeItem('admin');
          }
        } catch (error) {
          console.error('An error occurred during token verification:', error);
          setAdmin(null);
          localStorage.removeItem('admin');
        }
      }
      setLoading(false)
    }
    checkAuthenticated()
  }, [])

  const AdminLogin = async (email, password) => {
    try {
      const response = await axiosInstance.post('/admin-login', { email, password });
      if (response.data.success) {
        console.log(response.data);
        setAdmin(response.data.admin)
        localStorage.setItem('admintoken', response.data.token)
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        return true
      } else {
        console.log(response.data.message);
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data);
        Swal.fire({
          title: 'Error!',
          text: error.response.data.message,
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
      } else {
        console.error('An error occurred:', error);
        Swal.fire({
          title: 'Error!',
          text: "An error occured.Please try again later",
          icon: 'error',
          timer: 5000,
          position: 'top-center',
        });
      }
    }
  }
  const AdminLogout = async () => {
    try {
      const response = await axiosInstance.get('/admin-logout')
      if (response.data.success) {
        setAdmin(null)
        localStorage.removeItem('admintoken')
        localStorage.removeItem('admin')
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        })
      }
    } catch (error) {
      console.log("An error occured during logout", error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again later.',
        icon: 'error',
        timer: 5000,
        position: 'top-center',
      });
    }
  }
  return (
    <div>
      <AdminAuth.Provider value={{ admin, setAdmin, loading, Authenticated: !!admin, AdminLogin, AdminLogout }}>
        {children}
      </AdminAuth.Provider>
    </div>
  )
}

export default AdminContext






