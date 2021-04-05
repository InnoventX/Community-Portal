import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';

import "./UserQuestions.css";
import QuesList from './QuesList';
import Categories from './Categories';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserQuestions = () => {
    const userId = useParams().userId;

    // State for storing all the questions of the given category
    const [userQuestions , setUserQuestions] = useState();

    // State for Loading spinner & Error model
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState();

    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
    }

    // Sending the get request
    useEffect(() => {

        const sendRequest = async () => {
            try{
                // Turning on the loading spinner
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/user/${userId}/questions`);
                const responseData = await response.json();

                // Throwing error comming from backend
                if(responseData.message && responseData.message !== "No questions found"){
                    throw new Error(responseData.message);
                }

                // Storing the user questions in our State
                setUserQuestions(responseData.questions);
            }catch(err){
                console.log(err);
                // Setting the error in frontend
                setError(err.message);
            }
            // Turning off the loading spinner after the data is received
            setIsLoading(false);
        }
        sendRequest();
    } , []);    

    return(
        <React.Fragment>
            
            {/* Showing error if occured */}
            {error && (
                <React.Fragment>
                    <Backdrop onClick={errorHandler} />
                    <ErrorModal heading="Error Occured!" error={error} />
                </React.Fragment>
            )}

            {/* Showing Loading spinner */}
            {isLoading && <LoadingSpinner asOverlay />}

            {/* Showing the user questions after the data is received from backend */}
            { !isLoading && (
                <div className="home">
                    <div className="left">
                        <Categories />
                    </div>
                    <div className="right">
                        { userQuestions && <QuesList allQuestions={userQuestions} /> }
                        { !userQuestions && <h1 style={{color:"white"}}><i style={{color:"#ffc107"}} class="fas fa-exclamation-triangle"></i> No questios of this category available</h1>}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default UserQuestions;