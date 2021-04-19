const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");
const Course = require("../models/course-model");
const Section = require("../models/section-model");
const crypto = require('crypto');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const getSubtopicById = async (req, res, next) => {

    const sectionId = req.params.sectionId;

    let sectionFound;
    let courseFound = [];
    let courseName;
    let topics = [];
    try{
        sectionFound = await Section.findById(sectionId);
        courseName = sectionFound.coursesName;
        courseFound = await Course.find({name: courseName});
        topics = courseFound[0].topics;
        console.log(courseFound[0].topics);
    }catch(err) {
        console.log(err);
        next(new HttpError("something went wrong!!", 500));
    }

    if(!sectionFound) {
        next(new HttpError('Section not Found!!!', 500));
    }

    res.json({
        courseId:courseFound[0].toObject({getters: true}),
        topics:topics.map((t) => t.subTopics.map(st => st.toObject({getters: true}))),
        section:sectionFound.toObject({getters:true})
    });

}

exports.getSubtopicById = getSubtopicById;