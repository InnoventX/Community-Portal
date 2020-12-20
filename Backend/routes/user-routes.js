const express = require('express');
const router = express.Router();

const userControllers = require("../controllers/user-controllers");
const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");

router.post("/signup", userControllers.signup);

router.post("/login",userControllers.login);

router.get("/:userId/questions", userControllers.getQuestionByUserId);

router.get("/:userId/answers", userControllers.getAnswersByUserId);

module.exports = router;