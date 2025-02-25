import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  // const [role, setRole] = useState(user?.role || "user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(user){
     try{
      const response = await axios.put(`http://localhost:3000/api/admin/editUser/${user.id}`,{ name, email, password },{
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
     }catch(e){
      console.log(e);
     }
    }
    else{
      try{
        const response = await axios.post('http://localhost:3000/api/admin/addUser',{ name, email, password},{
          withCredentials: true
        })
        if(response){
          console.log(response.data);
          navigate('/admin/users')
        }
      }catch(e){
        console.log(e)
      }
    }
  };

  return (
    <div className="bg-[#044c69] flex justify-center items-center h-screen">
       <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-6 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-medium text-center">User Form</h1>
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044c69]"
        />
      </div>

      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044c69]"
        />
      </div>

      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044c69]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-4 bg-[#044c69]  text-white rounded-lg hover:bg-[#1a4357] focus:outline-none focus:ring-2 focus:ring-[#044c69]"
      >
        Submit
      </button>
    </form>
    </div>
   
  );
};

export default UserForm;
