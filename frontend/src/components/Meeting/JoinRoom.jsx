import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const JoinRoom = () => {
  const [meetingId, setMeetingId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/api/rooms/join', {
      meetingId,password
    },{
      withCredentials: true, // Include cookies
    })
   
  
      if(response.data.valid){
        console.log('response: ',response);
        navigate('/meetingroom', {state : { roomId : meetingId, name: response.data.name }})
      } 
      else{
        console.log('not valid')
      }
   
  }

  return (
    <div className='bg-[#044c69] flex h-screen w-screen items-center justify-center'>
        <div className='px-12 py-8 bg-white rounded-xl shadow-lg shadow-cyan-800'>
          <h1 className='text-3xl font-semibold  text-black '>Join Meeting</h1>
          <h1 className='border-b-2 border-black w-48'></h1>
            <form
            onSubmit={(e) => {
              handleSubmit(e);
            }} 
            required
            className='flex flex-col gap-5 mt-5 text-black'>
                <input
                value={meetingId}
                onChange={(e) => {
                  setMeetingId(e.target.value);
                }} 
                required
                className='border-b-2 py-3 text-[1.2rem] placeholder:text-gray-500 outline-none' type="text"  placeholder='Meeting Id'/>
                <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}  
                className='border-b-2 py-3  text-[1.2rem] placeholder:text-gray-500 outline-none' type="password" placeholder='Password'/>                
                <button className=' w-full border-none text-white bg-[#044c69] py-2 px-6 rounded text-xl outline-none hover:cursor-pointer hover:opacity-90' type='submit'>Join</button>
                
            </form>
        </div>
    </div>
  )
}

export default JoinRoom