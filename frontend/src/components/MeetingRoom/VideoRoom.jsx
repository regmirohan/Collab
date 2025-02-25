import React, { useEffect, useRef, useState } from 'react'
// import { startMeeting } from '../../services/MediaSoup/client'
import socket from "../../services/Socket/socket";
import { initializeDevice } from '../../services/MediaSoup/initializeDevice';
import { chatroom } from '../../services/MediaSoup/room';
import { forwardRef } from 'react';
import {useNavigate} from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AiTwotoneAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { FiVideo } from "react-icons/fi";
import { FiVideoOff } from "react-icons/fi";
import { IoPeopleSharp } from "react-icons/io5";
import { LuScreenShare } from "react-icons/lu";
import { IoChatbox } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";

const AudioStream = forwardRef(function AudioStream(props, remoteAudioRef){
    //  const remoteAudioRef = useRef(null);
    console.log('props id: ',props.id)
  useEffect(() => {
    if (remoteAudioRef.current[props.id] && props.mediaStream) {
      remoteAudioRef.current[props.id].srcObject = props.mediaStream;
    }
  }, [props.mediaStream]);

  return (
    <audio
      ref={(el) => (remoteAudioRef.current[props.id] = el)}
      defaultValue={props.type}
      autoPlay
    />
  );
})

const VideoStream = forwardRef(function VideoStream (props,remoteVideoRef) {
    
    console.log('props id: ',props.id)
   
  useEffect(() => {
    if (remoteVideoRef.current[props.id] && props.mediaStream) {
      remoteVideoRef.current[props.id].srcObject = props.mediaStream;
    }
  }, [props.mediaStream]);

  return (
    <video
    ref={(el) => (remoteVideoRef.current[props.id] = el)}
    defaultValue={props.type}
    autoPlay
    playsInline
    muted={false} // Change to true if you want the video to be muted
    className="rounded-xl min-w-[200px] max-w-full"
    />
  );
})

