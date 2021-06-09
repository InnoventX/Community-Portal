const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check} = require('express-validator');

const answerControllers = require('../controllers/answer-controllers');
const HttpError = require('../util/http-error-message');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require("../models/user-model");
const fileUpload = require("../middlewares/file-upload");

// It will order the answers by RATING
router.get("/:questionId/" , answerControllers.getAnswersByQuestionId);

router.get("/getAnswer/:answerId",answerControllers.getAnswerById);

router.post("/:questionId/",
            fileUpload.single('image'),
            [
                check('userId').not().isEmpty(),
                check('answer').not().isEmpty()
            ],
             answerControllers.giveAnswer);

router.patch("/:answerId",
            [
                check('answer').not().isEmpty()
            ],
             answerControllers.updateAnswer);

router.patch("/rating/:answerId" , answerControllers.incrementRating);

router.delete("/:answerId", answerControllers.deleteAnswer );

module.exports = router;
