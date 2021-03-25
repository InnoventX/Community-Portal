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
// import submit from '../../photos/submit.svg';

const NewQuestion = () => {

    // For getting userId from AuthContext
    const auth = useContext(AuthContext);

    // For redirecting the user to "/" route after clicking submit button
    const history = useHistory();

    // For showing errors in frontend
    const [error,setError] = useState();
    const [isLoading , setIsLoading] = useState(false);

    const [userName , setUserName] = useState();

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
            }
        },
        false
    )

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/user/${auth.userId}`);
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

        // Sending the POST request to create new Question
        try{
            const response = await fetch("http://localhost:5000/api/question/",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    userId:auth.userId,
                    title:formState.inputs.title.value,
                    category:formState.inputs.category.value,
                    wholeQuestion:formState.inputs.wholeQuestion.value
                })
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
                <form onSubmit={submitHandler}>

                    {/* Input for title of question */}                
                    <div className="ask-question-container">                                
                        <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                        <h6 className="student-name">{userName} • asked</h6>
                        <Input 
                            id="title"
                            element="textarea"
                            placeholder="   Add description of your question here..."                        
                            errorMessage = "Please enter a valid title"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={handleInput}
                            className="que-title-text" 
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
                            className="cat"
                            errorMessage="Please enter a category"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={handleInput}
                        />
                    </div>

                    {/* Input for wholeQuestion of question */}
                    <div className="que-body-container">
                        <Input  
                            id="wholeQuestion"
                            element="textarea"
                            errorMessage="Question must be of 10 Characters"
                            validators={[VALIDATOR_MINLENGTH(10)]}
                            onInput={handleInput}
                            className="que-body-text" 
                            rows="7"
                            placeholder="   Add description of your question here..."
                        />
                    </div>

                    {/* This button will be disabled if the formState is invalid */}
                    <button className="submit-btn" disabled={!formState.isValid}>
                        Submit
                    </button>
                </form>
            )}
            
        </React.Fragment>
    )
}

export default NewQuestion;

{/* <img className="submit-img" src={submit}></img> */}
// {/* Input for title of question */}
//                 {/* <Input 
//                     id="title"
//                     element="textarea"
//                     label="Title"
//                     errorMessage = "Please enter a valid title"
//                     validators={[VALIDATOR_REQUIRE()]}
//                     onInput={handleInput}
//                 /> */}
//                 {/* Input for wholeQuestion of question */}
//                 {/* <Input  
//                     id="wholeQuestion"
//                     element="textarea"
//                     rows={5}
//                     label="Question"
//                     errorMessage="Question must be of 10 Characters"
//                     validators={[VALIDATOR_MINLENGTH(10)]}
//                     onInput={handleInput}
//                 /> */}