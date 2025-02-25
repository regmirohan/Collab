import React from 'react'
import Header from '../../components/Navbar/Header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaRegCalendarPlus } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import bgImg from "../../assets/bgImg5.png"

const Home = () => {
    const navigate = useNavigate();
    const checkSession = async () => {
        const response = await axios.get('http://localhost:3000/api/session/check',{
            withCredentials: true
        })
        console.log(response);
        return response.data
    }
    const scheduleMeeting = async () => {
        const data =  await checkSession();
        if(data.loggedIn){
            console.log(data.user)
            navigate('/schedulemeeting');
        }
        else{
            console.log(data.user)
            navigate('/signin');
        }
        
    }
    const joinMeeting = async () => {
        const data =  await checkSession();
        if(data.loggedIn){
            console.log(data.user)
            navigate('/joinmeeting');
        }
        else{
            console.log(data.user)
            navigate('/signin');
        }
        
    }
    
  return (
    <div className='h-screen w-full flex flex-col'>
    <Header />
    <div className='bg-white text-black w-full overflow-y-hidden'>       
        <div className='flex flex-col items-center gap-10 w-full py-10'>
            <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-3xl md:text-4xl font-medium'>Connect Seamlessly, Anywhere in the World</h1>
                <p className='text-md sm:w-[550px]  md:text-lg md:w-[650px]'>Designed for reliability and ease of use, it connects teams effortlessly across the globe and adapts to meet the needs of any size group.</p>
            </div>
            <div className='flex items-center justify-center gap-4 text-lg sm:text-xl mb-10'>
                <button
                onClick={() => {
                    scheduleMeeting();
                }}
                className='flex items-center gap-4 bg-[#044c69] hover:bg-cyan-700 text-white px-8 py-2 sm:w-[200px]'><FaRegCalendarPlus /> Schedule</button>
                <button 
                 onClick={() => {
                    joinMeeting();
                }}
                className='flex items-center gap-4  bg-white hover:bg-gray-300 text-black px-8 py-2  sm:w-[200px]'><FaRegPlusSquare />Join</button>
            </div>
            <div className='flex justify-center w-1/2'>
            {/* "https://cdn.dribbble.com/users/5031392/screenshots/16363958/media/4515f2c0141e34521dd98a29b8f29960.png?resize=400x0" */}
                <img className='w-full' src={bgImg} alt="" />
            </div>
        </div>
    </div>
    
    </div>
  )
}

export default Home