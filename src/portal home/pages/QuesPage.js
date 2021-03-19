import React,{useState, useContext, useEffect} from 'react';
import {useParams, Link , useHistory} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import "./QuesPage.css";
import {AuthContext} from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const QuesPage = () => {

    // Using history to get redirected to "/" route if the question is deleted
    const history = useHistory();

    // For components which shoul be rendered when the user is authenticated
    const auth = useContext(AuthContext);

    // State to render delete modal for question & answer
    const [deleteSection , setDeleteSection] = useState();

    // Getting QuestionID from the route
    const quesId = useParams().quesID;

    // State which are used in this page
    const [question,setQuestion] = useState();
    const [answers , setAnswers] = useState();
    const [error, setError] = useState();
    const [isLoading , setIsLoading] = useState(false);

    // Answer STATE used after adding other ANSWER
    const [ansGiven, setAnsGiven] = useState();
    const [submitAnswer , setSubmitAnswer] =  useState(false);
 
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

    // Using useEffect hoock which renders question and it's answers,this should only be rendered when submitAnswer changes.  
    useEffect(() => {

        // Making another function because we cannot write async in useEffect function
        const sendRequest = async () => {

            try{
                // Showing the loading spinner
                setIsLoading(true);

                // Getting the question from the backend api
                const getQuestion = await fetch(`http://localhost:5000/api/question/${quesId}`);
                const responseDataOfQuestion = await getQuestion.json();

                if(responseDataOfQuestion.message){
                    throw new Error(responseDataOfQuestion.message);
                }

                // Assigning the backend responce to the frontend states
                setQuestion(responseDataOfQuestion.question);

                // Getting all the answers of that perticular question
                const getAnswers = await fetch(`http://localhost:5000/api/answer/${quesId}`);
                const responseDataOfAnswers = await getAnswers.json();

                if(responseDataOfAnswers.message && responseDataOfAnswers.message!=="No answers found of that question"){
                    throw new Error(responseDataOfAnswers.message);
                }

                // Assigning the backend responce to the frontend states
                setAnswers(responseDataOfAnswers.answers);
                
            }catch(err){
                console.log(err);

                // Showing the error message comming from backend
                setError(err.message);
            }

            // Turning off the loading spinner
            setIsLoading(false);
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
        setSubmitAnswer(true);
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


    return(
            <div className="question-container">

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

                        {/* Showing the Student's details who had asked the question */}
                        <React.Fragment>
                            <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                            <h6 className="student-name">{question.userName}</h6>
                        </React.Fragment>

                        {/* Showing the update & delete button if the user is authenticated and have asked the question */}
                        { (auth.userId === question.userId) ? (
                            <React.Fragment>
                                <Link to={`/${quesId}/update`}>
                                    <button className="update-btn" >UPDATE</button>
                                </Link>

                                <button className="delete-btn" name="question" onClick={showDeleteSection}>DELETE</button>
                            </React.Fragment>
                            ): null
                        }

                        {/* Showing question's data */}
                        <h4 className="question-title">{question.title}</h4>
                        <p>Category -- {question.category}</p>
                        <p>{question.wholeQuestion}</p>

                        {/* Showing all the answers of thaat question */}
                        {answers && (
                            <div className="answers-div">
                                {   
                                    answers.map((ans) => {
                                        return (
                                            <React.Fragment>
                                                <h6>{ans.userName}</h6>
                                                <button><StarBorderIcon style={{display:"inlineBlock"}}/></button>
                                                { auth.userId === ans.userId ? (
                                                    <React.Fragment>
                                                        <button className="update-btn" >UPDATE</button>
                                                        <button className="delete-btn" name={ans.id} onClick={showDeleteSection}>DELETE</button>
                                                    </React.Fragment>
                                                    ):null
                                                }
                                                <p >Rating :- {ans.rating}</p>
                                                <p className="answers">{ans.answer}</p>
                                                <hr style={{width:"95%",margin:"0 auto"}}/>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </div>
                        )}       

                        {/* Allowing the user to give answer only if he is authenticated */}
                        { auth.isLogedIn && (
                                <button className="give-ans-btn" onClick={() => {
                                    showPostSection()
                                }}>Give Answer</button>
                            )
                        }

                        {/* Showing the Give Answer block */}
                        <div className="post-ans-div">
                            <hr />
                            <form onSubmit={nowPostAns}>
                                <textarea className="post-ans-text" rows="3" value={ansGiven} onChange={handleGivenAns}/>
                                <button type="submit" className="post-btn">Post</button>
                            </form>
                        </div>
                    </React.Fragment>    
                )}
                
            </div>   
    );
}

export default QuesPage;