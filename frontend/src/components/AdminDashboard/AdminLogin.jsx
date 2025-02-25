import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const checkSession = async () => {
      const response = await axios.get('http://localhost:3000/api/adminAuth/session/check',{
          withCredentials: true
      })
      console.log(response);
      return response.data
  }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await axios.post('http://localhost:3000/api/adminAuth/login', {
        email,password
      },{
        withCredentials: true, // Include cookies
      });
      console.log('response: ',response)
      if(response.data.isAdmin){
        console.log('response: ',response.data);
        const data =  await checkSession();
        if(data.loggedIn){
            console.log(data)
            navigate('/admin/dashboard');
        }
        else{
            console.log(data.user)
            // navigate('admin/login');
        }
        navigate('/admin/dashboard')
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
            className='flex flex-col gap-5 mt-5 text-black'>
                <input 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }} 
                required
                className='border-b-2 py-3 text-[1.2rem] placeholder:text-gray-500 outline-none' type="text"  placeholder='Email Address'/>
                <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required  
                className='border-b-2 py-3  text-[1.2rem] placeholder:text-gray-500 outline-none' type="password" placeholder='Password'/>
                <button className=' w-full border-none text-white bg-[#044c69] py-2 px-6 rounded text-xl outline-none' type='submit'>Sign In</button>
                {/* <p className='text-black'>Haven't registered yet? <span onClick={() => {
                  console.log('clicked')
                  navigate('/signup')
                }} className='text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 hover: cursor-pointer'> Register Now</span></p> */}
            </form>
        </div>
    </div>
  )
}

export default AdminLogin