import React,{useState, useContext, useEffect} from 'react';
import {useParams,Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import "./QuesPage.css";
import {AuthContext} from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";


const QuesPage = () => {

    const auth = useContext(AuthContext);

    const [deleteSection , setDeleteSection] = useState(false);

    // Getting QuestionID from the route
    const quesId = useParams().quesID;

    const [studentName , setStudentName] = useState();
    const [question,setQuestion] = useState();
    const [answers , setAnswers] = useState();
    const [error, setError] = useState();
    const [isLoading , setIsLoading] = useState(false);
    
    /////////////////////////////////////////////////////////////

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
                const getQuestion = await fetch(`http://localhost:5000/api/question/${quesId}`);
                const responseDataOfQuestion = await getQuestion.json();

                if(responseDataOfQuestion.message){
                    throw new Error(responseDataOfQuestion.message);
                }
                setStudentName(responseDataOfQuestion.userName);
                setQuestion(responseDataOfQuestion.question);

                const getAnswers = await fetch(`http://localhost:5000/api/answer/${quesId}`);
                const responseDataOfAnswers = await getAnswers.json();

                if(responseDataOfAnswers.message && responseDataOfAnswers.message!=="No answers found of that question"){
                    throw new Error(responseDataOfAnswers.message);
                }
                setAnswers(responseDataOfAnswers.answers);
                
            }catch(err){
                console.log(err);
                setError(err.message);
            }
            setIsLoading(false);
        }
        sendRequest();
    },[])

    /////////////////////////////////////////////////////////////


    // Answer STATE used after adding other ANSWER
    const [ansGiven, setAnsGiven] = useState({
        givenBy:'',
        rating:'',
        ans:''
    });

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
        const ans = {
            givenBy:'u10',
            rating:'0',
            ans:event.target.value
        }
        setAnsGiven(ans);
    }

    // Posting the NEW ANSWER
    const nowPostAns = (event) => {
        event.preventDefault();
        setQuestion((question) => {
            return{
                id:question.id,
                studentName:question.studentName,
                title:question.title,
                wholeQuestion:question.wholeQuestion,
                answers:[...question.answers , ansGiven]
            }
        });
        showPostSection({
            givenBy:'',
            rating:'',
            ans:''
        });
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

                {!isLoading && question && (
                    <React.Fragment>
                        { deleteSection && (
                            <div className="show-delete-section">
                                <h1>Are You Sure?</h1>
                                <p>Do you want delete your?</p>
                                <button onClick={deleteTheQuestion}>DELETE</button>
                                <button onClick={cancleShowDeleteSection}>CANCLE</button>
                            </div>
                        )}

                        {studentName && (
                            <React.Fragment>
                                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                                <h6 className="student-name">{studentName}</h6>
                            </React.Fragment>
                        )}

                        { auth.isLogedIn && (
                            <React.Fragment>
                                <Link to={`/${quesId}/update`}>
                                    <button className="update-btn" >UPDATE</button>
                                </Link>

                                <button className="delete-btn" onClick={showDeleteSection}>DELETE</button>
                            </React.Fragment>
                            )
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
                                <textarea className="post-ans-text" rows="3" value={ansGiven.ans} onChange={handleGivenAns}/>
                                <button type="submit" className="post-btn">Post</button>
                            </form>
                        </div>
                    </React.Fragment>    
                )}
                
            </div>   
    );
}

export default QuesPage;