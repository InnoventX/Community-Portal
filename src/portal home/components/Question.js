// This component is responsible for rendering the question block on Portal's home page

import React from 'react';
import {Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import answer from '../../photos/answer.svg';

import "./Question.css";

const Question = (props) => {
    return(
        <React.Fragment>
            
                <div className="question-container">
                    <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                    <h6 className="student-name">{props.userName}</h6>
                    <h6 className="category">{props.category}</h6>
                    <h4 className="question-title">{props.title}</h4>
                    <p className="read-more">{props.wholeQuestion.substring(0,120)}
                        <Link to={`/ques/${props.id}`} style={{textDecoration:"none"}}> ...(read more)</Link>
                    </p>
                    
                    <Link to={`/ques/${props.id}`} style={{textDecoration:"none"}}>
                            <button className="btn btn-warning"><img className="answer-img" src={answer} style={{width:"20%", height:"20%", float: "none"}}></img><u style={{marginLeft:"4%"}}> {props.answers.length} Answers</u></button>
                    </Link>                
                </div>
        </React.Fragment>

    );
}

export default Question;