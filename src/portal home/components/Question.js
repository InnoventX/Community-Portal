// This component is responsible for rendering the question block on Portal's home page

import React from 'react';
import {Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import "./Question.css";

const Question = (props) => {
    return(
        <React.Fragment>
            <Link to={`/ques/${props.id}`} style={{textDecoration:"none"}}>
                <div className="question-container">
                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                <h6 className="student-name">{props.userName}</h6>
                <h4 className="question-title">{props.title}</h4>
                <p>{props.wholeQuestion.substring(0,100) + '...'}</p>
                </div>
            </Link>
        </React.Fragment>

    );
}

export default Question;