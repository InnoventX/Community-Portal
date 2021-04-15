import React from 'react';
import {Link} from 'react-router-dom';

import "./Course.css";

const Course = (props) => {
    return(
        <React.Fragment>
            <div className='course-container'>
                <h3>{props.name}</h3>
                <h6>{props.rating}</h6>
                <h5>{props.price}</h5>
                <Link to={`/course/${props.id}`} style={{textDecoration:"none"}}>
                    <button>Enroll</button>
                </Link>
            </div>            
        </React.Fragment>
    )
}

export default Course;