import React,{useState, useContext, useEffect, useRef} from 'react';
import TinyMCE from 'react-tinymce';
import { Editor } from '@tinymce/tinymce-react';
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
import ImageUpload from "../../shared/components/ImageUpload";


const QuesPage = () => {

    const editorRef = useRef(null);

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

    // State for handle increment of rating for answers
    const [stopIncerement , setStopIncrement] = useState(false);

    // Showing all the answers only if when it is true when we click "SHOW MORE" button
    const [showAllAnswers,setShowAllAnswers] = useState(false);

    // State for sub-answer
    const  [subAnswer , setSubAnswer] = useState();

    // For togalling the sub-answer-div
    const [temp , setTemp] = useState(0);

    // This state will decided to show the image section or not 
    const [showImageUpload , setShowImageUpload] = useState(false);

    // State used when the user want's to upload IMAGE in the answer to this question
    const [sholudSubmitAnswer , setSholudSubmitAnswer] = useState(false); 
    const [answerImage , setAnswerImage] = useState({
        value:null,
        isValid:false
    });

    //////////////////////////////////////////////////////////// Functions /////////////////////////////////////////////////////////////////

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
        const ans = event.target.getContent();
        console.log(ans);
        setAnsGiven(ans);
    }

    // Showing delete section
    const showDeleteSection = (qOa) => {
        // event.target.name will contain the name which shoul be deleted( Question 0r Answer )
        const commingFrom = qOa;
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

    // Shows the Sub-Answer Section inside the answer
    const showSubAnswerDiv = (answerId) => { 
        // For hiding all other sub-answer divs
        const others = document.getElementsByClassName('sub-ans-div')
        for(var i=0;i<others.length;i++){
            others[i].style.display = "none";
        }

        const subAnsDiv = document.querySelector(`.sub-ans-div.ans-${answerId}`);
        console.log(subAnsDiv.style.display)
        // Bad logic for temp
        if(subAnsDiv.style.display === "none" && (temp%2 === 0)){
            subAnsDiv.style.display = "block";
            setTemp(temp+1);
        }else{
            subAnsDiv.style.display = "none";
            setTemp(temp+1);
        }   
    }

    // Updates the sub-answer state
    const handleSubAnswer = (event) => {
        const subAns = event.target.value;
        setSubAnswer(subAns);
    }

    // Shows the image upload preview section
    const showImageUploadHandler = (event) => {
        event.preventDefault();
        setShowImageUpload(true);
        const btn = document.querySelector('#add-image-btn');
        btn.style.display = 'none';
    }

    // Setting the Image values
    const imageInputHandler = (id,value,isValid) => {
        setAnswerImage({
            value:value,
            isValid:isValid
        });
    }

    // Triggers when the POST button is clicked for new Answer
    const submitNewAnswer = (event) => {
        event.preventDefault();
        setSholudSubmitAnswer(true);
        // Post the new Answer
        nowPostAns(event);
    }

    /////////////////////////////////////////////// Functions sending request to backend API's ////////////////////////////////////////////

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
                    setAnswers(null);
                    setIsLoading(false);
                }
                
            }catch(err){
                console.log(err);

                // Showing the error message comming from backend
                setError(err.message);
                setIsLoading(false);
            }
        }
        sendRequest();
    },[submitAnswer]);

    // Posting the NEW ANSWER
    const nowPostAns = async (event) => {
        // Prevent the default when the button is clicked
        event.preventDefault();

        // If the submit button is clicked
        if(sholudSubmitAnswer && editorRef.current){
            let ans=editorRef.current.getContent();
            ans=ans.split(">")[1];
            ans=ans.split("<")[0];

            // Posting the answer using backend api
            try{

                // Using formData to also send the image 
                const formData = new FormData();
                formData.append('userId',auth.userId);
                formData.append('answer',ans);
                formData.append('image',answerImage.value);

                const response = await fetch(`http://localhost:5000/api/answer/${quesId}/`,{
                    method:'POST',
                    headers:{
                        'Authorization':'Bearer ' + auth.token
                    },
                    body: formData
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
            setAnswerImage({
                value:null,
                isValid:false
            });
            setAnsGiven(null);
            setShowImageUpload(false);
        }
    }

    // Deleating the question
    const deleteQuestion = async () => {

        // Sending Request to delete the question 
        try{
            const response = await fetch(`http://localhost:5000/api/question/${quesId}/`,{
                method:'DELETE',
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
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
                method:'DELETE',
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
            });
            const responseData = await response.json();
            console.log(responseData.message);
            // Rerendering this page by changing the submitAnswer state so that useEffect will be triggered after deleting answer
            if(responseData.message === 'Deleted successfully'){
                setDeleteSection(null);
                setSubmitAnswer(prevValue => !prevValue);
                setAnswerImage({
                    value:null,
                    isValid:false
                });
                setShowImageUpload(false);
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
                method:'PATCH',
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }        
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
                method:'PATCH',
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
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

    // Posting sub answer
    const postSubAns = async (answerId) => {
        // console.log(subAnswer , answerId);
        const userId = auth.userId;
        try{
            const response = await fetch(`http://localhost:5000/api/subAnswer/${answerId}/newSubAnswer`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer ' + auth.token
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
            // Removing the content from state after sub-answer is posted
            setSubAnswer(null);
        }catch(err){
            console.log(err);
            setError(err.message);
        }
    }


    const log = () => {
        if (editorRef.current) {
            let ans=editorRef.current.getContent();
            ans=ans.split(">")[1];
            ans=ans.split("<")[0];
        }
    };

    ////////////////////////////////////////////// Return section ///////////////////////////////////////////////

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
                                <button className="btn delete-btn" style={{float:"right"}} name="question" onClick={() => {showDeleteSection('question')}}><i class="fas fa-trash-alt"></i></button>                                       
                                <Link to={`/${quesId}/update`}>
                                    <button className="btn update-btn" style={{float:"right"}}><i class="fas fa-edit"></i></button>
                                </Link>
                            </React.Fragment>
                            ): null
                        }
                            
                        <div className="user-icon">
                            { question.userImage ? (
                                <img className="users-icon" src={`http://localhost:5000/${question.userImage}`} alt="User"/>
                                ):(
                                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                            )}
                        </div>
                        <h6 className="student-name">{question.userName} • just now</h6>
                        <h6 className="category">{question.category}</h6>
                        <h4 className="question-title">{question.title}</h4>
                        {/* Rendering the image if the question contains an image */}
                        { question.image && <img className="image-container" src={`http://localhost:5000/${question.image}`} alt="Image"/>}
                        <p>{question.wholeQuestion}</p>

                        {/* Give answers options if the user is authenticated */}
                        { auth.isLogedIn ? (
                            <React.Fragment>                            
                                {/* Displaying give answer option to give answer */}
                                <button className="btn give-ans-btn" onClick={() => {showPostSection()}}>
                                    <i class="fas fa-comment-medical"></i> Give Answer
                                </button>        
                            </React.Fragment>
                            ):(
                            <React.Fragment>
                                <a href="/authenticate"><button className="btn give-ans-btn"><i class="fas fa-comment-medical"></i> Give Answer</button></a>
                            </React.Fragment>
                            )
                        }
                    </div>

                    {/* Showing the post answer block */}
                    <div className="post-ans-div">
                        <form onSubmit={nowPostAns}>

                            {/* If the user wants to upload image in answer */}
                            { showImageUpload && <ImageUpload id='image' onInput={imageInputHandler} center isValid={true}/> }
                            <button id="add-image-btn" style={{margin:"1% 6%"}} class="btn btn-warning"onClick={showImageUploadHandler}>Add Image?</button>
                        
                            {/* <textarea className="post-ans-text form-control" rows="3" value={ansGiven} onChange={handleGivenAns} placeholder="   Type your answer here..."/> */}
                            <Editor
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue=""
                                init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />

                            <button className="btn post-btn" onClick={submitNewAnswer}><i class="fas fa-paper-plane"></i> Post</button>
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
                                                            <button className="btn delete-btn" style={{float:"right"}} name={ans.id} onClick={() => {showDeleteSection(ans.id)}}>
                                                                <i class="fas fa-trash-alt"></i>
                                                            </button>
                                                            <Link to={`/update/${ans.id}`}>
                                                                <button className="btn update-btn" style={{float:"right"}}>
                                                                    <i class="fas fa-edit"></i>
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
                                            
                                                    {/* Answer's content */}
                                                    <div className="user-icon">
                                                        {ans.userImage ? (
                                                                <div clssName="item__image">
                                                                    <img className="users-icon" src={`http://localhost:5000/${ans.userImage}`} alt="User"/>
                                                                </div>
                                                            ):(
                                                                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                                                        )}
                                                    </div>
                                                    <h6 className="student-name">{ans.userName} • just now</h6>
                                                    <h6 className="category">{ans.rating}<img className="ratings-img" src={ratings}></img></h6>
                                                    { ans.image && (
                                                        <div clssName="item__image">
                                                            <img className="image-container" src={`http://localhost:5000/${ans.image}`} alt="Image"/>
                                                        </div>
                                                    )}                                                                 
                                                    <p className="answers">{ans.answer}</p>
                                                    

                                                    {( auth.isLogedIn && ans.subAnswers.length !== 0) ? (
                                                        ans.subAnswers.map((subAns) => {
                                                            return(
                                                                <React.Fragment>
                                                                    
                                                                    <div className="sub-ANS"> 
                                                                        <div className="user-icon">
                                                                            {subAns.userImage ? (
                                                                                    <div clssName="item__image">
                                                                                        <img className="users-icon" src={`http://localhost:5000/${subAns.userImage}`} alt="User"/>
                                                                                    </div>
                                                                                ):(
                                                                                    <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                                                                            )}
                                                                        </div>
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
                                                        <button className="btn save-btn" onClick={() => {saveAnswer(ans.id)}}>
                                                            <i class="fas fa-bookmark"></i>
                                                        </button>
                                                    ))}

                                                    { auth.isLogedIn && (
                                                        <button className="btn post-subAns-btn" style={{float:"left"}} onClick={() => {showSubAnswerDiv(ans.id)}}>
                                                            REPLY
                                                        </button>
                                                    )}

                                                    {/* Showing the post sub-answer block */}
                                                    <div className={`sub-ans-div ans-${ans.id}`}>
                                                        <form onSubmit={(event) => {
                                                            event.preventDefault();
                                                            postSubAns(ans.id);
                                                        }}>
                                                            <textarea className="post-ans-text form-control" id="txtarea" rows="3" value={subAnswer} onChange={handleSubAnswer} placeholder="Write your query here .."/>                                                    
                                                            <button className="btn post-btn">
                                                                <i class="fas fa-paper-plane"></i> Post
                                                            </button>
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
                                                            <button className="btn delete-btn" style={{float:"right"}} name={ans.id} onClick={() => {showDeleteSection(ans.id)}}><i class="fas fa-trash-alt"></i></button>
                                                            <Link to={`/update/${ans.id}`}>
                                                                <button className="btn update-btn" style={{float:"right"}}><i class="fas fa-edit"></i></button>
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
                                            
                                                    <div className="user-icon">
                                                        {ans.userImage ? (
                                                                <div className="item__image">
                                                                    <img className="users-icon" src={`http://localhost:5000/${ans.userImage}`} alt="User"/>
                                                                </div>
                                                            ):(
                                                                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                                                        )}
                                                    </div>
                                                    <h6 className="student-name">{ans.userName} • just now</h6>
                                                    <h6 className="category">{ans.rating}<img className="ratings-img" src={ratings}></img></h6>                                                                                    
                                                    { ans.image && (
                                                        <div clssName="item__image">
                                                            <img className="image-container" src={`http://localhost:5000/${ans.image}`} alt="Image"/>
                                                        </div>
                                                    )}
                                                    <p className="answers">{ans.answer}</p>
                                                    

                                                    {( auth.isLogedIn && ans.subAnswers.length !== 0) ? (
                                                        ans.subAnswers.map((subAns) => {
                                                            return(
                                                                <React.Fragment>
                                                                    <div className="sub-ANS">
                                                                        <div className="user-icon">
                                                                            {subAns.userImage ? (
                                                                                    <div className="item__image">
                                                                                        <img className="users-icon" src={`http://localhost:5000/${subAns.userImage}`} alt="User"/>
                                                                                    </div>
                                                                                ):(
                                                                                    <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                                                                            )}
                                                                        </div>
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
                                                        <button className="btn save-btn" onClick={() => {saveAnswer(ans.id)}}><i class="fas fa-bookmark"></i></button>
                                                    ))}

                                                    { auth.isLogedIn && (
                                                        <button className="btn post-subAns-btn" style={{float:"left"}} onClick={() => {showSubAnswerDiv(ans.id)}}>
                                                            REPLY
                                                        </button>
                                                    )}

                                                    {/* Showing the post answer block */}
                                                    <div className={`sub-ans-div ans-${ans.id}`}>
                                                        <form onSubmit={(event) => {
                                                            event.preventDefault();
                                                            postSubAns(ans.id);
                                                        }}>
                                                            <textarea className="post-ans-text flow-control" rows="3" value={subAnswer} onChange={handleSubAnswer} placeholder="     Write your query here .."/>
                                                            <button className="btn post-btn"><i class="fas fa-paper-plane"></i> Post</button>
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
                                <button className="btn show-more-btn" onClick={handleShowAllAnswers}>
                                    <i class="fas fa-caret-square-down"></i> Show More
                                </button>
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



