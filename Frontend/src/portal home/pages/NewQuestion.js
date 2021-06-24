import React,{useContext,useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import "./NewQuestion.css";
import Input from '../../shared/components/Input';
import {AuthContext} from "../../shared/context/AuthContext";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";
import {useForm} from "../../shared/hoocks/form-hook";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/ImageUpload";

const NewQuestion = () => {

    // For getting userId from AuthContext
    const auth = useContext(AuthContext);

    // For redirecting the user to "/" route after clicking submit button
    const history = useHistory();

    // For showing errors in frontend
    const [error,setError] = useState();
    const [isLoading , setIsLoading] = useState(false);

    // For displaying the user's name
    const [userName , setUserName] = useState();

    // This state will decided to show the image section or not 
    const [showImageUpload , setShowImageUpload] = useState(false);

    // The form should only be submitted when the SUBMIT button is clicked
    const [onSubmit , setOnSubmit] = useState(false);

    // Form input State
    const [formState, handleInput] = useForm(
        {
            category:{
                value:'',
                isValid:false
            },
            title:{
                value:'',
                isValid:false
            },
            wholeQuestion:{
                value:'',
                isValid:false
            },
            image:{ 
                value:null,
                isValid:true
            }
        },
        false
    )

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/user/${auth.userId}`,{
                    headers:{
                        'Authorization':'Bearer ' + auth.token
                    }
                });
                const responseData = await response.json();

                if(responseData.message){
                    throw new Error(responseData.message);
                }

                setUserName(responseData.user.name);
            }catch(err){
                console.log(err);
                setError(err);
            }
            setIsLoading(false);
        }
        sendRequest();
    },[])
    
    // This will be triggered when user will click submit button 
    const submitHandler = async (event) => {
        event.preventDefault();

        if(onSubmit){
            // Sending the POST request to create new Question
            try{

                const formData = new FormData();
                formData.append('userId',auth.userId);
                formData.append('title',formState.inputs.title.value);
                formData.append('category',formState.inputs.category.value);
                formData.append('wholeQuestion',formState.inputs.wholeQuestion.value);
                formData.append('image',formState.inputs.image.value);

                const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/question/",{
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

                // After creating the new question, redirect the user to home page("/")
                history.push("/");
            }catch(err){
                console.log(err);
                // Setting the error
                setError(err.message);
            }
        }
    }

    const showImageUploadHandler = (event) => {
        event.preventDefault();
        setShowImageUpload(true);
        const btn = document.querySelector('#add-image-btn');
        btn.style.display = 'none';
    }

    // Will bw triggered when the submit button is clicked
    const submitButtonHandler = (event) => {
        event.preventDefault();
        setOnSubmit(true);
        submitHandler(event);
    }

    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
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

            { isLoading && <LoadingSpinner asOverlay />}

            { !isLoading && userName && (
                <form>

                    {/* Input for title of question */}                
                    <div className="ask-question-container">                                
                        <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                        <h6 className="student-name">{userName} <i style={{color:"gray"}}>asked</i></h6>
                        <Input 
                            id="title"
                            element="textarea"
                            placeholder="Add description of your question here"                        
                            errorMessage = "Please enter a valid title"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={handleInput}
                            className="form-control que-title-text" 
                            rows="2"        
                        />
                    </div>

                    {/* Input for category of question*/}
                    <div className="ask-question-container">                                
                        <h6>Add Category</h6>    
                        <Input 
                            id="category"
                            element="input"
                            type="text"
                            label="Category"
                            placeholder="Arduino"
                            className="form-control cat"
                            errorMessage="Please enter a category"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={handleInput}
                        />
                    </div>

                    {/* If the user wants to upload image in question */}
                    { showImageUpload && <ImageUpload id='image' onInput={handleInput} center isValid={true}/> }
                    <button id="add-image-btn" class="add-image-btn btn btn-warning" onClick={showImageUploadHandler}>Add Image?</button>

                    {/* Input for wholeQuestion of question */}
                    <div className="que-body-container">
                        <Input  
                            id="wholeQuestion"
                            element="textarea"
                            errorMessage="Question must be of 10 Characters"
                            validators={[VALIDATOR_MINLENGTH(10)]}
                            onInput={handleInput}
                            className="form-control que-body-text" 
                            rows="7"
                            placeholder="Add description of your question here..."
                        />
                        
                    </div>

                    {/* This button will be disabled if the formState is invalid */}
                    <div className="submit-btn-div">
                        <button className="btn ask-submit-btn" disabled={!formState.isValid} onClick={submitButtonHandler}> 
                            <i class="fas fa-check-circle"></i> Submit
                        </button>
                    </div>
                </form>
            )}
            
        </React.Fragment>
    )
}

export default NewQuestion;