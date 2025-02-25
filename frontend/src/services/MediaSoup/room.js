import {socket} from '../../components/MeetingRoom/VideoRoom'
export async function chatroom(roomId,username){
    // const socket  = getSocket();
    // socket.on('prevMsg',({messages,userId}) => {
    //     displayMessage(messages,socket.id,userId);
    // })
    console.log(`imported room id ${roomId} and username ${username}`);
    console.log('chatroom socket: ',socket);
    const rtpCapabilities = await new Promise((resolve,reject) => {
            socket.emit('room',{
                roomId: roomId,
                name: username
            },(data) => {
            if(data && data.rtpCapabilities){

                console.log('data: ',data.rtpCapabilities);
                // rtpCapabilities = data.rtpCapabilities;
                resolve(data.rtpCapabilities);
            }
            else{
                reject(new Error('Failed to get response'));
            }
         });
    })
    
    console.log('rtpCapabilities: ',rtpCapabilities);
    return rtpCapabilities;
}