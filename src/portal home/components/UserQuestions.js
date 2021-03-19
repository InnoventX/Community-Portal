import React from 'react';
import {useParams} from 'react-router-dom';
import myQuestions from './questions';

const UserQuestions = () => {
    const userId = useParams().userId;

    const userQuestions = myQuestions.find((ques) => {
        return ques.studentName === userId;
    });

    if(!userQuestions){
        return(
            <h1>No Questions</h1>
        )
    }
    
    return(
        <React.Fragment>
            {userQuestions}
        </React.Fragment>
    )
}

export default UserQuestions;