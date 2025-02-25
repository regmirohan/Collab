import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  // Sample user data
  useEffect(() => {
    const getUsers = async () => {
    
        const response = await axios.get('http://localhost:3000/api/admin/getUsers', {
          withCredentials: true
        });

        if(response.data){
          console.log(response.data);
          setUsers(response.data)
        }
      
     
     
  }
   
    getUsers()
  }, [])
  
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addUser = () => {
    navigate('/admin/userForm');
  }
  const editUser = (user) => {
    if(id){
      navigate('/userform', {state: {user}})
    }
  }
  const deleteUser = async (id,e) => {
    const response = await axios.delete('http://localhost:3000/api/admin/deleteuser',{
      data: {id},
      withCredentials: true
    })
    if(response.data.isDeleted){
      console.log(response.data)
      e.target.parentNode.parentNode.remove();
    }
  }
  return (
   <div className="bg-white flex w-full relative">
      <Sidebar />
      <div className="p-6 w-[80%] absolute right-0">
      <h1 className="bg-[#044c69] w-full text-white text-2xl font-bold py-4 px-6 mb-6">User Management</h1>

      {/* Search Bar and Add User Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="border border-[#044c69] rounded-lg px-4 py-2 w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
        onClick={addUser}
        className="bg-[#044c69] text-white px-4 py-2 rounded-lg hover:bg-[#1a90be]">
          Add User
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table-auto w-full text-left">
          <thead className="bg-[#044c69] text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button 
                  onClick={() => {
                    editUser(user)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button>
                  <button 
                  onClick={(e) => {
                    deleteUser(user._id,e)
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-4 py-2 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
};

export default UserManagement;
