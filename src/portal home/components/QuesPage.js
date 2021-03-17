import React,{useState, useContext, useEffect} from 'react';
import {useParams,Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import "./QuesPage.css";
import {AuthContext} from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";


const QuesPage = () => {

    // For components which shoul be rendered when the user is authenticated
    const auth = useContext(AuthContext);

    // State to render delete modal
    const [deleteSection , setDeleteSection] = useState(false);

    // Getting QuestionID from the route
    const quesId = useParams().quesID;

    // State which are used in this page
    const [studentName , setStudentName] = useState();
    const [question,setQuestion] = useState();
    const [answers , setAnswers] = useState();
    const [error, setError] = useState();
    const [isLoading , setIsLoading] = useState(false);

    // Answer STATE used after adding other ANSWER
    const [ansGiven, setAnsGiven] = useState();

    
    // Using useEffect hoock because this should be rendered only once
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
                setStudentName(responseDataOfQuestion.userName);
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
    },[])


    // Showing POST ANSWER block
    const showPostSection = () => {
        const postDiv = document.querySelector(".post-ans-div");
        if(postDiv.style.display === "none"){
            postDiv.style.display = "block";
        }
        else{
            postDiv.style.display = "none";
        }
    }

    // Updating the new ANSWER
    const handleGivenAns = (event) => {
        const ans = event.target.value;
        setAnsGiven(ans);
    }

    // Posting the NEW ANSWER
    const nowPostAns = async (event) => {
        event.preventDefault();
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
            setError(err.message);
        }

        showPostSection();
    }

    const showDeleteSection = () => {
        setDeleteSection(true);
    }

    const cancleShowDeleteSection = () => {
        setDeleteSection(false);
    }

    const deleteTheQuestion = () => {
        console.log("Deleted !!");
        setDeleteSection(false);
    }

    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
    }

    return(
            <div className="question-container">

                {/* Showing error if occured */}
                {error && <Backdrop onClick={errorHandler} />}
                {error && <h1>{error}</h1>}

                {/* Showing Loading spinner */}
                {isLoading && <LoadingSpinner asOverlay />}

                {/* Rendering the component if all the data is received from backend */}
                {!isLoading && question && (
                    <React.Fragment>

                        {/* Showing Delet Section or Modal  */}
                        { deleteSection && (
                            <div className="show-delete-section">
                                <h1>Are You Sure?</h1>
                                <p>Do you want delete your?</p>
                                <button onClick={deleteTheQuestion}>DELETE</button>
                                <button onClick={cancleShowDeleteSection}>CANCLE</button>
                            </div>
                        )}

                        {/* Showing the student's details who had asked the question */}
                        {studentName && (
                            <React.Fragment>
                                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                                <h6 className="student-name">{studentName}</h6>
                            </React.Fragment>
                        )}

                        {/* Showing the update & delete button if the user is authenticated and have asked the question */}
                        { (auth.userId === question.userId) ? (
                            <React.Fragment>
                                <Link to={`/${quesId}/update`}>
                                    <button className="update-btn" >UPDATE</button>
                                </Link>

                                <button className="delete-btn" onClick={showDeleteSection}>DELETE</button>
                            </React.Fragment>
                            ): null
                        }


                        <h4 className="question-title">{question.title}</h4>
                        <p>Category -- {question.category}</p>
                        <p>{question.wholeQuestion}</p>

                        {answers && (
                            <div className="answers-div">
                                {
                                    answers.map((ans) => {
                                        return (
                                            <React.Fragment>
                                                <h6>{ans.userId}</h6>
                                                <button><StarBorderIcon style={{display:"inlineBlock"}}/></button>
                                                <p >Rating :- {ans.rating}</p>
                                                <p className="answers">{ans.answer}</p>
                                                <hr style={{width:"95%",margin:"0 auto"}}/>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </div>
                        )}       

                        { auth.isLogedIn && (
                                <button className="give-ans-btn" onClick={() => {
                                showPostSection()
                            }}>Give Answer</button>
                            )
                        }

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