const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check} = require('express-validator');


const questionsController = require("../controllers/question-controllers");
const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");

router.get("/", questionsController.getAllQuestions);

router.get("/:questionId", questionsController.getQuestionById);

router.get("/category/:category", questionsController.getQuestionsByCategory);

router.post("/",
            [
                check('userId').not().isEmpty(),    
                check('title').not().isEmpty(),
                check('category').not().isEmpty(),
                check('wholeQuestion').isLength({min:10})
            ], questionsController.newQuestion);

router.patch("/:questionId",
            [
                check('title').not().isEmpty(),
                check('category').not().isEmpty(),
                check('wholeQuestion').isLength({min:10})
            ], questionsController.updateQuestion );

router.delete("/:questionId", questionsController.deleteQuestion );

module.exports = router;
