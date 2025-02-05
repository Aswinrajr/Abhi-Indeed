import axios from "axios";
import React,{ useState,createContext, useEffect } from "react";
import Swal from 'sweetalert2';
import axiosInstance from "../Services/Interceptor/candidateInterceptor.js";
export const AuthContext=createContext()

function UserContext({children}) {
     const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')) || null);
     const [loading,setLoading]=useState(true)     

     useEffect(()=>{
         const checkAuthenticated=async()=>{
            const token=localStorage.getItem('token')
            if(token){
                try {
                    const response=await axiosInstance.get('/verify')
                    if(response.data.success){
                      const user=response.data.user.user
                      if (user.block) {
                        Swal.fire({
                          title: 'Blocked!',
                          text: 'Your account has been blocked. Please contact support.',
                          icon: 'warning',
                          timer: 5000,
                          position: 'top-center',
                        });
                        logout();   
                        return;
                      }
                        setUser(user)
                    }else{
                        setUser(null)
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('An error occurred during token verification:', error);
                    setUser(null);
                    localStorage.removeItem('user');
                }
            }
            setLoading(false)
         }
         checkAuthenticated()
     },[])

     useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      const user = queryParams.get('user');
  
      if (token && user) {
        setUser(JSON.parse(decodeURIComponent(user)));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(JSON.parse(decodeURIComponent(user))));
        Swal.fire({
          title: 'Success!',
          text: 'Google authentication successful',
          icon: 'success',
          timer: 5000,
          position: 'top-center',
        });
        window.location.href = '/'; 
      }
    }, []);

     const login=async(email,password)=>{
             try {     
                const response = await axiosInstance.post('/employee-login', { email, password});
                if(response.data.success){
                    setUser(response.data.user)
                    localStorage.setItem('token',response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    return true
                }else{
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.message,
                        icon: 'error',
                        timer: 5000,
                        position: 'top-center',
                      });
                      return false
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
                        text:"An error occured.Please try again later",
                        icon: 'error',
                        timer: 5000,
                        position: 'top-center',
                      });
                }
             }
           }

           const logout=async()=>{
            try {
                const response=await axiosInstance.get('/employee-logout')
                if(response.data.success){
                    setUser(null)
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                        Swal.fire({
                        title: 'Success!',
                        text: response.data.message,
                        icon: 'success',
                        timer: 5000,
                        position: 'top-center',
                      })
                      window.location.href('/employee-login')
                }
            } catch (error) {
                console.log("An error occured during logout",error);
            }
           }
           const handleGoogleCallback = async () => {
            try {
              const response = await axiosInstance.get('/auth/google/callback');
              if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                Swal.fire({
                  title: 'Success!',
                  text: 'Google authentication successful',
                  icon: 'success',
                  timer: 5000,
                  position: 'top-center',
                });
                window.location.href = '/';
                return true;
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: response.data.message || 'Google authentication failed',
                  icon: 'error',
                  timer: 5000,
                  position: 'top-center',
                });
                return false;
              }
            } catch (error) {
              console.error('Error during Google login callback:', error);
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred during Google login',
                icon: 'error',
                timer: 5000,
                position: 'top-center',
              });
              return false;
            }
          };
        
  return (
    <div>
      <AuthContext.Provider value={{login,logout,user,setUser,isAuthenticated:!!user,loading,handleGoogleCallback}}>
            {children}
      </AuthContext.Provider>
    </div>
  )
}

export default UserContext
