// import io from 'socket.io';
import { createWorker, createRoom } from './mediaSoupService.js';
import { joinChatRoom } from './chatservice.js';
import  Schedule  from '../models/schedule.model.js';



let peers = {};
let rooms = {};
let rtpCapabilities;
let transport;
let transports = [];
let producers = [];
let consumers = [];
let producer;
let consumer;
async function createWebRtcTransport(router){
    return new Promise(async (resolve, reject) => {
        try{
            const transport = await router.createWebRtcTransport(
                {
                    listenInfos :
                    [
                      {
                        ip               : "0.0.0.0", 
                        announcedIp      : "127.0.0.1"
                        
                      }
                    ],
                    enableUdp    : true,
                    enableTcp    : true,
                    preferUdp    : true
                  }
            )
            transport.on('icestatechange',(state) => {
                console.log(`IceStateChange: ${state}`);
            })
            transport.on('dtlsstatechange',(state) => {
                console.log(`dtlsStateChange: ${state}`);
                if (state === 'closed') {
                    console.log('closed')
                    transport.close()
                  }
            })
            transport.on('close', () => {
                console.log('transport closed')
              })
            console.log("Rooms: ",rooms);
            resolve(transport);
        } catch(err){
            console.log("Cannot create transport: ",err);
            reject(err);
        }
    })
   
    
    
}

