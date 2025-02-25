import React from 'react'

const ParticipantList = ({participants}) => {
  return (
    <div className='text-white flex p-8 h-screen w-2/5'>
        
        <div className='bg-zinc-800 w-full p-4 rounded-xl flex flex-col justify-start gap-6'> 
            <h1 className='text-lg text-center px-4 py-2 underline underline-offset-8'>Participants</h1>
            <div className='p-2 '>
            {/* {console.log("participants: ",participants[0].name)} */}
            {participants.map((participant) => {
               return <h1 key={participant._id} className='text-md  p-2 hover:bg-zinc-900'>{participant.name}</h1> 
            })}
             {participants.length == 0 && ( <h1 className='text-md  p-2 hover:bg-zinc-900'>You</h1> )}
            
                
            </div>          
                       
        </div>
    </div>
  )
}

export default ParticipantList