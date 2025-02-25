import bcrypt from 'bcrypt';
import User from '../models/user.model.js'
const saltRounds = 10;
export async function login(req,res){
    const { email, password } = req.body;
    if(email && password){
        const data = await User.findOne({email: email});
        console.log('data:',data.password);
        const hash = data.password;
        //   Load hash from your password DB.
        bcrypt.compare(password, hash, function(err, result) {
            if(result){
                console.log('result: ',result);
                // res.send(result);       
                req.session.user = { username: email, role: data.role };
                console.log('name: ',req.session.user.username);
                console.log('cookie: ',req.session);
                req.session.save(function (err) {
                    if (err){
                        console.log(err);
                        return next(err)
                    } 
                    res.send({valid: true, role: data.role});
                  })
            }
            else{
                res.send({valid: false});
            }
        });
    }
    else{
        res.send({'error': 'please fill all the fields'});
    }
  
   
   
}

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const adminEmail = 'pratikgiri2320@gmail.com';
        
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        // Drop a specific index
        // await User.collection.dropIndexes()

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Determine role
        const role = email === adminEmail ? 'admin' : 'user';

        // Hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        });

        // Save user
        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
}
export async function checkSession(req,res){
    if(req.session.user){
        console.log('session found');
        res.send({name: req.session.user, loggedIn: true})
       
    }        
    else{
        console.log('session not found');
        res.send({loggedIn: false, user: req.session.user});
       
    }
        
}
export async function destroySession(req,res){
    if(req.session){
        req.session.destroy((err) => {
            res.redirect('/') // will always fire after session is destroyed
          })
        // res.send({success: true})
    }
    else{
        res.send({msg: 'you have not logged in'})
    }
    
}

export async function forgotPassword(req,res) {
    const {email} = req.params;
     try{
        const response = await User.find({email: email});
        console.log(response)
       if( response.length < 1 ){
        res.json({success: false})
       }
       else{
        res.json({success: true})
       }
        
        
     }
     catch(err){
        res.json(err)
     }
}
export async function changePassword(req,res){
    const {email} = req.params;
    const { password} = req.body;

     // Hash password
     const salt = await bcrypt.genSalt(saltRounds);
     const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const response = await User.findOneAndUpdate({email: email}, {password: hashedPassword}, {new: true});
        res.json({success: true})
    }catch(err){
        res.json(err)
    }
}