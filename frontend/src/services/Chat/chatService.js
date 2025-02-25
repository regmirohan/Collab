import {socket} from '../../components/MeetingRoom/VideoRoom'
// Keep track of messages even when chat isn't visible
let messageBuffer = [];

export async function message(text, name){
   
    console.log('socket: ', socket);
  
        try {
            console.log('Sending message:', text);
            socket.emit('chat', {
                content: text,
                sender: name,
                timestamp: Date.now(),
                socketId: socket.id
            });
        } catch (error) {
            console.error('Error sending message:', error);            
        }         
   
}

// Initialize listeners once, outside of component
export function initializeChatListeners(onMessageReceived) {
    // Listen for previous messages
    socket.on('prevMsg', ({messages, userId}) => {
        console.log('prevMsg: ', messages);
        if (onMessageReceived) {
            onMessageReceived(messages, socket.id, userId);
        } else {
            // Store messages if no handler is available
            messages.forEach(msg => messageBuffer.push({msg, socketId: socket.id, userId}));
        }
    });

    // Listen for new messages
    socket.on('recvChat', ({msg, userId}) => {
        console.log('msg received: ', msg);
        if (onMessageReceived) {
            onMessageReceived(msg, socket.id, userId);
        } else {
            // Store message if no handler is available
            messageBuffer.push({msg, socketId: socket.id, userId});
        }
    });
}

// Function to get and clear buffered messages
export function getBufferedMessages() {
    const messages = [...messageBuffer];
    messageBuffer = [];
    return messages;
}

// export async function recvChat(recvMessage){
//     socket.on('prevMsg',({messages,userId}) => {
//         console.log('prevMsg: ',messages)
//         recvMessage(messages,socket.id,userId);
//     })
//     socket.on('recvChat',({msg,userId}) => {
//         console.log('msg received: ',msg);
//        recvMessage(msg,socket.id,userId);
//         // displayMessage(msg,socket.id,userId);
//     })
   
// } 