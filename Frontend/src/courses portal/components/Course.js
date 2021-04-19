import React from 'react';
import {Link} from 'react-router-dom';

import "./Course.css";
import ratings from '../../photos/ratings.svg';

const Course = (props) => {
    return(
        <React.Fragment>
            <div className='course-container shadows'>                
                <h3 className="course-name">{props.name}</h3>
                <p>{props.description[0].para}</p>
                <h6 className="rating">{props.rating}<img className="ratings-img" src={ratings}></img></h6>
                <p className="prices">₹ {props.price}</p>
                <Link to={`/course/${props.id}`} style={{textDecoration:"none"}}>
                    <button id="testbutton" className="btn"></button>
                </Link>
            </div>            
        </React.Fragment>
    )
}

export default Course;