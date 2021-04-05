import React,{useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import "./UpdateQues.css";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";
import Input from "../../shared/components/Input";
import {useForm} from "../../shared/hoocks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateQues = (props) => {

    // Using useHistory hook to go to the question page after updation
    const history = useHistory();

    // Taking quesId from the route
    const quesId = useParams().quesId;

    // State for Loading Spinner and Error model
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState();

    const [userName , setUserName] = useState();

    // Form State initially it is empty because we have not sended the get request to backend
    const [formState, handleInput, setFormData] =  useForm(
        {
            category:{
                value:'',
                isValid:false,
            },
            title:{
                value:'',
                isValid:false
            },
            wholeQuestion:{
                value:'',
                isValid:false,
            }
        },
        false
    );

    // Sending the fetcg get request to get the data of the question
    useEffect(() => {
        const sendRequest = async () => {
            try{
                // Turning on the loading spinner
                setIsLoading(true);

                // Sending get request for question
                const response = await fetch(`http://localhost:5000/api/question/${quesId}`);
                const responseData = await response.json();
                if(responseData.message){
                    throw new Error(responseData.message);
                }

                setUserName(responseData.question.userName);

                // After getting the question data we have to update our formState
                setFormData(
                    {
                        category:{
                            value:responseData.question.category,
                            isValid:true,
                        },
                        title:{
                            value:responseData.question.title,
                            isValid:true
                        },
                        wholeQuestion:{
                            value:responseData.question.wholeQuestion,
                            isValid:true,
                        }
                    },
                    true
                )
            }catch(err){
                console.log(err);
                // Setting the error comming from backend
                setError(err.message);
            }

            // Turning off the loading spinner
            setIsLoading(false);
        }
        // Calling our function
        sendRequest();
    },[]);

    // Function to handle submit
    const submitHandler = async (event) => {

        // Preventing the default after clicking the button
        event.preventDefault();

        // Sending the Patch request with old question details to update the question 
        try{
            const response = await fetch(`http://localhost:5000/api/question/${quesId}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title:formState.inputs.title.value,
                    category:formState.inputs.category.value,
                    wholeQuestion:formState.inputs.wholeQuestion.value
                })
            });
            const responseData = await response.json();

            // Sending the error if it is comming from backend
            if(responseData.message){
                throw new Error(responseData.message);
            }

            // After updation we should redirect to question(QuesPage component) page
            history.push(`/ques/${quesId}`);
        }catch(err){
            console.log(err);
            // Setting the errors to show in frontend
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

            {/* Showing Loading spinner */}
            {isLoading && <LoadingSpinner asOverlay />}

            { !isLoading && userName && (
                <form onSubmit={submitHandler}>

                    {/* Input for title of question */}                
                    <div className="ask-question-container">                                
                        <div className="user-icon"><AccountCircleIcon className="user-icon" style={{fontSize:"3.3rem"}}/></div>
                        <h6 className="student-name">{userName} • asked</h6>
                        <Input 
                            id="title"
                            element="textarea"
                            value={formState.inputs.title.value}
                            isValid={formState.inputs.title.isValid}
                            isTouch={true}
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
                            value={formState.inputs.category.value}
                            isValid={formState.inputs.category.isValid}
                            isTouch={true}
                            errorMessage="Please enter a category"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={handleInput}
                            className="cat"
                        />
                    </div>

                    {/* Input for wholeQuestion of question */}
                    <div className="que-body-container">
                        <Input  
                            id="wholeQuestion"
                            element="textarea"
                            value={formState.inputs.wholeQuestion.value}
                            isValid={formState.inputs.wholeQuestion.isValid}
                            isTouch={true}
                            errorMessage="Question must be of 10 Characters"
                            validators={[VALIDATOR_MINLENGTH(10)]}
                            onInput={handleInput}
                            className="que-body-text" 
                            rows="7"
                        />
                    </div>

                    {/* This button should be disabled if the form in invalid */}
                    <button className="submit-btn" disabled={!formState.isValid}>
                        Submit
                    </button>
                </form>
            )}
            
        </React.Fragment>
    )
}

export default UpdateQues;