import React, { createContext, useEffect,useState } from 'react'
import Swal from 'sweetalert2';
import axiosInstance from '../Services/Interceptor/companyInterceptor.js';

export const CompanyAuth=createContext()

function CompanyContext({children}) {
    const [company, setCompany] = useState(JSON.parse(localStorage.getItem('company')) || null)
    const [loading, setLoading] = useState(true)
  
  
    useEffect(() => {
      const checkAuthenticated = async () => {
        const token = localStorage.getItem('companytoken')
        if (token) {
          try {
            const response = await axiosInstance.get('/company-verify')
            if (response.data.success) {
              const companyData=response.data.company
              if (companyData.block) {
                Swal.fire({
                  title: 'Blocked!',
                  text: 'Your account has been blocked. Please contact support.',
                  icon: 'warning',
                  timer: 5000,
                  position: 'top-center',
                });
                CompanyLogout()   
                return;
              }
              setCompany(companyData)
            } else {
              setCompany(null)
              localStorage.removeItem('company');
            }
          } catch (error) {
            console.error('An error occurred during token verification:', error);
            setCompany(null);
            localStorage.removeItem('company');
          }
        }
        setLoading(false)
      }
      checkAuthenticated()
    }, [])
  
    const CompanyLogin = async (email, password) => {
      try {
        const response = await axiosInstance.post('/company-login', { email, password });
        console.log(response);
        if (response.data.success) {
          const companyData = response.data.company;
          if (companyData.block) {
            Swal.fire({
              title: 'Blocked!',
              text: 'Your account has been blocked. Please contact support.',
              icon: 'warning',
              timer: 5000,
              position: 'top-center',
            });
            return false; 
          }
          setCompany(companyData);        
          localStorage.setItem('companytoken', response.data.token)
          localStorage.setItem('company', JSON.stringify(response.data.company));
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
    const CompanyLogout = async () => {
      try {
        const response = await axiosInstance.get('/company-logout')
        console.log(response);
        if (response.data.success) {
          setCompany(null)
          localStorage.removeItem('companytoken')
          localStorage.removeItem('company')
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
      <CompanyAuth.Provider value={{ company, setCompany, loading, Authenticated: !!company, CompanyLogin,CompanyLogout }}>
        {children}
      </CompanyAuth.Provider>
    </div>
  )
}

export default CompanyContext
