// This component is responsible for rendering all the questions on the Portal's home page

import React from 'react';

import Question from "./Question";
import "./QuesList.css"

const QuesList = (props) => {

    return(
        <React.Fragment>
            <h6 className="answers-heading">QUESTIONS</h6>
            <hr/>
            {
                props.allQuestions.map((question) => {
                    return (<Question 
                        id={question.id}
                        userId = {question.userId}
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
