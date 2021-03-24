import React, { useEffect, useState } from 'react';
import {useParams,Link} from 'react-router-dom';

import "./UserAnswers.css";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Categories from '../components/Categories';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ratings from '../../photos/ratings.svg';


const UserAnswers = () => {

    // Getting userId from the route
    const userId = useParams().userId;

    // State for storing all the answers and respective question
    const [quesAns , setQuesAns] = useState();

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
                const response = await fetch(`http://localhost:5000/api/user/${userId}/answers`);
                const responseData = await response.json();

                // Throwing error comming from backend
                if(responseData.message && responseData.message !== "No answers are given by user"){
                    throw new Error(responseData.message);
                }

                // Storing the user question and asnwers in our State
                setQuesAns(responseData.quesAns);
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

            {/* Showing the user answers with respective questions after the data is received from backend */}
            { !isLoading && (
                <div className="home">
                    <div className="left">
                        <Categories />
                    </div>
                    <div className="right">
                        { quesAns && (
                            quesAns.map(qa => {
                                return(
                                    <div className="container">
                                        <div className="user-icon"><AccountCircleIcon style={{fontSize:"3.3rem"}}/></div>
                                        <h6 className="student-name">{qa.question.userName} • just now</h6>
                                        <Link to={`/ques/${qa.question._id}`}>
                                            <h4 className="question-title">{qa.question.title}</h4>
                                        </Link>
                                        <div className="answer-container-save">
                                            <div className="user-icon"><AccountCircleIcon style={{fontSize:"3.3rem"}}/></div>
                                            <h6 className="student-name" >{qa.ans.userName}'s Answer:- </h6>   
                                            <h6 className="category">{qa.ans.rating}<img className="ratings-img" src={ratings}></img></h6>                                                                 
                                            
                                            <p className="answers">{qa.ans.answer}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        { !quesAns && <h1>No answers are given by user</h1>}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default UserAnswers;