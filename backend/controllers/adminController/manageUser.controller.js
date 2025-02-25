import User from "../../models/user.model.js"
import bcrypt from 'bcrypt'

export const addUser = async (req,res) => {
    const saltRounds = 10;
    try {
        const { name, email, password } = req.body;
        const adminEmail = 'pratikgiri2320@gmail.com';
        console.log(name)
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
export const editUser = async (req,res) => {
    const { id } = req.params;
    const {name, email} = req.body;
    try{
        const result = await User.findByIdAndUpdate(id, {name, email}, {new: true});
        res.send({success: true});
    }catch(e){
        res.send(e);
    }
}
export const deleteUser = async (req,res) => {
    const { id } = req.body;
    try{
        const result = await User.findByIdAndDelete(id);
        if(result){
            res.send({isDeleted: true});
        }
        else{
            res.send({isDeleted: false});
        }
    }catch(err){
        res.send(err)
    }
}
