const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userControllers = require("../controllers/user-controllers");
const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");

router.post("/signup",
            [
                check('name').not().isEmpty(),
                check('schoolName').not().isEmpty(),
                check('code').isLength({min:6}),
                check('email').isEmail(),
                check('password').isLength({min:6})
            ], 
            userControllers.siggnup);

// router.post("/signup",
//             [
//                 check('name').not().isEmpty(),
//                 check('email').isEmail(),
//                 check('password').isLength({min:6})
//             ], userControllers.siggnup);

router.post("/login",
            [
                check('email').isEmail(),
                check('password').isLength({min:6})
            ],
            userControllers.login);

router.post("/reset-password", userControllers.postReset);

router.post("/new-password", userControllers.newpassword);

router.get("/:userId",userControllers.getUserById);

router.get("/:userId/questions", userControllers.getQuestionByUserId);

router.get("/:userId/answers", userControllers.getAnswersByUserId);

router.get("/:userId/savedAnswers",userControllers.getSavedAnswers);

router.patch("/:userId/save/:answerId",userControllers.saveAnswer);

module.exports = router;