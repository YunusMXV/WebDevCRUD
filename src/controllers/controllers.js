import bcrypt from "bcrypt" // import password hashing library
import User from '../models/userModels.js'; // import user model defining structure of users we stored in mongoose
import jwt from "jsonwebtoken";
import { json } from "express";

export async function Homepage(req, res, next) {
    res.send('Hello user');
 }
export async function createUsers(req, res, next) {
    try {
        const hashedPassword  = await bcrypt.hash(req.body.password, 10);
        //creates a new user document in the MongoDB database using the data in the request body. The req.body property contains the request payload. Hashes password first then stores it
        const user = await User.create({
        name: req.body.name,
        password: hashedPassword
        });
        const token = jwt.sign({user}, 'my_secret_key');
        res.status(200).json({
            user: user,
            token: token
        });
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
}

export async function getAllUsers(req, res, next) {
    try {
        const users = await User.find({}); // User.find({}) retrieves all users from database
        res.status(200).json(users) // returns list of users as a JSON object
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export async function getUser(req, res, next) {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);
        jwt.verify(req.token, 'my_secret_key', function(err, data){
            if(err) {
                res.sendStatus(403);
            } else {
                res.json({
                    text: 'this is protected',
                    data: data
                })
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export async function updateUser(req, res, next) {
    try {
        // if user is trying to change password, password is first hashed then stored
        if(req.body.hasOwnProperty('password')){
            req.body.password =  await bcrypt.hash(req.body.password, 10);
        }
        
        const userID = req.params.id;
        const user = await User.findByIdAndUpdate(userID, req.body);
        
        if(!user){
            return res.status(404).json({message: `Cannot find user with ID: ${userID}`});
        }
        
        const updatedUser = await User.findById(userID);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export async function deleteUser(req, res, next) {
    try {
        const userID = req.params.id;
        const user = await User.findByIdAndDelete(userID);

        if(!user){
            return res.status(404).json({message: `User not found`});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export async function ensureToken(req, res, next) {
    const bearerheader = req.header("authorization");
    if(typeof bearerheader != 'undefined') {
        const bearer = bearerheader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}