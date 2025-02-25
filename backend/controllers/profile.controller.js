import User from '../models/user.model.js'
import bcrypt from 'bcrypt';
const saltRounds = 10
export const getUserData = async (req,res) => {
    try{
        const result = await User.find({email: req.session.user.username});
        result.length >= 1 ? res.json({success: true, result}) : res.json({success: false})
        
    }catch(err){
        res.json(err)
    }
}
export const updateProfile = async (req,res) => {

    const {name, email, password} = req.body;
    console.log(password)
    if(!password){
        console.log('null')
        try{
            const result = await User.findOneAndUpdate({email: req.session.user.username}, {name, email}, {new: true});
            res.send({success: true});
        }catch(e){
            res.send(e);
        }
    }
    else{
        console.log('not null')
         // Hash password
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(password, salt);

        try{
            const result = await User.findOneAndUpdate({email: req.session.user.username}, {name, email, password: hashedPassword}, {new: true});
            res.send({success: true});
        }catch(e){
            res.send(e);
        }
    }
   
}
export const changePassword = async (req,res) => {
    const {oldPsw, newPsw} = req.body;
    const username = req.session.username;

     // Hash password
     const salt = await bcrypt.genSalt(saltRounds);
     const hashedPassword = await bcrypt.hash(password, salt);

    const result  = await User.findOneAndUpdate({name: username}, {password: newPsw}, {new: true});
}
export const changeLogo = async (req,res) => {
    
}