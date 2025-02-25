import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";


const ChangePassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pswVisible, setpswVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()
    const location = useLocation()

    const pswref = useRef()
    const confirmref = useRef()


    const email = location.state.email;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password != confirmPassword){
            setErrors({match: 'Password do not match'})
            return
        }
        if(password.length < 8){
          setErrors({length: 'Password must be at least 8 characters long'})
          return
        }
       
        const response = await axios.put(`http://localhost:3000/api/users/changePassword/${email}`, {
          password
        },{
          withCredentials: true, // Include cookies
        });
        
        if(response.data.success){
          console.log('response: ',response.data);
          navigate('/signin')
        
        }
       
      }
      const togglePsw = () => {
        if(pswref.current.type == "password"){
          pswref.current.type =  "text";
          setpswVisible(true)
        }        
        else{
          pswref.current.type =  "password"
          setpswVisible(false)
        }
      }
      const toggleConfirmPsw = () => {
        if(confirmref.current.type == "password"){
          confirmref.current.type =  "text";
          setConfirmVisible(true)
        }        
        else{
          confirmref.current.type =  "password"
          setConfirmVisible(false)
        }
      }
  
  return (
     <div className='bg-[#044c69] flex h-screen w-screen items-center justify-center'>
            <div className='px-12 py-8 bg-white rounded-xl shadow-lg shadow-cyan-800'>
              <h1 className='text-3xl font-semibold  text-black '>Change Password</h1>
              <h1 className='border-b-2 border-black w-24'></h1>
                <form
                onSubmit={(e) => {
                  handleSubmit(e)
                }}  
                required
                className='flex flex-col gap-4 mt-5 text-black'>
                   
                   <div className='flex justify-between items-center border-b-2 py-3'>
                    <input
                      ref={pswref}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      required  
                      className='text-[1.2rem] placeholder:text-gray-500 outline-none' type="password" placeholder='New Password'/>
                      {pswVisible? <FaRegEyeSlash size="15" onClick={togglePsw}/> : <FaRegEye size="15" onClick={togglePsw}/>}
                   </div>
                   {errors.length && ( <p className='text-red-600 text-md'>{errors.length}</p> )}
                   <div className='flex justify-between items-center border-b-2 py-3'>
                    <input
                      ref={confirmref}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                      }}
                      required  
                      className='text-[1.2rem] placeholder:text-gray-500 outline-none' type="password" placeholder='Confirm Password'/>
                      {confirmVisible? <FaRegEyeSlash size="15" onClick={toggleConfirmPsw}/> : <FaRegEye size="15" onClick={toggleConfirmPsw}/>}
                   </div>
                      {errors.match && ( <p className='text-red-600 text-md'>{errors.match}</p> )}
                    <button className=' w-full border-none text-white bg-[#044c69] py-2 px-6 rounded text-xl outline-none cursor-pointer' type='submit'>Save</button>
                   
                </form>
            </div>
        </div>
  )
}

export default ChangePassword