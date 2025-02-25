import User from '../../models/user.model.js'
import Room from '../../models/meeting.model.js'
import Schedule from '../../models/schedule.model.js';

export const getRoomsDetail = async (req,res) => {
    try{
        const rooms = await Room.find({}).populate(
            {
                path: 'host', 
                populate: {
                    path: 'host', 
                    select: 'name', // Optional: Select specific fields from the `Profile`
                },
            }
        ).populate('participants').exec();
        if(rooms){
            console.log(rooms)
            res.send(rooms);
        }
    }catch(err){
        res.send({error: `failed to get data: ${err}`});
    }
}

export const deleteRoom = async (req,res) => {
    const { id } = req.body;
    try{
        const result = await Room.findByIdAndDelete(id);
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
