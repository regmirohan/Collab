import React, {useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pswVisible, setpswVisible] = useState(false);
    const pswref = useRef();
    const navigate = useNavigate();
    const checkSession = async () => {
      const response = await axios.get('http://localhost:3000/api/session/check',{
          withCredentials: true
      })
      console.log(response);
      return response.data
  }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,password
      },{
        withCredentials: true, // Include cookies
      });
      
      if(response.data.valid && response.data.role == 'user'){
        console.log('response: ',response.data.role);
        const data =  await checkSession();
        if(data.loggedIn){
            // console.log(data.user)
            navigate('/')
        }       
        else{
            console.log(data.user)
            navigate('/signin');
        }
        // navigate('/')
      }
      else if(response.data.valid && response.data.role == 'admin') {
        console.log('response: ',response.data.role);
        const data =  await checkSession();
        if(data.loggedIn){
            console.log(data.user)
            navigate('/admin/dashboard')
        }       
        else{
            console.log(data.user)
            navigate('/signin');
        }
        // navigate('/admin/dashboard')
      }
    }
    const togglePsw = (e) => {
      if(pswref.current.type == "password"){
        pswref.current.type =  "text";
        setpswVisible(true)
      }        
      else{
        pswref.current.type =  "password"
        setpswVisible(false)
      }
    }

    const handleForgotPassword = async () => {
      if(!email){
        alert('please enter your email to change password')
        return
      }
      

      const response = await axios.get(`http://localhost:3000/api/users/forgotPassword/${email}`,{
        withCredentials: true
      })
      console.log(response.data)
      if(response.data.success){
        let otp=''
        for(let i=1;i<=4;i++){
          otp += Math.floor(Math.random() * 10 )
        }
        console.log(otp)
        const response = await axios.post('http://localhost:3000/api/users/sendMail',{
          otp
        },{
          withCredentials: true
        })
        if(response.data.success){
          
          navigate('/otp', {state: {otp, email}})
        }
       
        // navigate('/changepassword', { state: {email}})
      }
      else{
        console.log(response.data)
      }
    }

  return (
    <div className='bg-[#044c69] flex h-screen w-screen items-center justify-center'>
        <div className='px-12 py-8 bg-white rounded-xl shadow-lg shadow-cyan-800'>
          <h1 className='text-3xl font-semibold  text-black '>Sign In</h1>
          <h1 className='border-b-2 border-black w-24'></h1>
            <form
            onSubmit={(e) => {
              handleSubmit(e)
            }}  
            required
            className='flex flex-col gap-4 mt-5 text-black'>
                <input 
                
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }} 
                required
                className='border-b-2 py-3 text-[1.2rem] placeholder:text-gray-500 outline-none' type="text"  placeholder='Email Address'/>
               <div className='flex justify-between items-center border-b-2 py-3'>
                <input
                  ref={pswref}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  required  
                  className='text-[1.2rem] placeholder:text-gray-500 outline-none' type="password" placeholder='Password'/>
                  {pswVisible? <FaRegEyeSlash size="15" onClick={togglePsw}/> : <FaRegEye size="15" onClick={togglePsw}/>}
                  {/* <FaRegEye size="15" onClick={togglePsw}/> */}
               </div>
               <p 
               onClick={handleForgotPassword}
               className='text-blue-600 text-md hover:text-blue-800 hover:cursor-pointer'>Forgot Password?</p>
                <button className=' w-full border-none text-white bg-[#044c69] py-2 px-6 rounded text-xl outline-none' type='submit'>Sign In</button>
                <p className='text-black'>Haven't registered yet? <span onClick={() => {
                  console.log('clicked')
                  navigate('/signup')
                }} className='text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 hover: cursor-pointer'> Register Now</span></p>
            </form>
        </div>
    </div>
  )
}

export default Signin