const VideoRoom = ({isChatVisible, toggleChat, handleParticipant}) => {
    const [remoteType, setRemoteType] = useState([]);
    const [producerTransport, setProducerTransport] = useState(null);
    const [remoteUserId, setRemoteUserId] = useState(null);
    const [pauseProducer, setPauseProducer] = useState(null);
    const [audioProducerPause, setAudioProducerPause] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [screenShared, setScreenShared] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef({});
    const remoteAudioRef = useRef({})
    const localAudioRef = useRef(null)
    const navigate = useNavigate();
    const location = useLocation();

    const addRemoteType = ({stream,type,id}) => {
        console.log('stream add: ',stream)
        console.log('type: ',type)        
        setRemoteType((prev) => [...prev, {stream,type,id}]) 
            
    }

    const leaveMeeting = (remoteUser) => {
        console.log(remoteUser)
        if(remoteUser){
            remoteVideoRef.current[remoteUser].remove();
            
        }
    }

    const disconnectSocket = () => {
        socket.disconnect();
        navigate('/');
        window.location.reload();
    }

    const disconnectServerSocket = async () => {
        const response = await axios.put('http://localhost:3000/api/meeting/updateStatus',{roomId, status: 'completed'},{
            headers: {
                'Content-Type': 'application/json',
              },
            withCredentials: true
          })
        const result = await axios.put('http://localhost:3000/api/rooms/updateStatus',{roomId, status: 'completed'},{
            headers: {
                'Content-Type': 'application/json',
              },
            withCredentials: true
          })
          console.log(response.data)
          console.log(result.data)
          if(result.data && response.data){
            console.log('end meeting')
            navigate('/');
            window.location.reload();
            socket.emit('endMeeting',roomId);
          }
       
    }

    const toggleVideo = () => {
        console.log('clicked')
        setIsVideoOn(!isVideoOn)
        // remoteVideoRef.current[socket.id].srcObject.getVideoTracks()[0].enabled = false;

        socket.emit('pauseVideoProducer',socket.id, async ({value}) => {
            if(value){
                if(pauseProducer.paused){
                  
                    localVideoRef.current.srcObject.getVideoTracks()[0].enabled = true;
                    pauseProducer.resume();
                   
                   
                    console.log('video resumed')
                }
                else{
                    localVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
                        track.enabled = false;
                    })
                    pauseProducer.pause();
                    console.log('video paused');
                }
                
            }
            
        })
    }

    const toggleAudio = () => {
        setIsAudioOn(!isAudioOn)
        // remoteAudioRef.current.srcObject.getAudioTracks()[0].enabled = false;
        socket.emit('pauseAudioProducer',socket.id, async ({value}) => {
            if(value){
                if(audioProducerPause.paused){
                  
                    // localAudioRef.current.srcObject.getAudioTracks()[0].enabled = true;
                    audioProducerPause.resume();
                   
                   
                    console.log('audio resumed')
                }
                else{
                    // localAudioRef.current.srcObject.getAudioTracks().forEach((track) => {
                    //     track.enabled = false;
                    // })
                    audioProducerPause.pause();
                    console.log('audio paused');
                }
                
            }
            
        })
    }

    const toggleButtons = () => {
        setIsOpen(!isOpen)
    }

    const displayMediaOptions = {
        video: {
          displaySurface: "window",
        },
        audio: {
          suppressLocalAudioPlayback: false,
        },
        preferCurrentTab: false,
        selfBrowserSurface: "exclude",
        systemAudio: "include",
        surfaceSwitching: "include",
        monitorTypeSurfaces: "include",
    };


    let rtpCapabilities;
    let device;
    let sendTransport;
    let recvTransport;
    let videoProducer;
    let audioProducer;
    let screenProducer;
    let stream;
    let consumer;
    let consumerTransports = [];
    let videostream;

    const {roomId} = location.state;
    const {role} = location.state;
    console.log('roomid: ',roomId);
    const userName = "Pratik"
    useEffect(() => {
        const setStatus = async() => {
            if(role && roomId){
                setIsHost(true)
                const response = await axios.put('http://localhost:3000/api/meeting/updateStatus',{roomId, status: 'active'},{
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    withCredentials: true
                  })
                alert('you are a host now')
             }
             else{
                setIsHost(false)
                alert('you are a participant')
             }
        }
        setStatus()
    
    }, [])
    
    
    useEffect(() => {
       console.log('remotetype: ',remoteType)
    }, [remoteType]);

    useEffect(() => {
        // connect the socket
        const init = async () => {
            socket.connect();      
        
        //get your local media stream
       
        //   localVideoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
        

        //load device
                rtpCapabilities = await chatroom(roomId, userName);
                console.log('routerRtpCapabilities: ',rtpCapabilities);
                device = await initializeDevice();
                console.log('device: ',device);
                // console.log('rtpCapabilities: ',rtpCapabilities);
                const routerRtpCapabilities = rtpCapabilities;
                await device.load({routerRtpCapabilities});
                console.log('device rtpCapabilities',device.rtpCapabilities);
                
                createSendTransport();
        
        socket.on('newProducer',({producerId}) => {
            console.log("inform about new producer: ",producerId);
            newConsumer(producerId);
        })
        socket.on('producer-closed', (remoteProducerId) => {
            // server notification is received when a producer is closed
            // we need to close the client-side consumer and associated transport
            console.log('producer-closed event: ',consumerTransports);
            console.log('remoteProducerId: ',remoteProducerId);
            const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId);
            console.log('producerToClose: ',producerToClose);
            producerToClose.recvTransport.close()
            producerToClose.consumer.close()
            
            // remove the consumer transport from the list
            consumerTransports = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)
            leaveMeeting(socket.id);
            // remove the video div element
            // document.querySelector('.video').removeChild(document.getElementById(`td-${remoteProducerId}`));
          })
     
    }
    init();
    return () => {
        socket.close();
      };
    }, [])


// async function handleParticipant(){
//     console.log("roomId: ",roomId);
//     const response = await axios.post('http://localhost:3000/api/rooms/participants', {
//     roomId
//     },{
        
//         withCredentials: true
//     });
//     if(response){
//         setIsParticipantVisible(!isParticipantVisible);
//         console.log('response: ',response.data);
//         const users = response.data;
//         users.forEach(user => {
//             if(user.participants){
//               user.participants.forEach(participant => {
//                 setParticipants(participant.name);
//                     console.log('name: ',participant.name);
//                 }); 
                
//             }
//         })
        
