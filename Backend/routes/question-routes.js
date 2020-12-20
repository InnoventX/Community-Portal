const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const questionsController = require("../controllers/question-controllers");
const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");

router.get("/", questionsController.getAllQuestions);

router.get("/:questionId", questionsController.getQuestionById);

router.get("/category/:category", questionsController.getQuestionsByCategory);

router.post("/", questionsController.newQuestion);

router.patch("/:questionId", questionsController.updateQuestion );

router.delete("/:questionId", questionsController.deleteQuestion );

module.exports = router;