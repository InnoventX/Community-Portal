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
                            key={course.id}
                            id={course.id}
                            name={course.name} 
                            rating={course.rating}
                            price={course.price}
                        />
                    )
                })
            }
        </React.Fragment>
    )
}

export default AllCourses;