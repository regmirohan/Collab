import User from '../../models/user.model.js'
import bcrypt from 'bcrypt'
export const createInitialAdmin = async (req,res) => {
    const adminEmail = 'collab0310@gmail.com';
    const adminPassword = 'collab';
  
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: adminEmail, 
      role: 'admin' 
    });
  
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
  
      await adminUser.save();
      console.log('Initial admin user created');
      res.send({email: adminEmail, password: hashedPassword, msg: 'Admin registered successfully'});
    }
}
export const Login = async (req,res) => {
    console.log('login')
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({ error: 'Please fill all the fields' });
    }
    const user = await User.findOne({email: email});
    if(user){
        console.log('user: ',user)
        const hash = user.password;
        bcrypt.compare(password,hash, function (err,result){
            if(result){
                req.session.user = {
                    username: email,
                    role: user.role
                }
                res.status(200).json({isAdmin: true});
            }
            else{
                res.json({err: "Invalid password"});
            }
        })
        
    }
    else{
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
         
}
export async function checkSession(req,res){
    if(req.session.user){
        console.log('session found', req.session.user);
        res.send({name: req.session.user, loggedIn: true})
       
    }        
    else{
        console.log('session not found');
        res.send({loggedIn: false, user: req.session.user});
       
    }
        
}
export async function destroySession(req,res){
    console.log('destroy')
    if(req.session){
        req.session.destroy((err) => {
            res.redirect('/') // will always fire after session is destroyed
          })
        // res.send({success: true})
    }
    else{
        res.send({msg: 'you have not legged in'})
    }
    
}