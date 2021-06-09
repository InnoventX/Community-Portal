const HttpError = require("../util/http-error-message");
const User = require("../models/user-model");
const Course = require("../models/course-model");
const Section = require("../models/section-model");
const crypto = require('crypto');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const addCourse = async(req, res, next) => {

    // Validating the input give by the body
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error.message);
        throw new HttpError('Invalid input.Please enter again', 422);
    }
    const { name, topics, desc, price, totalTime } = req.body;

    console.log(req.body);
    const newTopic = [];
    let latestSubTopic;
    let newSubTopic = [];
    for (let i = 0; i < topics.length; i++) {

            for (let j = 0; j < topics[i].subTopics.length; j++) {
                latestSubTopic = new Section({
                    sectionName: topics[i].subTopics[j].sectionName,
                    videoLink: topics[i].subTopics[j].videoLink,
                    time: topics[i].subTopics[j].time,
                    coursesName: name,
                });
            
                newSubTopic.push(latestSubTopic);

                await newSubTopic[j].save();
            }


        newTopic.push({
            topicName: topics[i].topicName,
            subTopics: newSubTopic,
            sectionTime: topics[i].sectionTime,
        })

        newSubTopic = [];

    }

    const newCourse = new Course({
        name: name,
        topics: newTopic,
        desc: desc,
        price: price,
        rating: 0,
        userWhoHasBought: [],
        totalTime: totalTime,
    });

    await newCourse.save();

    res.json({ question: newCourse.toObject({ getters: true }) });

}

const getAllCourse = async (req, res, next) => {

    let courses;
    try {
        courses = await Course.find();
    }catch(err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if(!courses || courses.length === 0) {
        return res.json({message: "No Course found"});
    }

    res.json({courses: courses.map((cour) => cour.toObject({getters: true}))});

}

const getCourseById = async (req, res, next) => {

    const courseId = req.params.courseId;
    console.log(courseId);
    let courseFound;
    try {
        courseFound = await Course.findById(courseId);
    }catch(err) {
        console.log(err);
        return next(new HttpError("something went wrong", 500));
    }

    if(!courseFound) {
        return next(new HttpError("Course not Found!!!", 500));
    }

    res.json({course:courseFound.toObject({getters: true})});

}

const enrollCourse = async (req, res, next) => {

    const userId = req.body.userId;
    const courseId = req.params.courseId
    let course;
    
    // Finding the user by the given userId
    let userFound;
    try{
        userFound = await User.findById(userId);
        course = await Course.findById(courseId);
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
    }

    // Throwing error if the user not found
    if(!userFound){
        return next(new HttpError('Invalid userId!',500));
    }

    const courseAddedInUser = {
        courseName: course.name,
        lastSeenSectionId: course.topics[0].subTopics[0]._id
    }

    try{

        const sess = await mongoose.startSession();
        sess.startTransaction();

        course.userWhoHasBought.push(userFound);
        await course.save({session:sess})

    // Adding this question into the user's data 
        userFound.courses.push(course);
        userFound.myCoursesData.push(courseAddedInUser);
        await userFound.save({session:sess});

        sess.commitTransaction();

    }catch(err){
        console.log(err);
        return next(new HttpError('Data is not Saved',500));
    } 
    
    res.json({user:userFound.toObject({getters:true})});

}

exports.addCourse = addCourse;
exports.getAllCourse = getAllCourse;
exports.getCourseById = getCourseById;
exports.enrollCourse = enrollCourse;