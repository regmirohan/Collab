import React, { useEffect, useRef, useState } from 'react'
import {message} from '../../services/Chat/chatService'
import { LuSendHorizontal } from "react-icons/lu";
import axios from 'axios';
const Chat = ({msg,name,userId, remoteUserId}) => {
  if(userId == remoteUserId){
    return <div className='flex justify-end ' >
      <p className='bg-[#044c69] px-4 py-1 rounded mb-3'>{msg}</p>
  </div>
  }
  else{
    return <div className='flex justify-start ' >
      <p className='text-sm'>{name}</p>
    <p className='bg-zinc-700 px-4 py-1 rounded mb-3'>{msg}</p>
</div>
  }
  
}
const ChatRoom = ({messages}) => {
  const [msgInput, setMsgInput] = useState('');
  const [name, setName] = useState();
  // const [recvMsg, setRecvMsg] = useState([]);

  const chatRef = useRef({});
  useEffect(() => {
   const getUserName = async () => {
    const response = await axios.get('http://localhost:3000/api/rooms/getName',{
      withCredentials: true
    })
    if(response.data){
      console.log('name: ',response.data);
      setName(response.data.name);
    }
   }
   getUserName()
  }, [])
  
  
  const sendMessage = () => {
    message(msgInput, name)
    setMsgInput('');
    
  }
  
  // useEffect(() => {
  //   recvChat(recvMessage);
    
  // },[])
  useEffect(() => {
    if(chatRef.current){
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages])
  
  return (
    <div className='flex'>
      <div className='flex text-white p-8 h-screen w-[350px]'>       
        <div className='bg-zinc-800 w-full p-4 rounded-xl flex flex-col justify-end gap-6'>
          <div id='scroll' ref={ chatRef } className='text-xl flex flex-col gap-4 overflow-y-auto'>
            {messages.map((msg,index) => {
              return <Chat key={index} msg={msg.content} name={msg.sender} userId={msg.userId} remoteUserId={msg.remoteUserId}/>
            })}            
          </div>
          <div className='flex '>
              <input
              value={msgInput}
              onChange={(e) => {
                setMsgInput(e.target.value);
              }} 
              className=' text-white bg-zinc-700 outline-none p-2 lg:p-4 w-full' placeholder='write a message' type="text"/>
              <button
              onClick={sendMessage}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className='bg-[#044c69] px-4 py-2 flex items-center gap-1'>Send<LuSendHorizontal /></button>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default ChatRoom