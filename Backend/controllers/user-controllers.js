// Using bcrypt for encrypting passwords
const bcrypt = require('bcrypt');

// Using Json Web Token
const jwt = require('jsonwebtoken');

// User Model
const User = require("../models/user-model");
const Question = require('../models/question-model');
// Own Error Class
const HttpError = require("../util/http-error-message");
// For validiting the inputs comming to the post api
const { validationResult } = require('express-validator');

const crypto = require('crypto');

// module for mail service
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const tranporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

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
        answers:[],
        savedAnswers:[]
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

const saveAnswer = async (req,res,next) => {

    // Getting userId and answerId from the route
    const userId = req.params.userId;
    const answerId = req.params.answerId;

    // finding the user and his saved answers
    let userFound; 
    try{
        userFound = await User.findById(userId);
        userFound.savedAnswers.push(answerId);
        await userFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    res.json({user:userFound});
}


const getQuestionByUserId = async (req,res,next) => {

    // Taking userId by route
    const userId = req.params.userId;

    // Finding the users & his questions
    let userFound;
    try{
        // Now we can access question of user by userFound.questions
        userFound = await User.findById(userId).populate('questions');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user doesnot exixts
    if(!userFound){
        next(new HttpError('User not found',500));
    }
    else if(userFound.questions.length === 0){
        return res.json({message:"No questions found"});
    }

    res.json({questions : userFound.questions.map((ques) => ques.toObject({getters:true}))});
}

const getAnswersByUserId = async (req,res,next) => {

    // Taking userId by route
    const userId = req.params.userId;

    // Finding the users & his answers
    let userFound;
    try{
        userFound = await User.findById(userId).populate('answers');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }
    
    // Throwing error if the user doesnot exixts
    if(!userFound){
        res.json({message:"User not found."});
    }else if(userFound.answers.length === 0){
        res.json({message:"No answers are given by user"});
    }else{
        // Getting the questions of those answers which was given by user
        let array = [];
        userFound.answers.forEach( async (ans,index) => {
            let question;
            try{
                question = await Question.findById(ans.questionId);
            }catch(err){
                console.log(err);
                next(new HttpError('Something went wrong',500));
            }
            array.push({question,ans});

            if(index === (userFound.answers.length-1)){
                res.json({quesAns:array});
            }  
        })
    }

    // res.json({answers: userFound.answers.map((ans) => ans.toObject({getters:true}))});
}

const getSavedAnswers = async (req,res,next) => {
    
    // Taking userId by route
    const userId = req.params.userId;

    // Finding the users & his answers
    let userFound;
    try{
        userFound = await User.findById(userId).populate('savedAnswers');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }
    
    // Throwing error if the user doesnot exixts
    if(!userFound){
        res.json({message:"User not found."});
    }else if(userFound.savedAnswers.length === 0){
        res.json({message:"No answers were saved by the user."});
    }else{
        userFound.savedAnswers.reverse();

        // Getting the questions of those answers which was given by user
        let array = [];
        userFound.savedAnswers.forEach( async (ans,index) => {
            let question;
            try{
                question = await Question.findById(ans.questionId);
            }catch(err){
                console.log(err);
                next(new HttpError('Something went wrong',500));
            }
            array.push({question,ans});

            if(index === (userFound.savedAnswers.length-1)){
                res.json({quesAns:array});
            }  
        })
    }   
}

const getUserById = async (req,res,next) => {
    const userId = req.params.userId;

    let userFound;
    try{
        userFound = await User.findById(userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));  
    }

    if(!userFound){
        next(new HttpError('Something went wrong',500));
    }

    res.json({user:userFound.toObject({getters:true})});
}


const postReset = async(req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            next(new HttpError('Something went wrong', 500));
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with the email found.');
                }
                user.resetToken = token;
                user.resetExpire = Date.now() + 3600000;
                user.save();
            })
            .then(result => {
                res.json({ status: 'Email Sent' });
                tranporter.sendMail({
                    to: req.body.email,
                    from: 'info.innoventx@gmail.com',
                    subject: 'Reset Password',
                    html: `
                        <p>You Requested a password reset </p>
                        <P>Please click this  <a href="http://localhost:3000/reset/token/${token}" to reset the password</p> 
                    `
                });
            })
            .catch(err => {
                console.log(err);
                next(new HttpError('Something went wrong', 500));
            });

    });
};

const newpassword = async (req, res, next) => {
    const token = req.body.token;
    const newpassword = req.body.password;
    let resetuser;
    User.findOne({ resetToken: token, resetExpire: { $gt: Date.now() } })
        .then(user => {
            resetuser = user;
            return bcrypt.hash(newpassword, 12);
        })
        .then(hashedPassword => {
            resetuser.password = hashedPassword;
            resetuser.resetToken = undefined;
            resetuser.resetExpire = undefined;
            resetuser.save();
        })
        .then(result => {
            res.json({ status: 'Sexy' });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.signup = signup;
exports.login = login;
exports.getQuestionByUserId = getQuestionByUserId;
exports.getAnswersByUserId = getAnswersByUserId;
exports.saveAnswer = saveAnswer;
exports.getSavedAnswers = getSavedAnswers;
exports.postReset = postReset;
exports.newpassword = newpassword;
exports.getUserById = getUserById;