//     }
// }
    
    // create send transport
    async function createSendTransport(){
        if(!device)
            console.log("Device not initialized");
    
        socket.emit('createTransport',{rtpCapabilities: device.rtpCapabilities,consumer: false},async (params) => {
            console.log("Params from send tranport: ",params);
            try{
                sendTransport = await device.createSendTransport(params);
                setProducerTransport(sendTransport);
                sendTransport.on('connect',async ({dtlsParameters},callback,errback) => {
                    console.log("dtlsparameters: ",dtlsParameters);
                    try{
                        console.log("producer connect event")
                        socket.emit('producer-connect',{
                            id: sendTransport.id,
                            dtlsParameters
                        })
                        callback();
                    } catch(err){
                        console.log("Error emitting produce-connect: ",err);
                        errback(err);
                    }
                })
    
                sendTransport.on('produce',async (parameters,callback,errback) => {
                    try{
                        console.log('produce event: ',parameters)
                        const { id } = socket.emit('produce',{
                            id: sendTransport.id,
                            kind: parameters.kind,
                            appData: parameters.appData,
                            rtpParameters: parameters.rtpParameters
                        },({id,producerExists}) => {
                            console.log("producer exists: ",producerExists);
                            callback({id});
    
                            if(producerExists) getProducers();
                        }) 
                        
                    } catch(err){
                        errback(err);
                    }
                })
    
                sendTransport.on('icestatechange',(state) => {
                    console.log("IceStateChange: ",state);
                })
    
                sendTransport.on('connectionstatechange',(state) => {
                    console.log("ConnectionStateChange: ",state);
                })
    
                await produceMedia();
    
            } catch(err){
                console.log("Error creating sendTransport: ",err);
            }
            
        })
       
    }
    //produce media
    async function produceMedia(){
        console.log("producing media")
        stream = await navigator.mediaDevices.getUserMedia({video: {frameRate: 15}, audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
            suppressLocalAudioPlayback: true,
        }});
        localVideoRef.current.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        
       
      
        try{
            console.log('before producing')
            videoProducer = await sendTransport.produce({
                track: videoTrack,
                appData: { type: 'webcam'},
                encodings: [
                    { maxBitrate: 100000 }, // Low resolution
                    { maxBitrate: 300000 }, // Medium resolution
                    { maxBitrate: 900000 }, // High resolution
                ],
                codecOptions: {
                    videoGoogleStartBitrate: 1000
                }              
    
            });
            setPauseProducer(videoProducer);
            audioProducer = await sendTransport.produce({track: audioTrack,appData: { type: 'audio'}});
            
            setAudioProducerPause(audioProducer);
            console.log("produced media")
            
        } catch(err){
            console.log("error in producing media: ",err);
        }  
        videoProducer.on('trackended',() => {
            console.log('A track ended.');
        })
        videoProducer.on('transportClose', () => {
            console.log('video transport ended');
        })
    }
    async function shareScreen(){
     
        console.log('share screen')
        const screenCapture = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        console.log('screen capture: ',screenCapture);
        
        if(screenCapture){
            console.log('producing screen capture')
            const screenTrack = screenCapture.getVideoTracks()[0];
            console.log('screen track: ',screenTrack)
            // Listen for the 'ended' event on the video track
            screenTrack.onended = () => {
               
                socket.emit("stopScreen",{}, async ({producer}) => {
                    console.log("Screen sharing stopped by the user:", producer);
                })
               
                // handleStopSharing(); // Your custom logic when sharing stops
            };
            console.log('send transport : ',producerTransport)
            try{
                screenProducer = await producerTransport.produce({
                    track: screenTrack,
                    appData: {type: 'screen'}
                   
                });
                setScreenShared(true);
            }catch(err){
                console.log("screen capture failed: ",err);
            }
            
            console.log('screen shared');
        }
        
     }
        
        
    

    //get producers list
    async function getProducers(){
        console.log('producer exists');
        socket.emit('getProducers',{},({producerList}) => {
            console.log("Producer ids: ",producerList);
            producerList.forEach(element => {
                console.log("you are both producer and consumer")
                newConsumer(element);
            });
        })
    }
    //new consumer
    let consumingTransports = [];
