import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import logo from '../../assets/colab3.png'
const Sidebar = ({toggleMenu, handleNavigation}) => {
  return  <div className="absolute top-0 right-0 bg-[#044c69] w-1/3 sm:hidden" >
  <nav className='flex flex-col justify-end items-center gap-4 px-14 py-5 text-white'>
       {/* <div>
           <h1 className='text-2xl '>Collab</h1>
       </div> */}
       <div className='flex flex-col items-center gap-4 text-xl font-medium'>
          <Link to='/' className='flex gap-2 items-center hover:underline underline-offset-8'>Home</Link>
          <h1 onClick={handleNavigation} className='hover: cursor-pointer hover:underline underline-offset-8'>Meetings</h1>
          
       </div>
       <div className='flex'>
           <button 
           onClick={() => {
           navigate('/signin')
           }}
           className='text-xl hover:cursor-pointer hover:bg-cyan-700 '>Sign In</button>
            <button 
           onClick={() => {
           handleSignOut()
           }}
           className='text-xl hover:cursor-pointer hover:bg-cyan-700 '>Sign Out</button>
       </div>
       
   </nav>
     <div 
       onClick={toggleMenu}
       className='absolute top-0 right-0 md:hidden p-2 hover:cursor-pointer'>
         <IoClose size='20' color='white'/>
     </div>
  </div>
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const checkSession = async () => {
    const response = await axios.get('http://localhost:3000/api/session/check',{
        withCredentials: true
    })
    console.log(response);
   
    return response.data.loggedIn
}
useEffect(() => {
  const toggle = async () => {
    const res  = await checkSession();
    if(res){
      setStatus(true);
    }else{
      setStatus(false);
    }
  }
 toggle()
}, [])

const handleSignIn = async () => {
  navigate('/signin')
 
}
const handleSignOut = async () => {
 
    const response = await axios.get('http://localhost:3000/api/session/destroy',{
      withCredentials: true
    })
    setStatus(false);
    console.log(response.data);
 
  
}
const handleNavigation = async () => {
  
    navigate('/meetingdetails')
 
}
const toggleMenu = () => {
  setIsOpen(!isOpen)
}

  return (
    <div className='w-full  bg-white'>
      {/* for larger screens */}
        <nav className='flex justify-between items-center px-6 py-2 text-black'>
            <div className='flex items-center'>
              <img className='h-20 w-auto' src={logo} alt="" />
            </div>
            <div className='hidden sm:flex gap-10 text-xl font-medium'>
               <Link to='/' className='flex gap-2 items-center hover:underline underline-offset-8'>Home</Link>
               <h1 onClick={handleNavigation} className='hover: cursor-pointer hover:underline underline-offset-8'>Meetings</h1>
               <h1 onClick={() => {
                navigate('/settings')
               }} className='hover: cursor-pointer hover:underline underline-offset-8'>Settings</h1>
               
            </div>
            <div className='hidden sm:flex text-white' >
              {status ? (
                 <button 
                 onClick={() => {
                   handleSignOut()
                 // navigate('/signin')
                 }}
                 className='text-xl bg-[#044c69] text-white px-6 py-2 hover:cursor-pointer hover:bg-cyan-700'>Sign Out</button>
              ):(
                <button 
                onClick={() => {
                handleSignIn()
                }}
                className='text-xl bg-[#044c69] px-6 py-2 hover:cursor-pointer hover:bg-cyan-700 '>Sign In</button>
              )}
               
            </div>
            <div 
            onClick={toggleMenu}
            className='flex sm:hidden'>
              <FiMenu size='25'/>
            </div>
        </nav>
       {/* for smaller screens */}
        {isOpen && <Sidebar toggleMenu={toggleMenu} handleNavigation={handleNavigation}/>}
      
    </div>
  )
}

export default Header