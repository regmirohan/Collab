import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUsers, FaChartBar, FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import axios from 'axios'
import logo from '../../assets/colab3.png'
const Sidebar = () => {
  const navigate = useNavigate()

 
  const handleLogOut = async () => {
    const response = await axios.get('http://localhost:3000/api/adminAuth/session/destroy', {
      withCredentials: true
    });
    if(response){
      navigate('/signin')
    }
  }
  return (
    <div className="w-64 h-screen bg-[#033750] text-white flex flex-col fixed top-0 left-0">
      {/* Header */}
      <div className=" bg-white px-6 py-3 text-center">
        <img className="h-14 w-auto " src={logo} alt="" />
        {/* <h1 className="text-2xl font-bold">Collab Admin</h1> */}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4">
        <Link
          to="../../admin/dashboard"
          className="flex items-center px-6 py-3 text-white hover:bg-white hover:text-black"
        >
          <FaChartBar className="mr-3 text-xl" />
          Dashboard
        </Link>
        <NavLink
          to="../../admin/users"
          className="flex items-center px-6 py-3 text-white hover:bg-white hover:text-black"
        >
          <FaUsers className="mr-3 text-xl" />
          Users Management
        </NavLink>
        <Link
          to="../../admin/meetings"
          className='flex items-center px-6 py-3 text-white hover:bg-white hover:text-black'
>         <FaCalendarAlt className="mr-3 text-xl" />
          Meetings Management
          </Link>
          <Link
          to="../../admin/rooms"
          className='flex items-center px-6 py-3 text-white hover:bg-white hover:text-black'
>         <SiGoogleclassroom  className="mr-3 text-xl" />
          Rooms Management
          </Link>
          {/* <Link
          to="../../admin/settings"
          className='flex items-center px-6 py-3 text-white hover:bg-white hover:text-black'
>
          <FaCog className="mr-3 text-xl" />
          Settings
          </Link>      */}

        {/* <Link
          to="/help"
          className="flex items-center px-6 py-3 text-white hover:bg-white hover:text-black"
        >
          <FaQuestionCircle className="mr-3 text-xl" />
          Help & Support
        </Link> */}

        <button
        onClick={handleLogOut} // Replace with actual logout logic
        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700"
  >
        <FaSignOutAlt className="mr-3 text-xl" />
        Logout
        </button>
      </nav>
    </div>

  );
};

export default Sidebar;
