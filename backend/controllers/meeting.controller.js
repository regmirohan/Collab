import { nanoid} from 'nanoid';
import crypto from 'crypto';
import Schedule from '../models/schedule.model.js';
import User from '../models/user.model.js'
export async function scheduleMeeting(req,res){
    const { title, desc, startTime, duration} = req.body;
    // Generate Meeting ID
    const meetingID = nanoid(12); 

    // Generate Meeting Password
    const meetingPassword = crypto.randomBytes(4).toString('hex'); 

    console.log({ meetingID, meetingPassword });
    const {_id } = await User.findOne({email: req.session.user.username});
    console.log('id: ',_id);
    const scheduleDetails = new Schedule({
        title: title,
        description: desc,
        startTime: startTime,
        duration: duration,
        host: _id,
        user:req.session.user.username,
        isHost: true,
        meetingId: meetingID,
        password: meetingPassword
    });
    await scheduleDetails.save();
    res.send(scheduleDetails);
}
export async function meetingDetails(req,res){
    const meetingDetails = await Schedule.find({user: req.session.user.username});
    if(meetingDetails){
        console.log('meeting details: ',meetingDetails);
        res.send(meetingDetails);
    }
    else{
        console.log('cannot find meeting details of ',req.session.user);
    }
    
}
export async function getByMeetingId(req,res){
    const {id} = req.params;
    console.log('meeting id: ',id);
    const meetingId = await Schedule.find({meetingId: id});
    res.send(meetingId);
}
export async function setStatus(req,res){
    console.log('setting status')
    const {roomId, status} = req.body;
    const result = await Schedule.findOneAndUpdate({meetingId: roomId},{status: status},{new: true});
    if(result){
        console.log("status:", result);
        res.send({success: true})
    }
}
export async function updateByMeetingId(req,res){
   
    const {id} = req.params;
    console.log('meeting id: ',id);
    const {title, desc:description, startTime, duration} = req.body;
    console.log(req.body);
    console.log(title)
   
    try{
        await Schedule.findOneAndUpdate({meetingId: id},{title, description, startTime, duration},{new: true});
        res.send({success: true});
    }catch(err){
        console.log(err);
        res.send({success: false});
    }
    
}
export async function deleteMeeting(req,res){
   const { id } = req.body;
   console.log('meeting id: ',id)
    await Schedule.findOneAndDelete({meetingId: id});
    console.log('deleted');
    res.send({isDeleted: true});
}
export async function updateParticipants(req,res){
    const {meetingId} = req.params;
    const meeting = await Schedule.findOne({meetingId});
    if (meeting) {
     const { _id } = await User.findOne({email: req.session.user.username});
     console.log(_id)
     const user = await Schedule.findOneAndUpdate({roomId: meetingId}, {$push: {_id: _id, role: 'participant'}}, {new: true});
     console.log('user update: ',user)
      return res.json({ valid: true});

    } else {
      return res.json({ valid: false });
    }
}
export async function getRole(req,res){
    const { id } = req.params;
    const { isHost } = await Schedule.findOne({meetingId: id});
   
        res.send(isHost)


}