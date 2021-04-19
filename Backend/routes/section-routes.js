const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check} = require('express-validator');

const sectionController = require("../controllers/section-controllers");
const Question = require('../models/question-model');
const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");
const fileUpload = require("../middlewares/file-upload");

router.get("/:sectionId", sectionController.getSubtopicById);

module.exports = router;