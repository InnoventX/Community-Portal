const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const answerControllers = require('../controllers/answer-controllers');
const HttpError = require('../util/http-error-message');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require("../models/user-model");
const { Http } = require('@material-ui/icons');

router.post("/:questionId/", answerControllers.giveAnswer);

router.patch("/:answerId", answerControllers.updateAnswer);

router.delete("/:answerId", answerControllers.deleteAnswer );

module.exports = router;