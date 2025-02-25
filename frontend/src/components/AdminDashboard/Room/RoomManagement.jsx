import React, { useEffect, useState } from "react"
import Sidebar from "../Sidebar"
import axios from 'axios'
import {useNavigate } from "react-router-dom";
const RoomManagement = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    const getRooms = async () => {
     
      const response  = await axios.get('http://localhost:3000/api/admin/roomDetail', {
        withCredentials: true
      });
      if(response.data){
        console.log(response.data)
        setRooms(response.data);
      }
    
    }
    getRooms();
  }, [])

  // Function to delete a meeting
  const deleteRoom = async (rooms,id) => {
    const response = await axios.delete('http://localhost:3000/api/admin/deleteRoom',{
      data: {id},
      withCredentials: true
    })
    if(response.data.isDeleted){
      const updatedMeetings = rooms.filter((room) => room._id !== id);
      setRooms(updatedMeetings);
      alert("Meeting deleted successfully!");
    }
    
  };

  return (
    <div className=" bg-white flex w-full relative">
        <Sidebar />
        <div className="p-6 w-[80%] absolute right-0">
        <h1 className="bg-[#044c69] w-full text-white text-2xl font-bold py-4 px-6 mb-6">Room Management</h1>

      {/* Meetings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md w-full">
        <table className="table-auto w-full text-left">
          <thead className="bg-[#044c69] text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Room Id</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Host</th>
              <th className="px-4 py-2">Participants</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="hover:bg-zinc-300">
                <td className="px-4 py-2">{room._id}</td>
                <td className="px-4 py-2">{room.roomId}</td>
                <td className="px-4 py-2">{new Date(room.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2">{room.host.host.name}</td> 
              {/* {console.log(room.host.host.name)} */}
               {room.participants.map((user) => {
                   return <td key={user._id} className="px-4 py-2 flex flex-col justify-center items-center">{user.name}</td>
                })} 
                {room.participants.length === 0 && (
                  <td className="px-4 py-2 flex flex-col justify-center items-center">_</td>
               )}
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteRoom(room,room._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-2 text-gray-500">
                  No active rooms found.
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

export default RoomManagement;
