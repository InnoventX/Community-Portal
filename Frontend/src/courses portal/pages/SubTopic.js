import React from 'react';
import {useParams,Link} from 'react-router-dom';

import mysubtopics from "./subtopics";
import mycourses from "./courses";

const SubTopic = () => {

    const subTopicName = useParams().subtopic;

    const subTopic = mysubtopics.find(sub => sub.name === subTopicName);
    const course = mycourses.find(c => c.name === subTopic.course);

    return(
        <React.Fragment>
            <h1>{subTopic.name}</h1>
            <h2>{course.name}</h2>
            <iframe width="420" height="315" src={`${subTopic.videoLink}`}></iframe>
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
                                                        <Link to={`/subtopic/${subTopic.subTopicName}`} style={{textDecoration:"none"}}>
                                                            <p>{subTopic.subTopicName}</p>
                                                        </Link>
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
        </React.Fragment>
    )
}

export default SubTopic;