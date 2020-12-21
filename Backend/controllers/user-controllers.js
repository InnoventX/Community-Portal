const User = require("../models/user-model");
const HttpError = require("../util/http-error-message");
const { validationResult } = require('express-validator');
const { Http } = require("@material-ui/icons");

const signup = async (req,res,next) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }
    
    const newUser = new User({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        questions:[],
        answers:[]
    });

    try{
        await newUser.save();
    }catch(err){
        console.log(err);
        next(new HttpError('User not saved',500));
    }

    res.json({user:newUser.toObject({getters:true})});
}

const login = async (req,res,next) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    const { email , password } = req.body;

    let userFound;
    try{
        userFound = await User.findOne( { email } );
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!userFound || userFound.password !== password){
        res.status(500);
        res.json({message:'Login failed.Please try again'});
    }

    res.json({user:userFound});
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
        return res.json({message:"NO questions found"});
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
