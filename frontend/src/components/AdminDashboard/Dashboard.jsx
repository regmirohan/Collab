import React, { useEffect, useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Sidebar from "./Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([])
 
  
  useEffect(() => {
    setData([])
    const checkSession = async () => {
      const response = await axios.get('http://localhost:3000/api/adminAuth/session/check',{
        withCredentials: true
      })
      return response.data.loggedIn
    }
   const getTotalUsers = async () => {
  const response = await axios.get('http://localhost:3000/api/admin/getUsers',{
        withCredentials: true
      });
      if(response.data){
        console.log(response.data)
        setData((prev) => [...prev,{label: "Total Users", value: response.data.length, color: "bg-yellow-500"}])
      }
    
   }
   const getActiveRooms = async () => {
   
      const response = await axios.get('http://localhost:3000/api/admin/activeSessions',{
        withCredentials: true
      });
      if(response.data){
        setData((prev) => [...prev,{label: "Active Rooms", value: response.data.length, color: "bg-green-500"}])
      }
    
   }
   const getCompletedRooms = async() => {
    const response = await axios.get('http://localhost:3000/api/admin/completedSessions',{
      withCredentials: true
    });
    if(response.data){
      setData((prev) => [...prev,{label: "Completed Meetings", value: response.data.length, color: "bg-blue-500"}])
    }
   }
   const getTotalMeetings = async () => {
   
      const response = await axios.get('http://localhost:3000/api/admin/getMeetings', {
        withCredentials: true
      });
      if(response.data){
        setData((prev) => [...prev,{label: "Total Meetings", value: response.data.length, color: "bg-purple-500"}])
      }
    
   }
   getTotalUsers()
   getTotalMeetings()
   getCompletedRooms()
   getActiveRooms()
   
  }, [])
  

  // Chart Data
  const chartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Active Sessions",
        data: [50, 60, 75, 100, 120, 110, 95],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      },
      {
        label: "Active Rooms",
        data: [10, 12, 15, 20, 25, 22, 18],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-white flex gap-4 w-full h-screen overflow-hidden relative">
        <Sidebar/>
        <div className="flex flex-col gap-4 p-4 w-[80%] h-screen absolute right-0">
        <h1 className="bg-[#044c69] w-full text-white text-2xl font-bold py-4 px-6 mb-2">Dashboard</h1>
            {/* Statistics Section */}
            <div className="flex justify-between">
              {/* {console.log(data)} */}
                {data.map((stat, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow-md text-white ${stat.color}`}
                >
                    <h2 className="text-xl font-semibold">{stat.label}</h2>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                ))}
            </div>

            {/* Graph Section */}
            <div className="flex justify-center w-[80%]">
              <div className="rounded-lg shadow-md w-full">
                  <h2 className="text-xl font-bold text-gray-800">Engagement Trends</h2>
                  <Line data={chartData} />
              </div>
            </div>
            
        </div>
      
    </div>
  );
};

export default Dashboard;
