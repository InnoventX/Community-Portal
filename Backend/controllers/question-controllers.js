const { RestaurantOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');

const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");
const Answer = require('../models/answer-model');

const getAllQuestions =async (req,res,next) => {

    let questions;
    try{
        questions = await Question.find();
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questions || questions.length === 0){
        return res.json({message:"No questions found"});
    }

    res.json({questions:questions.map((ques) => ques.toObject({getters:true}))});
    
}

const getQuestionById = async (req,res,next) => {

    const questionId = req.params.questionId;

    let questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questionFound){
        next(new HttpError('Question not found',500));
    }

    let userFound;
    try{
        userFound = await User.findById(questionFound.userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong'));
    }
    
    res.json({userName:userFound.name , question:questionFound.toObject({getters:true})});
    
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

    const {userId , title , category , wholeQuestion} = req.body;
    const newQuestion = new Question({
        userId,
        title,
        category,
        wholeQuestion,
        answers:[]
    });

    let userFound;
    try{
        userFound = await User.findById(userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!userFound){
        next(new HttpError('Invalid userId!',500));
    }
    
    try{

        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newQuestion.save({ session:sess });
        userFound.questions.push(newQuestion);
        await userFound.save({ session : sess });
        sess.commitTransaction();

    }catch(err){
        console.log(err);
        next(new HttpError('Data is not Saved',500));
    } 

    res.json({question:newQuestion.toObject({getters:true})});
}

const updateQuestion = async (req,res,next) => {

    const questionId = req.params.questionId;

    const { title , category , wholeQuestion } = req.body;

    let questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questionId){
        next(new HttpError('Question not found',500));
    }

    questionFound.title = title;
    questionFound.category = category;
    questionFound.wholeQuestion = wholeQuestion;
    // Not perfet can be changed
    questionFound.answers = [];

    try{
        await questionFound.save();
    }catch(err){
        console.log(err);
        next(new HttpError("Updation falied",500));
    }
    
    res.json({question:questionFound.toObject({getters:true})});
    
}

const deleteQuestion = async (req,res,next) => {

    const questionId = req.params.questionId;

    let  questionFound;
    try{
        questionFound = await Question.findById(questionId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    if(!questionFound){
        next(new HttpError('Question not found',500));
    }

    let creator;
    try{
        creator = await User.findById(questionFound.userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong',500));
    }

    /* Answer removing is left
    let answers;
    answers = questionFound.answers;

    console.log(answers);
    if(answers && answers.length !== 0)
    {
        for(ans in answers){
        
            let answerFound;
            try{
                answerFound = await Answer.findById(ans).populate('userId');
            }catch(err){
                console.log(err);
                next(new HttpError("Something went wrong",500));
            }
    
            try{
                const session = await mongoose.startSession();
                session.startTransaction();

                answerFound.userId.pull(answerFound);
                await answerFound.userId.save({ session:session });

                await answerFound.remove({ session:session });

                session.commitTransaction();
            }catch(err){
                console.log(err);
                next(new HttpError("Answers of that questions were not deleted",500));
            }
        }
    }
    */
    

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        creator.questions.pull(questionFound);
        await creator.save({ session : sess});
        
        await questionFound.remove({session : sess});

        // Still answers removal is panding
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