import { useState } from 'react'
import Signin from './components/Auth/Signin'
import Signup from './components/Auth/Signup'
import Header from './components/Navbar/Header'
import Home from './pages/HomePage/Home'
import VideoRoom from './components/MeetingRoom/VideoRoom'
import ChatRoom from './components/MeetingRoom/ChatRoom'
import ConferenceRoom from './components/MeetingRoom/ConferenceRoom'
import JoinRoom from './components/Meeting/JoinRoom'
import Schedule from './components/Meeting/Schedule'
import ScheduleDetails from './components/Meeting/ScheduleDetails'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './components/AdminDashboard/AdminLogin'
import SearchBox from './components/Navbar/SearchBox'
import Sidebar from './components/AdminDashboard/Sidebar'
import UserManagement from './components/AdminDashboard/User/UserManagement'
import MeetingManagement from './components/AdminDashboard/Meeting/MeetingManagement'
import Settings from './components/AdminDashboard/Settings'
import Dashboard from './components/AdminDashboard/Dashboard'
import RoomManagement from './components/AdminDashboard/Room/RoomManagement'
import UserForm from './components/AdminDashboard/User/UserForm'
import MeetingForm from './components/AdminDashboard/Meeting/MeetingForm'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ChangePassword from './components/Auth/ChangePassword'
import Setting from './pages/Settings/Setting'
import OTP from './components/Auth/OTP'



function App() {
 
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/signin' element={<Signin />}></Route> 
      <Route path='/otp' element={<OTP />}></Route>   
      <Route path='/changepassword' element={<ChangePassword />}></Route>         
      <Route path='/admin/login' element={<AdminLogin />}></Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path='/settings' element={<Setting />}></Route>
        <Route path='/meetingroom' element={<ConferenceRoom />}></Route>
        <Route path='/chatroom' element={<ChatRoom />}></Route>
        <Route path='/schedulemeeting' element={<Schedule />}></Route>
        <Route path='/meetingdetails' element={<ScheduleDetails />}></Route>
        <Route path='/joinmeeting' element={<JoinRoom />}></Route>       
        <Route path='/admin/dashboard' element={<Dashboard />}></Route>
        <Route path='/admin/rooms' element={<RoomManagement />}></Route>   
        <Route path='/admin/sidebar' element={<Sidebar />}></Route>
        <Route path='/admin/users' element={<UserManagement />}></Route>
        <Route path='/admin/userForm' element={<UserForm />}></Route>
        <Route path='/admin/meetings' element={<MeetingManagement />}></Route>
        <Route path='/admin/meetingForm' element={<MeetingForm />}></Route>
        <Route path='/admin/settings' element={<Settings />}></Route>     
      </Route>
     
      
      
     
      <Route path='/search' element={<SearchBox />}></Route>
     
    </Routes>
     
     
    </>
  )
}

export default App
