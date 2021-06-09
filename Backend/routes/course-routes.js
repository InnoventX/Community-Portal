const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const courseController = require('../controllers/course-controller');

router.post("/add-course",
    [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    ],
    courseController.addCourse);

router.get("/", courseController.getAllCourse);    

router.get("/:courseId", courseController.getCourseById);

router.post("/enrollcourse/:courseId", courseController.enrollCourse);

module.exports = router;