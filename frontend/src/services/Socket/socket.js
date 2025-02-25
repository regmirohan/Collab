import React from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3000',{
    autoConnect: false
});
socket.on('connect', () => {
    console.log('A client connected: ',socket.id);
})

export default socket