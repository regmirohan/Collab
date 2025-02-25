import { createClient } from 'redis';
const client  = createClient({url: "redis://127.0.0.1:6379"});

// Connect to Redis
(async () => {
    try {
        await client.connect();
        console.log("Connected to Redis");
    } catch (err) {
        console.error("Redis connection error:", err);
    }
})();
async function joinChatRoom(data, socket,io,userId){
    // the socket of specific client that is passed is used
   
    socket.join(data.roomId);
    console.log('a client joined the room: ',data.roomId);
    const messages = await receivePrevMessage(data.roomId);
    console.log('messages redis: ',messages);
    socket.emit('prevMsg', {messages, userId});
    message(socket,io,userId,data.roomId);
   
}
function message(socket,io,userId,roomId){
    socket.on('chat',async (msg) => {
        await client.rPush(roomId, JSON.stringify(msg));
        console.log('msg sent: ',msg);
        io.to(roomId).emit('recvChat',{msg,userId});
    })
}
async function receivePrevMessage(roomId){
    const messages = await client.lRange(roomId, 0, -1);
    console.log('redis msg: ',messages);
    return messages.map(msg => JSON.parse(msg));
}
function fetchHistory(){

}

export { joinChatRoom, message, receivePrevMessage, fetchHistory };