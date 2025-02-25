import { Device } from "mediasoup-client"
export async function initializeDevice(){
    console.log("Initializing device");
    const device = new Device();
    console.log('device: ',device);
    return device;
    
}