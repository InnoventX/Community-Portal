const HttpError = require('../util/http-error-message');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require("../models/user-model");
const Subanswer = require("../models/subanswer-model");
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const newSubAnswer = async(req, res, next) => {
    const parentAnswerId = req.params.answerId;

    const { userId, subAnswer } = req.body;

    let userFound;
    try {
        userFound = await User.findById(userId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!userFound) {
        return next(new HttpError("User not found", 500));
    }

    let parentAnswer;
    try {
        parentAnswer = await Answer.findById(parentAnswerId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    const newSubAnswer = new Subanswer({
        userId,
        userName: userFound.name,
        userImage: userFound.image,
        parentAnswerId,
        subAnswer,
        image: 'https://picsum.photos/200/300'
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await newSubAnswer.save({ session: sess });

        parentAnswer.subAnswers.push(newSubAnswer);
        await parentAnswer.save({ session: sess });

        sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong.Sub-Answer is not saved', 500));
    }

    res.json({ subAnswer: newSubAnswer.toObject({ getters: true }) });
}


const getSubAnswersByAnswerId = async(req, res, next) => {
    const answerId = req.params.answerId;

    let answerFound;
    try {
        answerFound = await Answer.findById(answerId).populate("subAnswers");
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong.Answer not found', 500));
    }

    if (!answerFound) {
        return next(new HttpError('Answer not found', 500));
    } else if (answerFound.subAnswers.length === 0) {
        return next(new HttpError('No sub-answers', 500));
    }

    res.json({ subAnswers: answerFound.subAnswers.map(ans => ans.toObject({ getters: true })) });
}

exports.newSubAnswer = newSubAnswer;
exports.getSubAnswersByAnswerId = getSubAnswersByAnswerId;