const { RestaurantOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");
const Answer = require('../models/answer-model');

const getAllQuestions =async (req,res,next) => {

    // Finding all the questions from the Question collection
    let questions;
    try{
        questions = await Question.find();
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // If there are no question in out database
    if(!questions || questions.length === 0){
        return res.json({message:"No questions found"});
    }

    res.json({questions:questions.map((ques) => ques.toObject({getters:true}))});
    
}

const getQuestionById = async (req,res,next) => {

    // Getting the questionId from the route
    const questionId = req.params.questionId;

    // Finding the question by it's Id
    let questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the question is not found
    if(!questionFound){
        next(new HttpError('Question not found',500));
    }
    
    res.json({question:questionFound.toObject({getters:true})});
    
}

const getQuestionsByCategory = async (req,res,next) => {

    const category = req.params.category;

    let questionsFound;
    try{
        questionsFound = await Question.find({ category : category });
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questionsFound || questionsFound.length === 0){
        return res.json({message:"No questions of mentioned category"});
    }

    res.json({questions:questionsFound.map((ques) => ques.toObject({getters:true}))});
    
}

const newQuestion = async (req,res,next) => {

    // Validating the input give by the body
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    // Taking the data from the body
    const {userId , title , category , wholeQuestion} = req.body;
    
    // Finding the user by the given userId
    let userFound;
    try{
        userFound = await User.findById(userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user not found
    if(!userFound){
        next(new HttpError('Invalid userId!',500));
    }

    // Making the Question object
    const newQuestion = new Question({
        userId,
        userName:userFound.name,
        title,
        category,
        wholeQuestion,
        answers:[]
    });
    
    // Saving the question
    try{

        // Making the Session because we have to do multiple operations with different databases
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Saving the new Question
        await newQuestion.save({ session:sess });

        // Adding this question into the user's data 
        userFound.questions.push(newQuestion);
        await userFound.save({ session : sess });

        // Commiting the transaction
        sess.commitTransaction();

    }catch(err){
        console.log(err);
        next(new HttpError('Data is not Saved',500));
    } 

    res.json({question:newQuestion.toObject({getters:true})});
}

const updateQuestion = async (req,res,next) => {

    // Validation input comming from the body
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.message);
        next(new HttpError('Invalid input.Please enter again',422));
    }

    // Taking questionId from the route
    const questionId = req.params.questionId;

    // Taking the input from the body
    const { title , category , wholeQuestion } = req.body;

    // Finding the question qhich is to be updated
    let questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing the error if the question is not found
    if(!questionId){
        next(new HttpError('Question not found',500));
    }

    // Updating the data to question
    questionFound.title = title;
    questionFound.category = category;
    questionFound.wholeQuestion = wholeQuestion;
    // Not perfet can be changed
    // questionFound.answers = [];

    // Saving the changes
    try{
        await questionFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError("Updation falied",500));
    }
    
    res.json({question:questionFound.toObject({getters:true})});
    
}

const deleteQuestion = async (req,res,next) => {

    // Taking questionId from route
    const questionId = req.params.questionId;

    // Finding the question which is to be deleted
    let  questionFound;
    try{
        questionFound = await Question.findById(questionId).populate('answers');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Throwing error if question not found
    if(!questionFound){
        next(new HttpError('Question not found',500));
    }

    // Finding the user who has asked this question  
    let creator;
    try{
        creator = await User.findById(questionFound.userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    // Removing all the answers of that question
    questionFound.answers.forEach(async (ans) => {
        let answerFound;
            try{
                // Finding that answer and the user who has qiven the answer of that question
                answerFound = await Answer.findById(ans).populate('userId');
            }catch(err){
                console.log(err);
                next(new HttpError("Something went wrong",500));
            }
    
            // Removing the answer from the user data and deleting the answer itself
            try{
                const session = await mongoose.startSession();
                session.startTransaction();

                // Removing an answerID from user
                answerFound.userId.answers.pull(answerFound);
                await answerFound.userId.save({ session:session });

                // Removeing answer
                await answerFound.remove({ session:session });

                session.commitTransaction();
            }catch(err){
                console.log(err);
                next(new HttpError("Answers of that questions were not deleted",500));
            }
        
    });

    // Removing the question from user's data and the deleting the question itself
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Removing the questionId from user
        creator.questions.pull(questionFound);
        await creator.save({ session : sess});
        
        // Removing the question
        await questionFound.remove({session : sess});

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    res.json({message:"Question deleted successfully"});
    
}

exports.newQuestion = newQuestion;
exports.getQuestionById = getQuestionById;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionsByCategory = getQuestionsByCategory;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;