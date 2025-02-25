import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    roomId: { 
        type: String, 
        required: true, 
    },
    host: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Schedule', required: true 
    },
    participants: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' ,
            role: {
                type: String,
                enum: ['admin','host','participant']
            }
        }
    ],
    status: {
        type: String,
        default: 'active'
    }
    
  }, { timestamps: true });
  
const Room = mongoose.model('Room', meetingSchema);
export default Room;
  