import React,{useState} from 'react';
import {useParams} from 'react-router-dom';

import myCourses from "./courses";
import "./CoursePage.css";

const CoursePage = () => {
    const courseId = useParams().courseId;

    const [courses,setCourses] = useState(myCourses);
    // const [course, setCourse] = useState();

    const course = courses.find(c => c.id===courseId);

    return(
        <React.Fragment>
            <div className="course">
                <h1>{course.name}</h1>
                <h6>Rating:- {course.rating}</h6>
                <h5>Price:- {course.price}</h5>
                <button>Enroll Now</button>
                <p>{course.totalTime}</p>
                <div className="description-container">
                    <h5>What you will learn</h5>
                    {
                        course.description.map(des => {
                            return(
                                <p>{des}</p>
                            )
                        })
                    }
                </div>

                <div className="course-content">
                    <h3>Course Content</h3>
                    <p>{course.topics.length} lectures</p>
                    <div className="topics-container">
                        {
                            course.topics.map(topic => {
                                return(
                                    <React.Fragment>
                                        <div>
                                            <h5>{topic.name}</h5>
                                            <a href={`#t${topic.id}`} className="arrow">-&gt;</a>
                                            <div className="subtopic-container" id={`t${topic.id}`}>
                                                {
                                                    topic.subtopics.map(subTopic => {
                                                        return(
                                                            <React.Fragment>
                                                                <p>{subTopic.subTopicName}</p>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CoursePage;