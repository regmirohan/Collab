import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
const MeetingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const meeting = location.state?.meeting;
  // console.log('meeting: ',meeting);
  const [title, setTitle] = useState(meeting?.title || "");
  const [description, setDescription] = useState(meeting?.description || "");
  const [startTime, setStartTime] = useState(meeting?.startTime || "");
  const [duration, setDuration] = useState(meeting?.duration || "");
  // const [host, setHost] = useState(meeting.host || "");
  // const [participants, setParticipants] = useState(meeting.participants || []);
  const [meetingId, setMeetingId] = useState(meeting?.meetingId || "");
  const [password, setPassword] = useState(meeting?.password || "");

  // const handleParticipantChange = (e) => {
  //   const selectedOptions = Array.from(e.target.selectedOptions).map(
  //     (option) => option.value
  //   );
  //   setParticipants(selectedOptions);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(meeting){
      const response = await axios.put(`http://localhost:3000/api/admin/editMeeting/${meetingId}`, {title, description, startTime, duration}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
      if(response){
        console.log(response.data);
        navigate('/admin/meetings')
      }
    }else{
      try{
        const response = await axios.post('http://localhost:3000/api/admin/addMeeting', {
          title,description,startTime,duration
        },{
          withCredentials: true
        })
        if(response){
          console.log('response: ',response.data)
          navigate('/admin/meetings');
        }
      }catch(e){
        console.log("error posting data: ",e)
      }
    }
   
  };

  return (
   <div className="flex justify-center items-center h-screen bg-[#044c69]">
       <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg p-6 border rounded-lg shadow-md bg-white py-6">
        <h1 className="text-2xl font-medium text-center">Schedule Meeting</h1>
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044269]"
        />
      </div>

      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044c69]"
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044c69]"
        />
      </div>

      <div>
        <label className="block text-gray-700">Duration (in minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044c69]"
        />
      </div>

      {/* <div>
        <label className="block text-gray-700">Host</label>
        <select
          value={host}
          onChange={(e) => setHost(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Host</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* <div>
        <label className="block text-gray-700">Participants</label>
        <select
          multiple
          value={participants}
          onChange={handleParticipantChange}
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* <div>
        <label className="block text-gray-700">Meeting ID</label>
        <input
          type="text"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          required
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      <button
        type="submit"
        className="w-full py-2 mt-4 bg-[#044c69] text-white rounded-lg hover:bg-[#044c69]focus:outline-none focus:ring-2 focus:ring-[#044c69]"
      >
        {meeting? 'Edit Meeting' : 'Add Meeting'}
      </button>
    </form>
   </div>
  );
};

export default MeetingForm;
