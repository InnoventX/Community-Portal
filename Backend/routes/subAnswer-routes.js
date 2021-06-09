const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check} = require('express-validator');

const subAnswerControllers = require('../controllers/subAnswers-controller');
const HttpError = require('../util/http-error-message');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require("../models/user-model");
const authCheck = require("../middlewares/auth-check");

router.get("/:answerId",subAnswerControllers.getSubAnswersByAnswerId);

router.use(authCheck);

router.post("/:answerId/newSubAnswer",subAnswerControllers.newSubAnswer);

module.exports = router;
