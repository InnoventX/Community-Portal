import React,{useState} from 'react';

import Course from "./Course";

const AllCourses = (props) => {
    const [courses, setCourses] = useState(props.courses);
    return(
        <React.Fragment>
            {
                courses.map(course => {
                    return(
                        <Course
                            id={course.id}
                            name={course.name}
                            description={course.desc} 
                            rating={course.rating}
                            price={course.price}
                            totalTime={course.totalTime}
                            lastSeenSectionId={course.lastSeenSectionId ? course.lastSeenSectionId : null}
                        />
                    )
                })
            }
        </React.Fragment>
    )
}

export default AllCourses;