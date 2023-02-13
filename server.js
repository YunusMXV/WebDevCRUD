import express from 'express'
const app = express();
import dotenv from 'dotenv'
dotenv.config() // loading environment variables from .env file
import mongoose, { get } from 'mongoose'; // import mongoose library to work with MongoDB
import {Homepage, createUsers, getAllUsers, getUser, updateUser, deleteUser, ensureToken} from "./src/controllers/controllers.js"; //handles syntax of requests
//import router from './src/routes/route.js'; //for router file

//router.use(express.json());


// sets up the Express application to handle incoming data in the JSON format
app.use(express.json());

// creates endpoint to handle GET requests to the '/' URL path
app.get('/', Homepage);

// (CREATE new user) endpoint for creating a new user
app.post('/users', createUsers)

// GET all users endpoint to handle GET request
app.get('/users', getAllUsers)

// GET individual user fetching individual user from database, ensureToken is a middleware
app.get('/users/:id', ensureToken, getUser)

// UPDATE data of a user
app.put('/users/:id', updateUser)

// DELETE data of a user
app.delete('/users/:id', deleteUser)


mongoose.set('strictQuery', false); //error without strictquery being false
mongoose.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.dzkaw0t.mongodb.net/test?retryWrites=true&w=majority`)
.then(() => {
    console.log('Connected to MongoDB');

    app.listen(3000, () => {
        console.log('Node API app is running on port 3000');
    });
}).catch((error) => {
    console.log(error);
})