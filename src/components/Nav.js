import React from 'react'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';
import './Nav.css'
const Nav = () => {
  const currentUser = localStorage.getItem('user');
  useEffect(() => {
    console.log(currentUser)
  
  }, [])
  
    const logOut = async()=>{
        try{
            await signOut (auth);
            localStorage.removeItem('user');
            setTimeout(() => {
              toast.success("Signed out successfully!!!")
          }, 1000);
            window.location.reload();
        }catch(err){
            console.error(err);
            toast.error("Sign out failed!!!")
        }
    }
  return (
    <div className='nav-container'>
        <ToastContainer/>
        <div className="navbar">
        {currentUser?
        <Link className='login-link'><button className='login-btn' onClick={logOut}>LogOut</button></Link>:
        <Link to="/login" className='login-link'><button className="login-btn">LogIn/SignUp</button></Link>}
      </div>
    </div>
  )
}

export default Nav