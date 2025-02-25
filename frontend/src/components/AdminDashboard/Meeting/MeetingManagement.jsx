import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const MeetingManagement = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const getMeetings = async () => {     
      const response  = await axios.get('http://localhost:3000/api/admin/getMeetings', {
        withCredentials: true
      });
      if(response.data){
        setMeetings(response.data);
      }
    
      
    }
    getMeetings();
  }, [])
  
  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to delete a meeting
  const deleteMeeting = async (id) => {
    const response = await axios.delete('http://localhost:3000/api/admin/deletemeeting',{
      data: {id},
      withCredentials: true
    })
    if(response.data.isDeleted){
      const updatedMeetings = meetings.filter((meeting) => meeting._id !== id);
      setMeetings(updatedMeetings);
      alert("Meeting deleted successfully!");
    }
    
  };

  const editMeeting = (meeting) => {
    if(meeting){
      navigate('/admin/meetingForm', {state: { meeting}});
    }
  }
  const addMeeting = () => {
    navigate('/admin/meetingForm')
  }

  return (
    <div className=" bg-white flex w-full relative">
        <Sidebar />
        <div className="p-6 w-[80%] absolute right-0">
          
          <h1 className="bg-[#044c69] w-full text-white text-2xl font-bold py-4 px-6 mb-6">Meeting Management</h1>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="search meetings..."
              className="border border-[#044c69] rounded-lg px-4 py-2 w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
            onClick={addMeeting}
            className="bg-[#044c69] text-white px-4 py-2 rounded-lg hover:bg-[#1a90be]">
              Add Meeting
            </button>
          </div>
          
      

      {/* Meetings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table-auto w-full text-left">
          <thead className="bg-[#044c69] text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Meeting Id</th>
              <th className="px-4 py-2">Password</th>
              {/* <th className="px-4 py-2">Organizer</th> */}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map((meeting) => (
              <tr key={meeting._id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{meeting._id}</td>
                <td className="px-4 py-2">{meeting.title}</td>
                <td className="px-4 py-2">{new Date(meeting.startTime).toLocaleString()}</td>
                <td className="px-4 py-2">{meeting.meetingId}</td>
                <td className="px-4 py-2">{meeting.password}</td>
                {/* <td className="px-4 py-2">{meeting.organizer}</td> */}
                <td className="px-4 py-2 flex gap-2">
                <button
                     onClick={() => editMeeting(meeting)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                     onClick={() => deleteMeeting(meeting._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredMeetings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-2 text-gray-500">
                  No meetings found.
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

export default MeetingManagement;
