import Schedule from "../../models/schedule.model.js"
import User from "../../models/user.model.js"
import { nanoid} from 'nanoid';
import crypto from 'crypto';


export const addMeeting = async (req,res) => {
    const { title, description, startTime, duration} = req.body;
    // Generate Meeting ID
    const meetingID = nanoid(12); 

    // Generate Meeting Password
    const meetingPassword = crypto.randomBytes(4).toString('hex'); 

    console.log({ meetingID, meetingPassword });
    const {_id } = await User.findOne({email: req.session.user.username});
    console.log('id: ',_id);
    const scheduleDetails = new Schedule({
        title: title,
        description: description,
        startTime: startTime,
        duration: duration,
        host: _id,
        isHost: true,
        user: req.session.user.username,
        meetingId: meetingID,
        password: meetingPassword
    });
    await scheduleDetails.save();
    res.send(scheduleDetails);
}
export const editMeeting = async (req,res) => {
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
export const deleteMeeting = async (req,res) => {
    const { id } = req.body;
    try{
        const result = await Schedule.findByIdAndDelete(id);
        if(result){
            res.send({isDeleted:true});
        }
        else{
            res.send({isDeleted: false})
        }
    }catch(err){
        res.send(err);
    }
}
export const deleteAllMeetings = async (req,res) => {
    try{
        const result = await Schedule.deleteMany({});
        if(result){
            res.send(result);
        }
    }catch(err){
        res.send(err);
    }
}