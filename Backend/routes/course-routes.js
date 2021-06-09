const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const courseController = require('../controllers/course-controller');
const authCheck = require("../middlewares/auth-check");

router.get("/", courseController.getAllCourse);    

router.get("/:courseId", courseController.getCourseById);

router.use(authCheck);

router.post("/enrollcourse/:courseId", courseController.enrollCourse);

router.post("/add-course",
    [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    ],
    courseController.addCourse);

module.exports = router;