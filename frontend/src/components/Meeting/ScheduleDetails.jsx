import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchBox from '../Navbar/SearchBox';
import logo from '../../assets/colab3.png'
const ScheduleDetails = () => {
  const [details, setDetails] = useState([]);
  const [resData, setResData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const startRef = useRef({});
  const navigate = useNavigate();
  const handleNavigation = async () => {
    const res = await checkSession();
    
    if(res){
     
      navigate('/meetingdetails')
    }
    else{
      
      navigate('/signin');
    }
  }
  const filteredMeetings = details.filter(
    (detail) =>
      detail.title.toLowerCase().includes(searchVal.toLowerCase()) 
  );

   useEffect(() => {
    const meetingDetails = async () => {
        const response = await axios.get('http://localhost:3000/api/meeting/details',{
          withCredentials: true, // Include cookies
        })
        if(response){
            console.log('response: ',response.data);
            setDetails(response.data);
            setResData(response.data);
        }
    }
    meetingDetails();
   }, [])
   const editMeeting = (roomId) => {
    const selectData = details.find((data) => data.meetingId == roomId)
    if(details){
      navigate('/schedulemeeting', { state : { selectData }})
    }
   }
   const startMeeting = async (roomId) => {
    if(roomId){
        const getRole = async () => {
           const response = await axios.get(`http://localhost:3000/api/meeting/getRole/${roomId}`,{
               withCredentials: true
           })
           console.log("role: ",response);   
           return response.data;        
       }
        const role = await getRole();
       
        navigate('/meetingroom',{state: {roomId: roomId, role: role}})
     

    }
   }  

   const deleteMeeting = async (id,e) => {
    console.log("id: ",id)
    try{
      const response = await axios.delete('http://localhost:3000/api/meeting/delete',{
        data: {id},
        withCredentials: true
      })
      if(response.data.isDeleted){
        console.log(response.data)
        e.target.parentNode.parentNode.remove();
      }
    }catch(err){
      console.log(err)
    }
   
   }
   const invite = async (data, e) => {
    const {meetingId, password} = data
    try{
      const response = await axios.post('http://localhost:3000/api/users/sendMail',{
        meetingId, password
      },{
        withCredentials: true
      })
      if(response.data.success){
        alert("Invitation sent successfully")
      }
    }catch(err){
      console.log(err)
    }
   }
  return (
    <div className='bg-white h-screen flex flex-col gap-6'>
       <nav className='flex justify-between items-center px-6 py-2 text-black'>
            <div className='flex items-center'>
              <img className='h-20 w-auto' src={logo} alt="" />
            </div>
            <div className='hidden sm:flex gap-10 text-xl font-medium'>
               <Link to='/' className='flex gap-2 items-center hover:underline underline-offset-8'>Home</Link>
               <h1 onClick={handleNavigation} className='hover: cursor-pointer hover:underline underline-offset-8'>Meetings</h1>
               
            </div>
            <div className='flex justify items-center text-black' >
            <SearchBox searchVal={searchVal} setSearchVal={setSearchVal}/>               
            </div>
            {/* <div 
            onClick={toggleMenu}
            className='flex sm:hidden'>
              <FiMenu size='25'/>
            </div> */}
        </nav>
      
       {filteredMeetings.map((data,idx) => {
          return <div key={idx} className='flex flex-col px-10 py-6 gap-5 w-2/3'>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-medium'>Title:</h1>
                <p className='text-xl'>{data.title}</p>
              </div>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-medium'>Start Time:</h1>
                <p className='text-xl'>{new Date(data.startTime).toLocaleString()}</p>
              </div>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-medium'>End Time:</h1>
                <p className='text-xl'>{new Date(new Date(data.startTime).getTime() + data.duration * 60000).toLocaleString()}</p>
              </div>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-medium'>Meeting Id:</h1>
                <p 
                ref={startRef}
                className='text-xl'>{data.meetingId}</p>
              </div>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-medium'>Password:</h1>
                <p className='text-xl'>{data.password}</p>
              </div>
              <div className='flex gap-2 text-white'>
                <button 
                onClick={() => {
                  startMeeting(data.meetingId)
                }}
                className='bg-[#044c69] px-4 py-2 hover: cursor-pointer hover:opacity-90'>Start</button>
                <button 
                onClick={() => {
                  editMeeting(data.meetingId);
                }}
                className='bg-[#044c69] px-4 py-2'>Edit</button>
                <button 
                onClick={(e) => {
                  deleteMeeting(data.meetingId,e);
                }}
                className='bg-[#044c69] px-4 py-2'>Delete</button>
                 <button 
                onClick={(e) => {
                  invite(data,e);
                }}
                className='bg-[#044c69] px-4 py-2'>Invite</button>
              </div>
        </div>
        })}
         {filteredMeetings.length === 0 && (
             <div className='flex justify-center items-center'>
              <h1 className='text-3xl'> No meetings found.</h1>
             </div>
               
            )}
      
    </div>
  )
}

export default ScheduleDetails