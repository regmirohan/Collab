import mongoose from'mongoose';

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the meeting
        ref: 'User', // Refers to the User collection
      
    },
    participants: [
        {
          type: mongoose.Schema.Types.ObjectId, // Reference to participants (users)
          ref: 'User',
          role: {
            type: String,
            enum: ['admin','host','participant']
          }
        },
    ],
    user: {
        type: String
    },
    isHost: {
        type: Boolean,
        default: true
    },
    meetingId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    status: {
        type: String,
        default: 'inactive'
    }
},{ timestamps: true });

const Schedule = mongoose.model('Schedule',scheduleSchema);
export default Schedule;