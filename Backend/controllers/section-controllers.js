const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");
const Course = require("../models/course-model");
const Section = require("../models/section-model");
const crypto = require('crypto');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const getSubtopicById = async (req, res, next) => {

    const sectionId = req.params.sectionId;
    const userId = req.params.userId;

    let sectionFound;
    let courseFound = [];
    let courseName;
    let userFound
    try{
        sectionFound = await Section.findById(sectionId);
        courseName = sectionFound.coursesName;
        courseFound = await Course.find({name: courseName});
    }catch(err) {
        console.log(err);
        return next(new HttpError("something went wrong!!", 500));
    }

    if(!sectionFound) {
        return next(new HttpError('Section not Found!!!', 500));
    }

    // Updating the latest section in user 
    try{
        userFound = await User.findById(userId);  
        
        const courseInUser  = userFound.myCoursesData.find(myCourse => myCourse.courseName == courseFound[0].name);

        if(!courseInUser){
            return next(new HttpError('Course is not purchased by user', 500));
        }

        courseInUser.lastSeenSectionId = sectionFound._id;
        await userFound.save();
    }catch(err){
        console.log(err);
        return next(new HttpError("SectionId is not saved in user", 500));
    }

    res.json({
        courseId:courseFound[0].toObject({getters: true}),
        section:sectionFound.toObject({getters:true})
    });

}

const getFirstSubtopicById = async (req, res, next) => {

    const sectionId = req.params.sectionId;

    let sectionFound;
    let courseFound = [];
    let courseName;
    try{
        sectionFound = await Section.findById(sectionId);
        courseName = sectionFound.coursesName;
        courseFound = await Course.find({name: courseName});
    }catch(err) {
        console.log(err);
        return next(new HttpError("something went wrong!!", 500));
    }

    if(!sectionFound) {
        return next(new HttpError('Section not Found!!!', 500));
    }

    res.json({
        courseId:courseFound[0].toObject({getters: true}),
        section:sectionFound.toObject({getters:true})
    });

}

exports.getSubtopicById = getSubtopicById;
exports.getFirstSubtopicById = getFirstSubtopicById;