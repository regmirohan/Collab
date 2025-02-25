import Schedule from '../models/schedule.model.js';
import User from '../models/user.model.js';
import Room from '../models/meeting.model.js';

export async function joinRoom(req,res){
    const {meetingId, password} = req.body;
    const meeting = await Schedule.findOne({meetingId, password});
    const { name } = await User.findOne({email: req.session.user.username});
    console.log(meeting);
    
    if (meeting) {
     const { _id } = await User.findOne({email: req.session.user.username});
     console.log(_id)
     const user = await Room.findOneAndUpdate({roomId: meetingId}, {$push: {
      participants: { _id: _id, role: "participant" }}// Add a new participant
    },{new: true});
     console.log('user update: ',user)
      return res.json({ valid: true, name: name });

    } else {
      return res.json({ valid: false });
    }
}

export async function getParticipants(req,res){
  const {roomId}= req.body;
  console.log(roomId);
  const users = await Room.find({roomId: roomId}).populate('participants');
  console.log('user: ',users);
  res.send(users);
}
export async function setStatus(req,res){
  console.log('setting status')
  const {roomId, status} = req.body;
  const result = await Room.findOneAndUpdate({roomId: roomId},{status: status},{new: true});
  if(result){
      console.log("status:", result);
      res.send({success: true})
  }
  else{
    console.log("status:", result);
    res.send({success: false})
  }
}
export async function getUserName(req,res){
  const { name } = await User.findOne({email: req.session.user.username});
  res.send({name})
}