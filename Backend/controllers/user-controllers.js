// Using bcrypt for encrypting passwords
const bcrypt = require('bcrypt');

// Using Json Web Token
const jwt = require('jsonwebtoken');

// User Model
const User = require("../models/user-model");
// Own Error Class
const HttpError = require("../util/http-error-message");
// For validiting the inputs comming to the post api
const { validationResult } = require('express-validator');

// Function for creating jwt token
const createToken = (userId) => {
    return jwt.sign(
        {userId},                         // UserId as payload
        "InnoventX's own secret",         // Secret
        { expiresIn : 24*60*60 }          // Expiration time set to 1 day
    );
}

const signup = async (req,res,next) => {

    // Storing error if it is comming from the inputs of signup through validationResult
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }
    
    // Generating salt to encrypting the password
    const salt = await bcrypt.genSalt();

    // Encripting the password
    const password = await bcrypt.hash(req.body.password , salt);

    const email = req.body.email;

    // Checking if the user already exists or not via email
    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(existingUser){
        next(new HttpError('User already exists.Please Login!',500));
    }

    // Creating the user
    const newUser = new User({
        name: req.body.name,
        email:email,
        password:password,
        questions:[],
        answers:[]
    });

    try{
        // Saving the user
        await newUser.save();

        // Getting jwt token
        // const token = createToken(user._id);

        // Wrapping jwt token in the cookie use " npm install cookie-parser"
        // res.setHeader('Set-Cookie' , 'newUser=true');

    }catch(err){
        console.log(err);
        // Sending the error message
        next(new HttpError('User not saved',500));
    }

    // Sending user in Response
    res.json({user:newUser.toObject({getters:true})});
}

const login = async (req,res,next) => {

    // Storing error if it is comming from the inputs of login through validationResult
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    // Taking email from frontend 
    const email = req.body.email;

    let userFound;
    try{
        // Checking whether the user of that perticular email exists or not
        userFound = await User.findOne( { email } );
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user doesnot exists
    if(!userFound){
        res.status(500);
        res.json({message:'User not found'});
    }else{
        // Comparing the hashed password using bcrypt
        const auth = await bcrypt.compare(req.body.password , userFound.password);
        if(!auth){
            res.status(500);
            res.json({message:'Wrong Password'});
        }
    }

    // Sending the user as Response
    res.json({user:userFound.toObject({getters:true})});
}

const getQuestionByUserId = async (req,res,next) => {

    const userId = req.params.userId;

    let userFound;
    try{
        // Now we can access question of user by userFound.questions
        userFound = await User.findById(userId).populate('questions');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!userFound){
        next(new HttpError('User not found',500));
    }
    else if(userFound.questions.length === 0){
        return res.json({message:"No questions found"});
    }

    res.json({questions : userFound.questions.map((ques) => ques.toObject({getters:true}))});
}

const getAnswersByUserId = async (req,res,next) => {

    const userId = req.params.userId;

    let userFound;
    try{
        userFound = await User.findById(userId).populate('answers');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }
    
    if(!userFound || userFound.answers.length === 0){
        res.json({message:"No answers are given by user"});
    }

    res.json({answers: userFound.answers.map((ans) => ans.toObject({getters:true}))});
}

exports.signup = signup;
exports.login = login;
exports.getQuestionByUserId = getQuestionByUserId;
exports.getAnswersByUserId = getAnswersByUserId;