export async function initialize(io){
    io.on('connection',async (socket) => {
        const userId = socket.id;
        socket.emit('connection-success',userId);
        console.log(`A user connected: ${socket.id}`);
        const removeItems = (items,socketId, type) => {
            console.log('remove item')
            items.forEach(item => {
                if (item.socketId === socketId) {
                  item[type].close()
                }
              })
              items = items.filter(item => item.socketId !== socket.id)
          
              return items
        }
        socket.on('endMeeting', (id) => {
            io.in(id).disconnectSockets(true);
            console.log('meeting ended');
            
        })
        socket.on('pauseVideoProducer', async (userId,callback) => {
            const [pauseProducer] = producers.filter((data) => data.socketId == userId && data.kind == 'video');
            
            if(pauseProducer){
                console.log('pause video producer: ',pauseProducer.producer)
                // pauseProducer.producer.pause();
            }
            
            callback({value: true});
        })
        socket.on('pauseAudioProducer', async (userId,callback) => {
            const [audioProducer] = producers.filter((data) => data.socketId == userId && data.kind == 'audio');
            
            if(audioProducer){
                console.log('pause audio producer: ',audioProducer.producer)
                // pauseProducer.producer.pause();
            }
            
            callback({value: true});
        })
        socket.on('disconnect', () => {
            console.log(' A User disconnected: ',socket.id);           
            console.log('transport: ',transports)
            // const transport = transportObj.transport;
            const transportObj1 = transports.filter(transportData => transportData.socketId === socket.id && !transportData.consumer);
            console.log("transportObj1: ",transportObj1);
            let prodTransport;
            if(!transportObj1){
                prodTransport = transportObj1[0].transport;
                console.log('prodtransport: ',prodTransport);

                    // Close the transport
                    prodTransport.close(); // This will trigger the 'dtlsstatechange' event
                   // Add listener for DTLS state changes
                    prodTransport.on('dtlsstatechange', (state) => {
                     console.log(`DTLS state changed to: ${state}`);
                     
                     // Close transport if DTLS state is 'closed'
                     if (state === 'closed') {
                       prodTransport.close();
                       console.log('Transport closed');
                     }
                   });
            }
           
            const transportObj2 = transports.filter(transportData => transportData.socketId === socket.id && transportData.consumer);
            let consTransport;
            if(!transportObj2){
                console.log('transportObj2: ',transportObj2);
                consTransport = transportObj2[0].transport;
                 // Close the transport
                 consTransport.close(); // This will trigger the 'dtlsstatechange' event
                 // Add listener for DTLS state changes
                  consTransport.on('dtlsstatechange', (state) => {
                   console.log(`DTLS state changed to: ${state}`);
                   
                   // Close transport if DTLS state is 'closed'
                   if (state === 'closed') {
                     consTransport.close();
                     console.log('Transport closed');
                   }
                 });
            }
         
            consumers = removeItems(consumers, socket.id, 'consumer');
            producers = removeItems(producers, socket.id, 'producer');
            transports = removeItems(transports, socket.id, 'transport');
            if(peers[socket.id]){
                const {roomId} = peers[socket.id];
                delete peers[socket.id];

                rooms[roomId] = {
                    router: rooms[roomId].router,
                    peers: rooms[roomId].peers.filter(socketId => socketId !== socket.id)
                }
            }
            
          
                
            
           
        })
       socket.on('stopScreen',async (_,callback) => {
        // producers.map(({producer}) => {
        //     console.log('appData: ',producer.track)
        // })
        const [producer] = producers.filter(producer => producer.socketId === socket.id && producer.appData.type == "screen");
            console.log('producer:',producer);
            producer.producer.close();
            callback(producer);
       })
        socket.on('room',async (data,callback) => {
          
            const roomId = data.roomId;
            const checkId = await Schedule.findOne({meetingId: roomId});
            if(!checkId){
                console.log('id not found');
                return;
            } 
            joinChatRoom(data,socket,io,userId);
            const router1 = await createRoom(data.roomId,socket.id,rooms);
            peers[socket.id] = {
                socket,
                roomId,           // id for the Router this Peer joined
                transports: [],
                producers: [],
                consumers: [],
                peerDetails: {
                  name: '',
                  isAdmin: false,   // Is this Peer the Admin?
                }
            }
    
            rtpCapabilities = router1.rtpCapabilities;
            // console.log('rtpCapabilities: ',rtpCapabilities);
            callback({rtpCapabilities});          
         
        })
            
    
        socket.on('createTransport',async({rtpCapabilities,consumer},callback) => {
            const roomId = peers[socket.id].roomId;
            const router = rooms[roomId].router;
            // console.log("room id in ct: ",roomId);
            try{            
                transport = await createWebRtcTransport(router);
                // console.log(`Producer Transport created: ${transport}`);
    
                // add transport to the transports array
                transports = [
                    ...transports,
                    {socketId: socket.id,transport,roomId,consumer}
                ]
                // add tranport to the peers obj
                peers[socket.id] = {
                    ...peers[socket.id],
                    transports: [...peers[socket.id].transports, transport]
                }
                // peers[socket.id].transports.push(transport);
               
                // console.log("peers: ",peers);
                // console.log("transports: ",transports);
                callback({
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters:transport.dtlsParameters
                })
            } catch(err){
                console.log(`Error creating transport: ${err}`);
            }
           
        })
    
        // getting the producers except ourself from producers array
        socket.on('getProducers',(_,callback) => {
            const roomId = peers[socket.id].roomId;
            let producerList = [];
            producers.forEach(producerData => {
                if(producerData.socketId != socket.id && producerData.roomId == roomId)
                {
                    producerList = [
                        ...producerList,
                        producerData.producer.id
                    ]
                }
            })
            console.log('producerList: ',producerList);
            callback({producerList});
        })
    
        socket.on('producer-connect',async ({dtlsParameters}) => {
            // const producerTransport = peers[socket.id].transports;
            const [producerTransport] = transports.filter(transport => transport.socketId === socket.id && !transport.consumer)
            // console.log('producerTransport: ',producerTransport);
           
            try{
                await producerTransport.transport.connect({dtlsParameters});
                // console.log("dtlsParameters: ",producerTransport.transport.dtlsParameters);
               
            } catch(err){
                console.log('error connecting ',err);
            }
            // console.log(`producer-connect event: ${producerTransport.dtlsParameters}`);
        })
    
        //when the new producer is found inform the consumers 
        function informConsumers(producerId,socketId, roomId){
            let producerLists = [];
            // producerLists = producers.find(producerData => (producerData.socketId != socketId && producerData.roomId == roomId)).producer;
            console.log("inform about new producer");
            // socket.emit('newProducer',producerLists.id);
            producers.forEach(producerData => {
                if (producerData.socketId !== socketId && producerData.roomId === roomId) {
                //   const producerSocket = peers[producerData.socketId].socket
                  // use socket to send producer id to producer
                  const producerSocket = peers[producerData.socketId].socket
                  console.log("producerSocket: ",producerSocket.id);
                  producerSocket.emit('newProducer', { producerId: producerId })
                }
              })
        }
    
        socket.on('produce',async({kind,appData,rtpParameters},callback) => {
          
            // const producerTransport = peers[socket.id].transports;
            // filtering producer transport from transport array
            const [producerTransport] = transports.filter(transport => transport.socketId === socket.id && !transport.consumer)
            // console.log('producer transport: ',producerTransport);
            const roomId = peers[socket.id].roomId;
            try{
                // using the filtered producer transport that matches the socketid to produce that producer media
                console.log('producer kind: ',kind);
                producer = await producerTransport.transport.produce({kind, rtpParameters});
                console.log("produce event: ",producer.id);
    
                //adding producer to peers
                peers[socket.id] = {
                    ...peers[socket.id],
                    producers:[
                        ...peers[socket.id].producers,
                        producer,
                    ]
                }
    
                //adding producer to producers
                producers = [
                    ...producers,
                    {producer,socketId: socket.id,roomId,kind, appData}
                ]
                console.log("producers: ",producers);
                // console.log("producers id: ",producers.producer);
                callback({
                    id: producer.id,
                    producerExists: producers.length>1?true: false
                })
    
                // inform about new producer
                informConsumers(producer.id,socket.id,roomId);
                // socket.emit('newProducer',{producerId: producer.id,socketId: socket.id});

                producer.on('transportclose', () => {
                    console.log('transport for this producer closed ');
                    try{
                        producer.close();
                        console.log('producer closed:');

                    }catch(e){
                        console.log('error closing transport: ',e)
                    }
                    
                  })
    
            } catch(err){
                console.log('error producing: ',err);
            }        
        })
    
        socket.on('consumer-connect',async({dtlsParameters,consumerTransportId}) => {
            const [consumerTransport] = transports.filter(transportData => transportData.transport.id === consumerTransportId&& transportData.consumer)
            // console.log('consumerTransport: ',consumerTransport);
            try{
                await consumerTransport.transport.connect({dtlsParameters});
                console.log("consumer connected")
            } catch(err){
                console.log("error connecting consumer: ",err);
            }
        })
    
        socket.on('consume',async({rtpCapabilities,remoteProducerId,consumerTransportId},callback) => {
            const roomId = peers[socket.id].roomId;
            const [consumerTransport] = transports.filter(transportData => transportData.transport.id === consumerTransportId && transportData.consumer)
            console.log('consumerTransport: ',consumerTransport);
            console.log("remote producer id: ",remoteProducerId)
            try{
                consumer = await consumerTransport.transport.consume({
                    rtpCapabilities,
                    producerId: remoteProducerId,
                    paused: true
                });
                console.log("consumed remote producer: ",remoteProducerId);

                consumer.on('transportclose', () => {
                    console.log('transport close from consumer');

                    
                  })
                consumer.on('producerclose', () => {
                    console.log('producer of consumer closed')
                    socket.emit('producer-closed',remoteProducerId);
          
                    consumerTransport.transport.close([]);
                    transports = transports.filter(transportData => transportData.transport.id !== consumerTransport.transport.id)
                    consumer.close()
                    consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id)
                })
    
                // adding consumer to peers
                peers[socket.id] = {
                    ...peers[socket.id],
                    consumers:[
                        ...peers[socket.id].consumers,
                        consumer,
                    ]
                }
    
                // adding consumers to consumers
                consumers = [
                    ...consumers,
                    {consumer,socketId: socket.id,roomId}
                ]
                console.log("consumers: ",consumers);
                console.log("consumers id: ",consumer.id);
                // console.log('remoteproducerId: ',remoteProducerId);
                console.log('consumer kind: ',consumer.kind);
                callback({
                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters
                });
    
            } catch(err){
                console.log("error consuming: ",err);
            }
    
            socket.on('resume',async (consumerId) => {
              
                const { consumer } = consumers.find(consumerData => consumerData.consumer.id === consumerId)
                await consumer.resume();
                console.log("consumer resumed");
            })
        })
    })
}