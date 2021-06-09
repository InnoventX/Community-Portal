// Using bcrypt for encrypting passwords
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// User Model
const User = require("../models/user-model");
const Code = require("../models/code-model");
const Question = require('../models/question-model');
const Course = require('../models/course-model');
// Own Error Class
const HttpError = require("../util/http-error-message");
// For validiting the inputs comming to the post api
const { validationResult } = require('express-validator');

const crypto = require('crypto');

// module for mail service
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

const siggnup = async (req,res,next) => {

    // Storing error if it is comming from the inputs of signup through validationResult
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        return next(new HttpError('Invalid input.Please enter again',422));
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
        return next(new HttpError('Something went wrong',500));
    }

    if(existingUser){
        return next(new HttpError('User already exists.Please Login!',500));
    }

    const code = req.body.code;
    let codeFound;
    try{
        // Checking whether the user of that perticular email exists or not
        codeFound = await Code.findOne({code: code});
    }catch(err){
        console.log(err);
        return next(new HttpError('something went wrong try again',500));
    }

    if(!codeFound){
        return next(new HttpError('No such code found.Please enter a valid code',500));
    }else{
        const newUser = new User({
            name: req.body.name,
            email:email,
            password:password,
            image:req.file ? req.file.path : null,
            questions:[],
            answers:[],
            savedAnswers:[],
            schoolName: req.body.schoolName,
            code: code
        });
    
        try{
            // Saving the user
            await newUser.save();
        }catch(err){
            console.log(err);
            // Sending the error message
            return next(new HttpError('User not saved',500));
        }

        let token;
        try{
            token=jwt.sign(
                { userId:newUser.id, email:newUser.email },
                'InnoventxRocks',
                {expiresIn:'1h'}
            );
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong.Token not created',500));
        }

        // Sending user in Response
        res.json({user:newUser.toObject({getters:true}), token:token});
    }
}

const login = async (req,res,next) => {

    // Storing error if it is comming from the inputs of login through validationResult
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        return next(new HttpError('Invalid input.Please enter again',422));
    }

    // Taking email from frontend 
    const email = req.body.email;

    let userFound;
    try{
        // Checking whether the user of that perticular email exists or not
        userFound = await User.findOne( { email } );
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
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

    let token;
    try{
        token= jwt.sign(
            {userId:userFound.id, email:userFound.email},
            'InnoventxRocks',
            { expiresIn:'1h' }
        );
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong.Token not created'));
    }

    // Sending the user as Response
    res.json({user:userFound.toObject({getters:true}), token:token});
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
        return next(new HttpError('Something went wrong',500));
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
        return next(new HttpError('Something went wrong',500));
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

const getCourseByUserId = async (req, res,next) => {
    
    const userId =  req.params.userId

    let userFound;
    try {
        userFound = await User.findById(userId).populate('courses')
    }catch(err) {
        console.log(err);
        return next(new HttpError("Something went wrong", 500));
    }

    if(!userFound){
        return next(new HttpError('User not found',500));
    }
    else if(userFound.courses.length === 0){
        return res.json({message:"No courses found"});
    }

    // const myCourses = userFound.courses.map((course,index) => {
    //     return({
    //         ...course,
    //         lastSeenSectionId: userFound.myCoursesData[index].lastSeenSectionId
    //     })
    // })

    // res.json({courses : myCourses});
    res.json({
        courses : userFound.courses.map((c) => c.toObject({getters:true})),
        myCoursesData: userFound.myCoursesData.map((c) => c.toObject({getters:true}))
    });

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
        return next(new HttpError('Something went wrong',500));
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
            let userImage=userFound.image;
            let question;
            try{
                question = await Question.findById(ans.questionId);
            }catch(err){
                console.log(err);
                return next(new HttpError('Something went wrong',500));
            }
            array.push({question,ans,userImage});

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
        return next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user doesnot exixts
    if(!userFound){
        return res.json({message:"User not found."});
    }else if(userFound.savedAnswers.length === 0){
        return res.json({message:"No answers were saved by the user."});
    }else{
        userFound.savedAnswers.reverse();

        // Getting the questions of those answers which was given by user
        let array = [];
        userFound.savedAnswers.forEach( async (ans,index) => {
            let userImage=userFound.image;
            let question;
            try{
                question = await Question.findById(ans.questionId);
            }catch(err){
                console.log(err);
                return next(new HttpError('Something went wrong',500));
            }
            array.push({question,ans,userImage});

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
        return next(new HttpError('Something went wrong',500));
    }

    if(!userFound){
        return next(new HttpError('Something went wrong',500));
    }

    res.json({user:userFound.toObject({getters:true})});
}


const postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Something went wrong', 500));
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({error: "No user found for this email account"});
                }
                console.log("found");
                user.resetToken = token;
                user.resetExpire = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'tinyrick5101@gmail.com',
                    subject: 'Reset Password',
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a></p>
                    `
                });
            })
            res.json({message: "check your email!!"})
    });
};


const newpassword =  (req, res, next) => {
    const newPassword = req.body.password;
    const sentToken =  req.body.token;
    User.findOne({resetToken: sentToken, resetExpire: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                return res.status(422).json({error: "Try Again session expired"})
            }
            bcrypt.hash(newPassword, 12).then(hasedPassword => {
                user.password = hasedPassword
                user.resetToken = undefined
                user.resetExpire = undefined
                user.save().then(savedUser => {
                    res.json({message: "password updated pls re-login"})
                })
            })
        }).catch(err=>{
            console.log(err);
            return next(new HttpError('Something went wrong',500));
    })
}

/*
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

    const newCode = new Code({
        schoolName: "Mount Carmel",
        code: "MYBIY1"
    })

    try{
        // Saving the user
        await newUser.save();
        await newCode.save();
    }catch(err){
        console.log(err);
        // Sending the error message
        next(new HttpError('User not saved',500));
    }

    // Sending user in Response
    res.json({user:newUser.toObject({getters:true})});
}
*/

// exports.signup = signup;
exports.siggnup = siggnup;
exports.login = login;
exports.getQuestionByUserId = getQuestionByUserId;
exports.getAnswersByUserId = getAnswersByUserId;
exports.saveAnswer = saveAnswer;
exports.getSavedAnswers = getSavedAnswers;
exports.postReset = postReset;
exports.newpassword = newpassword;
exports.getUserById = getUserById;
exports.getCourseByUserId = getCourseByUserId;

