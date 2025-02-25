import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom'
const Schedule = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [formData, setFormData] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
     if(location.state && location.state.selectData){
      const data = location.state.selectData;
      setFormData(location.state.selectData)
      console.log(data)
      // details.map((data) => {
        const startTime = new Date(data.startTime)

        const year = startTime.getFullYear();
        const month = String(startTime.getMonth() + 1).padStart(2, "0");
        const day = String(startTime.getDate()).padStart(2, "0");
        // Extract the time components
        const hours = String(startTime.getHours()).padStart(2, '0');
        const minutes = String(startTime.getMinutes()).padStart(2, '0');
        

        // Combine into the desired format
        const dateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        setTitle(data.title)
        setDesc(data.description)
        setStartTime(dateTime)
        setDuration(data.duration)
      // })
     }
    }, [location.state])
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title,desc, startTime, duration)
    if(formData._id){
      console.log(formData._id);
      try{
        const roomId = location.state.selectData.meetingId
        const response = await axios.put(`http://localhost:3000/api/meeting/update/${roomId}`,{title,desc,startTime,duration}, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials:true
          });
          console.log(response)
          if(response.data.success){
            navigate('/meetingdetails')
          }
    }catch(err){
        console.log(err)
    }
    }
    else{
      console.log(formData)
      
      try{
        const response = await axios.post('http://localhost:3000/api/meeting/schedule', {
          title,desc,startTime,duration
        },{
          withCredentials: true
        })
        if(response){
          console.log('response: ',response.data)
          navigate('/meetingdetails');
        }
      }catch(e){
        console.log("error posting data: ",e)
      }
  
    
  
    }
  }
  return (
    <div className='bg-[#044c69] flex h-screen w-screen items-center justify-center'>
        <div className='px-12 py-8 bg-white rounded-xl shadow-lg shadow-cyan-800 w-2/5'>
            <h1 className='text-3xl font-semibold  text-black'>Schedule Meeting</h1>
            <h1 className='border-b-2 border-black w-64'></h1>
                <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }} 
                required
                className='flex flex-col gap-2 mt-5 text-black'>
                    <label className='text-2xl' htmlFor="title">Title</label>
                    <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }} 
                    required
                    className='border-2 border-gray-600 p-2 text-[1.2rem] placeholder:text-gray-600 outline-none' type="text"  placeholder='Meeting Title'/>
                     <label className='text-2xl' htmlFor="title">Description</label>
                    <textarea
                    value={desc}
                    onChange={(e) => {
                      setDesc(e.target.value)
                    }}  
                    className='border-2 border-gray-600 p-2 text-[1.2rem] placeholder:text-gray-500 outline-none'/>
                     <label className='text-2xl' htmlFor="title">Start Time</label>
                    <input 
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value)
                    }} 
                    required
                    className='border-2 border-gray-600 p-2 text-[1.2rem] placeholder:text-gray-500 outline-none' type="datetime-local"/>
                     <label className='text-2xl' htmlFor="title">Duration</label>
                    <input
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value)
                    }}  
                    required
                    className='border-2 border-gray-600 p-2 text-[1.2rem] placeholder:text-gray-500 outline-none' type="number"/>
                    <button className=' w-full border-none text-white bg-[#044c69] py-2 px-6 rounded text-xl outline-none' type='submit'>{formData._id ? 'Update Schedule' : 'Create Schedule'}</button>
                    
            </form>
        </div>
    </div>
  )
}

export default Schedule