const fs =  require('fs');

const HttpError = require('../util/http-error-message');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require("../models/user-model");
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');

// Function used for sorting the ansers according to their rating
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

    // Taking the questionId from the route
    const questionId = req.params.questionId;

    // Finding the question
    let questionFound;
    try{
        // Allocating an array of answers into "questionFound.answers" through populate
        questionFound = await Question.findById(questionId).populate('answers');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing the error if the question is not found
    if(!questionFound){
        next(new HttpError("Question not found",500));
    }
    else if (questionFound.answers.length===0){
        return res.json({question:questionFound.toObject({getters:true}),message:"No answers found of that question"});
    }

    // First reversing the array so that latest question comes first 
    questionFound.answers.reverse();

    // Sorting the array of answers according to their rating
    questionFound.answers.sort(compare);

    // Sending the question and answers as response
    res.json(
        {
            question:questionFound.toObject({getters:true}),
            answers:questionFound.answers.map((ans) => ans.toObject({getters:true}))
        }
    );
    
}

const giveAnswer = async (req,res,next) => {

    // Validating weather the input is correct or not 
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    // Taking questionId from the route
    const questionId = req.params.questionId;

    // Taking input from the body
    const { userId, answer , rating } = req.body;

    // Finding question by ID
    let questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the question was not found
    if(!questionFound){
        next(new HttpError("Question not found",500));
    }

    // Finding User by ID
    let userFound;
    try{
        userFound = await User.findById(userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user was not found
    if(!userFound){
        next(new HttpError("User not found",500));
    }

    // Making the answer instance
    const newAnswer = new Answer({
        userId,
        userName:userFound.name,
        userImage:userFound.image,
        answer,
        rating:rating || 0,
        image:req.file ? req.file.path : null,
        questionId:questionId,
        subAnswers:[]
    });

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
        next(new HttpError(err.message || 'Answer not saved',500));
    }
    
    // Sending the answer as response
    res.json({answer:newAnswer.toObject({getters:true})});
}

const getAnswerById = async (req,res,next) => {

    // Taking answerId from the route
    const answerId = req.params.answerId;

    // Finding the answer by it;s id
    let answerFound;
    try{
        answerFound = await Answer.findById(answerId);
    }catch(err){
        console.log(err);
        next(new Http('Something went worng',500));
    }

    res.json({answer:answerFound.toObject({getters:true})});
}

const updateAnswer = async (req,res,next) => {

    // Validating the input comming from body
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    // Taking answer ID from th route
    const answerId = req.params.answerId;
    // Taking updated data from the body
    const {answer} = req.body;

    // Finding the answrr of the given ID
    let answerFound;
    try{
        answerFound = await Answer.findById(answerId);
    }catch(err){
        console.log(err);
        next(new Http('Something went worng',500));
    }
    
    // Throwing the error if the answer is not found
    if(!answerFound){
        next(new HttpError('Answer not found',500));
    }

    // Updating the answer 
    answerFound.answer = answer;

    // Saving the answer
    try{
        await answerFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError('Updation failed',500));
    }

    res.json({answer:answerFound.toObject({getters:true})});
}

const incrementRating = async (req,res,next) => {

    // Taking answerId from the route
    const answerId = req.params.answerId;

    // Getting the answer which should be updated
    let answerFound;
    try{
        answerFound = await Answer.findById(answerId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the answer is not found
    if(!answerFound){
        next(new HttpError("Answer not found",500));
    }

    // Incrementing the rating by 1
    answerFound.rating += 1;
    // Saving the updated answer
    try{
        await answerFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError('Rating was not incremented',500));
    }

    res.json({answer:answerFound.toObject({getters:true})});
}

const deleteAnswer = async (req,res,next) => {

    // Getting answerId by route
    const answerId = req.params.answerId;

    // Finding the answer and it's respective question
    let answerFound;
    try{
        // Now we can access question by "answerFound.questionId"
        answerFound = await Answer.findById(answerId).populate('questionId');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the answer is not found
    if(!answerFound){
        next(new HttpError('Answer not found',500));
    }else if(!answerFound.questionId){
        next(new HttpError("Question of this qnswer was not found",500));
    }

    const answerImage = answerFound.image;

    // Finding the user who has given this answer
    let answerGivenBy;
    try{
        answerGivenBy =  await User.findById(answerFound.userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user is not found
    if(!answerGivenBy){
        next(new Http("User was not found who has given the answer"));
    }

    // Removing the answer and it's id from the question and user's array
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

    if(answerImage){
        fs.unlink(answerImage , (err) => {
            console.log(err);
        });
    }

    res.json({message:'Deleted successfully'});
}


exports.giveAnswer = giveAnswer;
exports.getAnswerById = getAnswerById;
exports.updateAnswer = updateAnswer;
exports.deleteAnswer = deleteAnswer;
exports.getAnswersByQuestionId = getAnswersByQuestionId;
exports.incrementRating = incrementRating;