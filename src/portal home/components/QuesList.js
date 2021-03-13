import React from 'react';

import Question from "./Question";
import "./QuesList.css"

const QuesList = (props) => {
    return(
        <React.Fragment>
            <h6 className="answers-heading">ANSWERS</h6>
            <hr/>
            {
                props.allQuestions.map((question) => {
                    return (<Question 
                        id={question.id}
                        studentName = {question.studentName}
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