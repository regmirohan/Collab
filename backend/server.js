import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import session from 'express-session';
import connectDB from './config/mongooseConfig.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import { initialize } from './services/transportService.js';
import { checkPermission } from './middlewares/rbac.js';
import { deleteMeeting } from './controllers/meeting.controller.js';
import { isAuthenticated } from './middlewares/authenticated.js';
import { adminAuth } from './middlewares/adminAuth.js';

dotenv.config({
    path: './env'
})

const app = express();
const http = createServer(app);
const io = new Server(http, {
     cors: "http://localhost:5173",
    //  credentials: true
})

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(session({
    secret: 'collab',
    resave: false,
    saveUninitialized: false,
    cookie: {
         secure: false,
         httpOnly: true,       
         maxAge: 1000 * 60 * 60 * 24,
        }
  }))
app.use('/api/users',userRoutes);
app.use('/api/admin', adminAuth, adminRoutes);
app.use('/api/adminAuth', adminAuthRoutes)
app.use('/api/rooms',isAuthenticated, roomRoutes);
app.use('/api/session',sessionRoutes);
app.use('/api/meeting',isAuthenticated, scheduleRoutes);

// app.get('/api/delete',deleteMeeting);
// function isAuthenticated (req, res, next) {
//     if (req.session.user) next()
//     else res.send('not authenticated.')
//   }
// app.get('/',isAuthenticated, (req,res) => {
//     res.send('welcome');
// })

initialize(io);
connectDB()
.then(() => {    
    http.listen(3000,() => {
        console.log('Server is listening at port 3000 ...');
    })
})
.catch((err) => {
    console.log('Error loading server: ',err);
})


// ( async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}`);
//        app.on('error',(error) => {
//         console.log("err: ",error);
//        })
       
//     }catch(err){
//         console.log(err);
//     }
// })()





app.get('/', (req,res) => {
    res.send('hello');
 })
//  http.listen(3000,() => {
//             console.log('Server is listening at port 3000 ...');
//         })
