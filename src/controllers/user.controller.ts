// user controller functions

import authService from "../services/auth.sevices";
import userService from "../services/user.sevices";
import { generateToken } from "../utils";
var jwt = require('jsonwebtoken');
const privateKey =  process.env.PRIVATE_KEY;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getUser = async (req, res, next) => {
    res.send(req.params.userID);
}

const getUsers = async (req, res, next) => {
    res.send('Hello World!')
}

const createUser = async (req, res, next) => {
    try{
        const data = {...req.body}
        let result:any = await userService.findUser(data.email);
        if(result) return res.status(400).json({message: 'User already exists'});

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;

        await userService.createUser({...data});
        const token = jwt.sign(
            {
              name: data.name,
              email: data.email,  
              token: generateToken(),   
            },
            privateKey,  
            { expiresIn: '1h'}
          );
        // console.log(token);

        await authService.sendAccountValidationEmail({...data, token});
        await userService.updateUser(data.email, {activationToken: token.split('.')[0]});

        res.status(201).json({message: 'User created successfully'});
    }catch (error:any){
        res.status(500).json({message: error.message});
    }
}

const updateUser = async (req, res, next) => {
    // Define the logic for updating a user
}

const deleteUser = async (req, res, next) => {
    // Define the logic for deleting a user
}

const userController = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser 
};

export default userController;