import User from '../../models/user.model.js'
import Room from '../../models/meeting.model.js'
import Schedule from '../../models/schedule.model.js';
export const getTotalUsers = async (req,res) => {
    try{
        const users = await User.find({});
        if(users){
            console.log(users.length)
            res.send(users);
        }
    }catch(err){
        res.send({error: `failed to get data: ${err}`});
    }
}
export const getTotalMeetings = async (req,res) => {
    try{
        const rooms = await Schedule.find({});
        if(rooms){
            console.log(rooms.length)
            res.send(rooms);
        }
    }catch(err){
        res.send({error: `failed to get data: ${err}`});
    }
}
export const getCompletedSessions = async (req,res) => {
    try{
        const rooms = await Room.find({status: 'completed'});
        if(rooms){
            console.log(rooms.length)
            res.send(rooms);
        }
    }catch(err){
        res.send({error: `failed to get data: ${err}`});
    }
}
export const getActiveSessions = async (req,res) => {
    try{
        const rooms = await Room.find({status: 'active'}).populate('host').populate('participants');
        if(rooms){
            console.log(rooms)
            res.send(rooms);
        }
    }catch(err){
        res.send({error: `failed to get data: ${err}`});
    }
}
