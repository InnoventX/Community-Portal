// This component is responsible for rendering all the questions on the Portal's home page
import React from 'react';

import Question from "./Question";
import "./QuesList.css"

// Passing all the information of single question to "Question" component
const QuesList = (props) => {

    return(
        <React.Fragment>
            <h6 className="answers-heading">FEED</h6>
            <hr/>
            {
                props.allQuestions.map((question) => {
                    return (<Question 
                        key={question.id}
                        id={question.id}
                        userId = {question.userId}
                        userName = {question.userName}
                        userImage = {question.userImage}
                        title = {question.title}
                        wholeQuestion = {question.wholeQuestion}
                        answers= {question.answers}
                        category={question.category}
                    />
                    );
                })
            }
        </React.Fragment>
    )
}

export default QuesList;
