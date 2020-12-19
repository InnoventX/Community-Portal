import React,{useState} from 'react';
import {useParams} from 'react-router-dom';

const UserQuestions = () => {
    const userID = useParams().userId;
    
    return(
        <React.Fragment>
            <h1>{userID}</h1>
        </React.Fragment>
    )
}

export default UserQuestions;