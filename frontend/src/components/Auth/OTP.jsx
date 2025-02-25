import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const OTP = () => {
    // const [input, setInput] = useState("")
    const [input, setInput] = useState(new Array(4).fill(""))
    const [otpError, setOtpError] = useState(null)
    const otpRef = useRef([])
    const navigate = useNavigate()
    const location = useLocation();
    const { otp, email } = location.state

    const handleChange = (value, index) => {
      let newArr = [...input];
      newArr[index] = value;
      // setOtp(newArr);
        setInput(newArr)
        if(value && index < 3){
          otpRef.current[index + 1].focus()
        }
    }
    function handleBackspaceAndEnter(e, index) {
      if(e.key === "Backspace" && !e.target.value && index > 0){
        otpRef.current[index - 1].focus()
      }
      if(e.key === "Enter" && e.target.value && index < 3){
        otpRef.current[index + 1].focus()
      }
    }
    const handleSubmit = () => {
       if(otpError)
        return
      else{
        navigate('/changepassword', { state: {email}})        
      }
    }
    useEffect(() => { 
      if(input.join("") !== "" && input.join("") !== otp){
        setOtpError("Wrong OTP Please Check Again")
      }else{
        setOtpError(null)
      } 
     }, [input]);
  return (
    <div className='bg-[#044c69] h-screen flex justify-center items-center gap-4'>       
      <div className='flex flex-col gap-6 w-[300px] bg-white p-6 rounded-md'>
        <h1 className='text-lg font-medium'>Enter OTP sent on your email</h1>
                <div className='flex items-center gap-4'>
                  {input.map((digit,idx) => {
                     return <input
                      key={idx}
                      value={digit}
                      onChange={(e) => {
                        handleChange(e.target.value, idx)
                      }}
                      onKeyUp={(e)=> handleBackspaceAndEnter(e, idx)}
                      ref={(reference) => (otpRef.current[idx] = reference)}
                      className='border-2 border-black rounded-md w-[20%] outline-none p-4'
                      maxLength={1}
                      type="text" />
                  })}
                  
                </div>
               { otpError && ( <p className={`text-sm text-red-600 mt-4 ${otpError ? 'error-show' : ''}`}>{otpError}</p>)}
                <button 
                onClick={handleSubmit}
                className='p-2 bg-[#044c69] text-white text-xl cursor-pointer'>Submit</button>
        </div>
    </div>
  )
}

export default OTP