async function newConsumer(remoteProducerId){
    if(!device)
        console.log("Device not initialized");
    if(consumingTransports.includes(remoteProducerId)) 
        {
            console.log("already consumed");
            return;
            
        }
        else{
            console.log('pusing into consuming transports')
            consumingTransports.push(remoteProducerId);
        }
    
   
        
            socket.emit('createTransport',{rtpCapabilities: device.rtpCapabilities,consumer: true},async (params) => {
        
                try{                
                    recvTransport = await device.createRecvTransport(params);
                    console.log("recv transport created: ",params);

                    recvTransport.on('connect',async ({dtlsParameters},callback,errback) => {
                        try{
                            console.log('consumer connect');
                            socket.emit('consumer-connect',{    

                                dtlsParameters,
                                consumerTransportId: params.id
                            })
                            callback();
                        } catch(err){
                            console.log("Error emitting consumer-connect: ",err);
                            errback(err);
                        }
                    })
               
                    recvTransport.on('connectionstatechange',(state) => {
                        console.log("Consumer ConnectionStateChange: ",state);
                    })

                    console.log("calling consume");                  
                    console.log("remote producer id: ",remoteProducerId);

                    await consume(remoteProducerId,params.id,recvTransport);              
                  
                    
                } catch(err){
                    console.log("error in recv transport: ",err);
                }
            })  
    
}


  
// consumer 
async function consume(remoteProducerId,consumerTransportId,recvTransport){
    console.log("consume...");
        socket.emit('consume',{rtpCapabilities: device.rtpCapabilities,remoteProducerId,consumerTransportId},async (params) => {
            try{
                console.log("before consuming")
                console.log('producerId: ',params.producerId);

                consumer = await recvTransport.consume({
                    id: params.id,
                    producerId: params.producerId,
                    kind: params.kind,
                    rtpParameters: params.rtpParameters
                });
                consumerTransports = [
                    ...consumerTransports,
                    {
                        recvTransport,
                        consumer,
                        producerId: remoteProducerId,
                        serverConsumerTransportId: consumerTransportId
                    }
                ]
                console.log('track')
                // Render the remote video track into a HTML video element.
                const { track } = consumer;
                console.log(track);                             

                const stream = new MediaStream([ track ]);

                addRemoteType({stream,type:params.kind, id: socket.id});
                setRemoteUserId(socket.id);
                // console.log('remote type: ',remoteType)
                if(videostream){
                    console.log('remote stream: ',videostream);
                    // remoteVideoRef.current.srcObject = stream;
                }
                socket.emit('resume',params.id);
            } catch(err){
                console.log("error consuming: ",err);
            }
        })        
    
}

  return (
    <div className='h-screen p-8 w-full'>
        <div className='bg-zinc-800 w-full h-[90%] flex justify-center items-center gap-2 p-1 rounded-2xl'>
            <video
            id='localVideo'
            ref={localVideoRef}
            className='rounded-xl min-w-[200px] max-w-full'
            autoPlay playsInline ></video>
            
                          
            {remoteType.filter((elem) => elem.type == 'video').map(({stream,type,id}) => {
            
                return <VideoStream key={stream.id}  mediaStream={stream} type={type} id={id} ref={remoteVideoRef}/>                
            })}
           
            {/* <div>                   
            {remoteType.filter((elem) => elem.type == 'screen').map(({stream,type}) => {
                return <VideoStream key={stream.id} mediaStream={stream} type={type} />                
            })}
            </div>  */}
           
            {remoteType.filter((elem) => elem.type == 'audio').map(({stream, type, id}) => {
               return <AudioStream key={stream.id} mediaStream={stream} type={type} id={id} ref={remoteAudioRef}/>        
            
            })}          
            
        </div>
        
        <div className='flex justify-between items-center mt-4 text-white text-sm md:text-md gap-2 md:gap-4'>
            <div className='flex gap-1 md:gap-2'>
                <button 
                onClick={toggleAudio}
                className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'>{isAudioOn? <AiTwotoneAudio size='20'/> : <AiOutlineAudioMuted size='20'/>}Audio</button>
                <button 
                onClick={toggleVideo}
                className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'>{isVideoOn?<FiVideo size='20'/> : <FiVideoOff size='20'/>}Video</button>
            </div>
            {/* for larger screens */}
            <div className='hidden min-[990px]:flex justify-between items-center gap-1 md:gap-2'>
                <button
                onClick={shareScreen}
                className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'><LuScreenShare size='20'/>Share Screen</button>
                <div >
                   {/* {isParticipantVisible && <ParticipantList participants={participants}/>}  */}
                    <button 
                    onClick={() => {
                        handleParticipant(roomId)
                    }}
                    className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'><IoPeopleSharp size='20'/>Participants</button>
                    
                </div>
                <button 
                onClick={toggleChat}
                className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'
                ><IoChatbox size='20'/>Chats</button>
                 
            </div>
            {/* for smaller screens */}
            <div className='min-[990px]:hidden'>
                <button 
                onClick={toggleButtons}
                className='bg-[#044c69] p-2 md:px-4 md:py-2'>More</button>
                { isOpen && (
                     <div className='absolute bottom-20 bg-zinc-900 p-2 w-36'>
                     <button
                     onClick={shareScreen}
                     className='block p-2 md:px-4 md:py-2 hover:bg-[#044c69]'>Share Screen</button>
                    
                    <button 
                    onClick={() => {
                        handleParticipant(roomId)
                    }}
                    className='block p-2 md:px-4 md:py-2 hover:bg-[#044c69]'>Participants</button>
                         
                    
                     <button 
                     onClick={toggleChat}
                     className='block p-2 md:px-4 md:py-2 hover:bg-[#044c69]'
                     >Chats</button>
                      
                 </div>
                )}
            </div>
            <div className='flex gap-1 md:gap-2'>
                <button 
                onClick={disconnectSocket}
                className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'><IoIosCloseCircle size='20'/>Leave</button>
                {isHost && (<button 
                onClick={disconnectServerSocket}
                className='bg-[#044c69] p-2 md:px-4 md:py-2 flex flex-col items-center'><IoIosCloseCircle size='20'/>End</button>)}
            </div>
        </div>
    </div>
  )
}

export default VideoRoom
export {socket}
