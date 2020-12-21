const HttpError = require('../util/http-error-message');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require("../models/user-model");
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const { Http } = require('@material-ui/icons');

const compare = (a , b) => {

    // If B has higher rating then SORT
    if( b.rating > a.rating ){
        return 1;
    }
    else if( a.rating > b.rating ){
        return -1;
    }
    return 0;
}

const getAnswersByQuestionId = async (req,res,next) => {

    const questionId = req.params.questionId;

    let questionFound;
    try{
        questionFound = await Question.findById(questionId).populate('answers');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questionFound){
        next(new HttpError("Question not found",500));
    }else if (questionFound.answers.length===0){
        return res.json({message:"No answers found of that question"});
    }

    questionFound.answers.sort(compare)

    res.json({answers:questionFound.answers.map((ans) => ans.toObject({getters:true}))});
    
}

const giveAnswer = async (req,res,next) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    const questionId = req.params.questionId;
    const { userId, answer , rating } = req.body;

    // Finding question bu ID
    let questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questionFound){
        next(new HttpError("Question not found",500));
    }

    const newAnswer = new Answer({
        userId,
        answer,
        rating:rating || 0,
        questionId:questionId
    });

    // Finding User by ID
    let userFound;
    try{
        userFound = await User.findById(userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!userFound){
        next(new HttpError("User not found",500));
    }

    // Now storing the answer
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Saving the answer 
        await newAnswer.save({ session:sess });

        // Storing answerID in question
        questionFound.answers.push(newAnswer);
        await questionFound.save({ session:sess });

        // Storing answer in user(who has given the answer)
        userFound.answers.push(newAnswer);
        await userFound.save({ session:sess });

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        next(new HttpError('Answer not saved',500));
    }
    
    res.json({answer:newAnswer.toObject({getters:true})});
}

const updateAnswer = async (req,res,next) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    const answerId = req.params.answerId;
    const {answer} = req.body;

    let answerFound;
    try{
        answerFound = await Answer.findById(answerId);
    }catch(err){
        console.log(err);
        next(new Http('Something went worng',500));
    }
    
    if(!answerFound){
        next(new HttpError('Answer not found',500));
    }

    answerFound.answer = answer;

    try{
        await answerFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError('Updation failed',500));
    }

    res.json({answer:answerFound.toObject({getters:true})});
}

const incrementRating = async (req,res,next) => {

    const answerId = req.params.answerId;

    let answerFound;
    try{
        answerFound = await Answer.findById(answerId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!answerFound){
        next(new HttpError("Answer not found",500));
    }

    answerFound.rating += 1;
    try{
        await answerFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError('Rating was not incremented',500));
    }

    res.json({answer:answerFound.toObject({getters:true})});
}

const deleteAnswer = async (req,res,next) => {

    const answerId = req.params.answerId;

    let answerFound;
    try{
        // Now we can access question by "answerFound.questionId"
        answerFound = await Answer.findById(answerId).populate('questionId');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!answerFound){
        next(new HttpError('Answer not found',500));
    }else if(!answerFound.questionId){
        next(new HttpError("Question of this qnswer was not found",500));
    }

    let answerGivenBy;
    try{
        answerGivenBy =  await User.findById(answerFound.userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!answerGivenBy){
        next(new Http("User was not found who has given the answer"));
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Removing answer from the question 
        answerFound.questionId.answers.pull(answerFound);
        await answerFound.questionId.save({ session:sess });

        // Removing answer from the user database
        answerGivenBy.answers.pull(answerFound);
        await answerGivenBy.save({ session:sess });

        await answerFound.remove();

        sess.commitTransaction();
        
    }catch(err){
        console.log(err);
        next(new HttpError('Not able to delete.Please try again',500));
    }

    res.json({message:'Deleted successfully'});
}


exports.giveAnswer = giveAnswer;
exports.updateAnswer = updateAnswer;
exports.deleteAnswer = deleteAnswer;
exports.getAnswersByQuestionId = getAnswersByQuestionId;
exports.incrementRating = incrementRating;