import React,{useState, useContext, useEffect} from 'react';
import {useParams, Link , useHistory} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import "./QuesPage.css";
import {AuthContext} from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import update from '../../photos/update.svg';
import del from '../../photos/delete.svg';
import addans from '../../photos/add-answer.svg';
import ratings from '../../photos/ratings.svg';
import showmore from '../../photos/show-more.svg';
import rate from '../../photos/rate.svg';
import post from '../../photos/post.svg';


const QuesPage = () => {

    // Using history to get redirected to "/" route if the question is deleted
    const history = useHistory();

    // For components which shoul be rendered when the user is authenticated
    const auth = useContext(AuthContext);

    // State to render delete modal for question & answer
    const [deleteSection , setDeleteSection] = useState();

    // Getting QuestionID from the route
    const quesId = useParams().quesID;

    // State which are used to store data from "GET question request" 
    const [question,setQuestion] = useState();
    const [answers , setAnswers] = useState();
    const [error, setError] = useState();
    const [isLoading , setIsLoading] = useState(false);

    // Answer STATE used after adding other ANSWER
    const [ansGiven, setAnsGiven] = useState();
    const [submitAnswer , setSubmitAnswer] =  useState(false);

    // State fro handle increment of rating for answers
    const [stopIncerement , setStopIncrement] = useState(false);

    const [showAllAnswers,setShowAllAnswers] = useState(false);

    const  [subAnswer , setSubAnswer] = useState();

    // Showing POST ANSWER block
    const showPostSection = () => {
        // It will display the GiveAnswer block when we chick the button and hide when we again click it.
        const postDiv = document.querySelector(".post-ans-div");
        if(postDiv.style.display === "none"){
            postDiv.style.display = "block";
        }
        else{
            postDiv.style.display = "none";
        }
    }

    // Updating the ANSWER state
    const handleGivenAns = (event) => {
        const ans = event.target.value;
        setAnsGiven(ans);
    }

    // Showing delete section
    const showDeleteSection = (event) => {
        // event.target.name will contain the name which shoul be deleted( Question 0r Answer )
        const commingFrom = event.target.name;
        setDeleteSection(commingFrom);
    }

    // Closing delete section
    const cancleShowDeleteSection = () => {
        setDeleteSection(null);
    }

    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
    }

    // When user clicks "show more" button
    const handleShowAllAnswers = () => {
        // Now stop displaying the button
        const btn = document.querySelector(".show-more-btn");
        btn.style.display="none";
        // switching the state to show all answers
        setShowAllAnswers(true);
    }

    const showSubAnswerDiv = (answerId) => {
        const subAnsDiv = document.querySelector(`.sub-ans-div.ans-${answerId}`);
        if(subAnsDiv.style.display === "none"){
            subAnsDiv.style.display = "block";
        }else{
            subAnsDiv.style.display = "none";
        }   
    }

    const handleSubAnswer = (event) => {
        const subAns = event.target.value;
        setSubAnswer(subAns);
    }

    // Using useEffect hoock which renders question and it's answers,this should only be rendered when submitAnswer changes.  
    useEffect(() => {

        // Making another function because we cannot write async in useEffect function
        const sendRequest = async () => {

            try{
                // Showing the loading spinner
                setIsLoading(true);

                // Getting question & all the answers of that perticular question
                const response = await fetch(`http://localhost:5000/api/answer/${quesId}`);
                const responseData = await response.json();

                if(responseData.message && responseData.message!=="No answers found of that question"){
                    throw new Error(responseData.message);
                }

                // Assigning the backend responce to the frontend states
                setQuestion(responseData.question);
                // setAnswers(responseData.answers);

                if(responseData.answers){
                    responseData.answers.forEach(async (ans,index) => {
                        if(ans.subAnswers.length !== 0){
                            const getSubAnswers = await fetch(`http://localhost:5000/api/subAnswer/${ans.id}`);
                            const getSubAnswersData = await getSubAnswers.json();
                            
                            if(getSubAnswersData.message){
                                throw new Error(getSubAnswersData.message);
                            }
    
                            ans.subAnswers = getSubAnswersData.subAnswers;
                                  
                        }
                        if(index === (responseData.answers.length - 1)){
                            setAnswers(responseData.answers);
                            setIsLoading(false);
                        }
                    })
                }else{
                    setIsLoading(false);
                }
                
                
            }catch(err){
                console.log(err);

                // Showing the error message comming from backend
                setError(err.message);
                setIsLoading(false);
            }

            // Turning off the loading spinner
            // setIsLoading(false);
        }
        sendRequest();
    },[submitAnswer]);

    // Posting the NEW ANSWER
    const nowPostAns = async (event) => {
        // Prevent the default when the button is clicked
        event.preventDefault();

        // Posting the answer using backend api
        try{
            const response = await fetch(`http://localhost:5000/api/answer/${quesId}/`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    userId:auth.userId,
                    answer:ansGiven
                })
            });
            const responseData = await response.json();

            if(responseData.message){
                throw new Error(responseData.message);
            }
        }catch(err){
            console.log(err);
            // beacause we are doing multiple operations in backend
            if(err.message !== "WriteConflict error: this operation conflicted with another operation. Please retry your operation or multi-document transaction."){
                setError(err.message);
            }
        }
        // Turning this state because we want to rerender the question with updation in answers array
        setSubmitAnswer(prevValue => !prevValue);
    }

    // Deleating the question
    const deleteQuestion = async () => {

        // Sending Request to delete the question 
        try{
            const response = await fetch(`http://localhost:5000/api/question/${quesId}/`,{
                method:'DELETE'
            });
            const responseData = await response.json();

            // If the question is deleted then redirectign to the root route where all the questions are displayed
            if(responseData.message === "Question deleted successfully"){
                history.push("/");
            }else{
                // Throwing error if comming from backend
                throw new Error(responseData.message);
            }
        }catch(err){
            console.log(err);

            // Setting error in frontend
            setError(err.message);
        }
    }

    // Deleting the answer
    const deleteAnswer = async (event) => {
        
        // Getting answerId by the button name which triggers the event
        const answerId = event.target.name;

        // Sending the delete request
        try{
            const response = await fetch(`http://localhost:5000/api/answer/${answerId}`,{
                method:'DELETE'
            });
            const responseData = await response.json();
            
            // Rerendering this page by changing the submitAnswer state so that useEffect will be triggered after deleting answer
            if(responseData.message === 'Deleted successfully'){
                setDeleteSection(null);
                setSubmitAnswer(prevValue => !prevValue);
            }else{
                // Throwing error comming from backend
                throw new Error(responseData.message);
            }
        }catch(err){
            console.log(err);
            //Seting error in frontend
            setError(err.message);
        }
    }

    // Increments the rating of a particular answer
    const incrementRating = async (answerId) => {
        
        // Sending update request to increment rating
        try{
            const response = await fetch(`http://localhost:5000/api/answer/rating/${answerId}`,{
                method:'PATCH'        
            });
            const responseData = await response.json();

            // Throwing error comming from backend
            if(responseData.message){
                throw new Error(responseData.message);
            }

            // A user is only allowed to increment the rating once so after incrementation disableing the button
            setStopIncrement(true);

            // Rerendering the question again by sending the question request from useEffect
            setSubmitAnswer(prevValue => !prevValue)
        }catch(err){
            console.log(err);
            // Setting error in frontend
            setError(error);
        }
    }

    const saveAnswer = async (answerId) => {
        const userId = auth.userId;
    
        try{
            const response = await fetch(`http://localhost:5000/api/user/${userId}/save/${answerId}`,{
                method:'PATCH'
            });
            const responseData = await response.json();
    
            if(responseData.message){
                throw new Error(responseData.message);
            }
    
            setError("Saved successfully");
        }catch(err){
            console.log(err);
            setError(err.message);
        }
    }

    const postSubAns = async (answerId) => {
        console.log(subAnswer , answerId);
        const userId = auth.userId;
        try{
            const response = await fetch(`http://localhost:5000/api/subAnswer/${answerId}/newSubAnswer`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:userId,
                    subAnswer:subAnswer
                })
            });
            const responseData = await response.json();

            if(responseData.message){
                throw new Error(responseData.message);
            }

            setSubmitAnswer(prevValue => !prevValue);
        }catch(err){
            console.log(err);
            setError(err.message);
        }
    }

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

            {/* Rendering the component if all the data is received from backend */}
            {!isLoading && question && (
                <React.Fragment>

                    {/* Showing Delete Section when the button is clicked */}
                    { deleteSection && (
                        <React.Fragment>
                            <Backdrop onClick={errorHandler} />
                            <div className="show-delete-section">
                                <h1>Are You Sure?</h1>
                                <p>Do you want to delete your { deleteSection === "question" ? "question" : "answer" }</p>
                                {/* Checking which is to be deleted question or answer */}
                                <button onClick={deleteSection === "question" ? deleteQuestion : deleteAnswer} name={deleteSection}>DELETE</button>
                                <button onClick={cancleShowDeleteSection}>CANCLE</button>
                            </div>
                        </React.Fragment>
                    )}

                    {/* Showing question's data */}
                    <div className="question-container">
                        
                        {/* Showing the update & delete button of question if the user is authenticated and have asked the question */}
                        { (auth.userId === question.userId) ? (
                            <React.Fragment>
                                <button className="btn delete-btn" style={{float:"right"}} name="question" onClick={showDeleteSection}><img className="delete-img" src={del}></img>  DELETE</button>                                       
                                <Link to={`/${quesId}/update`}>
                                    <button className="btn update-btn" style={{float:"right"}}><img className="update-img" src={update}></img>UPDATE</button>
                                </Link>
                            </React.Fragment>
                            ): null
                        }
                            
                        <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                        <h6 className="student-name">{question.userName} • just now</h6>
                        <h6 className="category">{question.category}</h6>
                        <h4 className="question-title">{question.title}</h4>
                        <p>{question.wholeQuestion}</p>

                        {/* Give answers options if the user is authenticated */}
                        { auth.isLogedIn ? (
                            <React.Fragment>                            
                                {/* Displaying give answer option to give answer */}
                                <button className="give-ans-btn" onClick={() => {showPostSection()}}>
                                    <img className="add-ans-img" src={addans}></img>Give Answer
                                </button>
                            </React.Fragment>
                            ):(
                            <React.Fragment>
                                <a href="/authenticate"><button className="give-ans-btn"><img className="add-ans-img" src={addans}></img>Give Answer</button></a>
                            </React.Fragment>
                            )
                        }
                    </div>

                    {/* Showing the post answer block */}
                    <div className="post-ans-div">
                        <form onSubmit={nowPostAns}>
                            <textarea className="post-ans-text" rows="3" value={ansGiven} onChange={handleGivenAns} placeholder="   Type your answer here..."/>
                            <button type="submit" className="post-btn"><img className="post-img" src={post}></img>Post</button>
                        </form>
                    </div>
                        
                    { answers && (
                        <React.Fragment>
                            <h6 className="answers-heading">Answers</h6>
                            <hr/>
                        </React.Fragment>
                    )}

                    {/* Showing all the answers of that question */}
                    {answers && (
                        <div className="answers-div" >
                        {   
                            answers.map((ans,index) => {
                                if(!showAllAnswers && index<3){
                                    return (
                                        <React.Fragment>
                                            <div className="answer-container">
                                            
                                                {/* Showing the update & delete button of answer if the user have given that answer */}
                                                { auth.userId === ans.userId ? (
                                                    <React.Fragment>
                                                        <button className="btn delete-btn" style={{float:"right"}} name={ans.id} onClick={showDeleteSection}>
                                                            <img className="delete-img" src={del}></img>  DELETE
                                                        </button>
                                                        <Link to={`/update/${ans.id}`}>
                                                            <button className="btn update-btn" style={{float:"right"}}>
                                                                <img className="update-img" src={update}></img>UPDATE
                                                            </button>
                                                        </Link>
                                                    </React.Fragment>
                                                    ):null
                                                }

                                                {/* Showing the rating button to all the users who have not given this answer */}
                                                { auth.isLogedIn ? (
                                                    auth.userId !== ans.userId ? (
                                                        <button className="btn rate-btn" disabled={stopIncerement} onClick={() => {incrementRating(ans.id)}} style={{float:"right"}}>
                                                            <img className="rate-img" src={rate}></img>
                                                        </button>
                                                        ):null
                                                    ):(
                                                    <a href="/authenticate">
                                                        <button className="btn rate-btn" disabled={stopIncerement} onClick={() => {incrementRating(ans.id)}} style={{float:"right"}}>
                                                            <img className="rate-img" src={rate}></img>
                                                        </button>
                                                    </a> 
                                                    )
                                                }
                                        
                                                <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                                                <h6 className="student-name">{ans.userName} • just now</h6>
                                                <h6 className="category">{ans.rating}<img className="ratings-img" src={ratings}></img></h6>                                                                 
                                                <p className="answers">{ans.answer}</p>

                                                {( auth.isLogedIn && ans.subAnswers.length !== 0) ? (
                                                    ans.subAnswers.map((subAns) => {
                                                        return(
                                                            <React.Fragment>
                                                                
                                                                <div className="subANS">
                                                                    
                                                                    <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                                                                    <h6 className="student-name">{subAns.userName} • just now</h6>
                                                                    <h6 className="category">{ans.rating}<img className="ratings-img" src={ratings}></img></h6>
                                                                    <p className="answers">{subAns.subAnswer}</p>
                                                                </div>
                                                                
                                                            </React.Fragment>
                                                        )
                                                    })
                                                    ):null
                                                }
                                                        
                                                {/* To save the answer in users database */}
                                                { auth.isLogedIn && ((auth.userId !== ans.userId) && (
                                                    <button className="btn save-btn" style={{float:"left"}} onClick={() => {saveAnswer(ans.id)}}>
                                                        SAVE
                                                    </button>
                                                ))}

                                                { auth.isLogedIn && (
                                                    <button className="btn post-subAns-btn" style={{float:"left"}} onClick={() => {showSubAnswerDiv(ans.id)}}>
                                                        POST
                                                    </button>
                                                )}

                                                {/* Showing the post answer block */}
                                                <div className={`sub-ans-div ans-${ans.id}`}>
                                                    <form onSubmit={(event) => {
                                                        event.preventDefault();
                                                        postSubAns(ans.id);
                                                    }}>
                                                        <textarea className="post-ans-text" rows="3" value={subAnswer} onChange={handleSubAnswer} placeholder="     Write your query here .."/>
                                                        <button type="submit" className="post-btn"><img className="post-img" src={post}></img>Post</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                                else if(showAllAnswers){
                                    return (
                                        <React.Fragment>
                                            <div className="answer-container">
                                                {/* Showing the update & delete button if the user have given the answer */}
                                                { auth.userId === ans.userId ? (
                                                    <React.Fragment>
                                                        <button className="btn delete-btn" style={{float:"right"}} name={ans.id} onClick={showDeleteSection}><img className="delete-img" src={del}></img>  DELETE</button>
                                                        <Link to={`/update/${ans.id}`}>
                                                            <button className="btn update-btn" style={{float:"right"}}><img className="update-img" src={update}></img>UPDATE</button>
                                                        </Link>
                                                    </React.Fragment>
                                                    ):null
                                                }

                                                {/* Showing the rating button to all the users who have not given this answer */}
                                                { auth.isLogedIn ? (
                                                    auth.userId !== ans.userId ? (
                                                        <button className="btn rate-btn" disabled={stopIncerement} onClick={() => {incrementRating(ans.id)}} style={{float:"right"}}><img className="rate-img" src={rate}></img></button>
                                                        ):null
                                                    ):(
                                                    <a href="/authenticate">
                                                        <button className="btn rate-btn" disabled={stopIncerement} onClick={() => {incrementRating(ans.id)}} style={{float:"right"}}>
                                                            <img className="rate-img" src={rate}></img>
                                                        </button>
                                                    </a> 
                                                    )
                                                }
                                        
                                                <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                                                <h6 className="student-name">{ans.userName} • just now</h6>
                                                <h6 className="category">{ans.rating}<img className="ratings-img" src={ratings}></img></h6>                                                                                    
                                                <p className="answers">{ans.answer}</p>

                                                {( auth.isLogedIn && ans.subAnswers.length !== 0) ? (
                                                    ans.subAnswers.map((subAns) => {
                                                        return(
                                                            <React.Fragment>
                                                                
                                                                <div className="subANS">
                                                                    
                                                                    <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                                                                    <h6 className="student-name">{subAns.userName} • just now</h6>
                                                                    <h6 className="category">{ans.rating}<img className="ratings-img" src={ratings}></img></h6>
                                                                    <p className="answers">{subAns.subAnswer}</p>
                                                                </div>
                                                                
                                                            </React.Fragment>
                                                        )
                                                    })
                                                    ):null
                                                }

                                                {/* To save the answer in users database */}
                                                { auth.isLogedIn && ((auth.userId !== ans.userId) && (
                                                    <button className="btn save-btn" style={{float:"left"}} onClick={() => {saveAnswer(ans.id)}}>SAVE</button>
                                                ))}

                                                { auth.isLogedIn && (
                                                    <button className="btn post-subAns-btn" style={{float:"left"}} onClick={() => {showSubAnswerDiv(ans.id)}}>
                                                        POST
                                                    </button>
                                                )}

                                                {/* Showing the post answer block */}
                                                <div className={`sub-ans-div ans-${ans.id}`}>
                                                    <form onSubmit={(event) => {
                                                        event.preventDefault();
                                                        postSubAns(ans.id);
                                                    }}>
                                                        <textarea className="post-ans-text" rows="3" value={subAnswer} onChange={handleSubAnswer} placeholder="     Write your query here .."/>
                                                        <button type="submit" className="post-btn"><img className="post-img" src={post}></img>Post</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                }   
                            })
                        }
                        </div>
                    )}

                    {/* Show more options if the user is authenticated */}
                    { auth.isLogedIn ? (
                        <React.Fragment>
                            {/* If there are more then 3 answers then displaying show more option */}
                            {answers && ((answers.length>3) ? (
                                <button className="show-more-btn" onClick={handleShowAllAnswers}><img className="show-more-img" src={showmore}></img>Show more</button>
                            ):null)}                               
                        </React.Fragment>
                        ):(
                        <React.Fragment>
                            {/* This will redirect the users to authentication page because they are not logged in */}
                            {answers && ((answers.length>3) ? (
                                <a href="/authenticate"><button className="show-more-btn"><img className="show-more-img" src={showmore}></img>Show more</button></a>
                            ):null)}
                        </React.Fragment>
                        )
                    }

                </React.Fragment>    
            )}
                
        </React.Fragment>   
    );
}

export default QuesPage;