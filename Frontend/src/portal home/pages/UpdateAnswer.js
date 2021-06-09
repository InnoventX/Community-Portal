import React,{useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';

import "./UpdateAnswer.css";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";
import Input from "../../shared/components/Input";
import {useForm} from "../../shared/hoocks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateAnswer = (props) => {

    // Using useHistory hook to go to the question page after updation
    const history = useHistory();

    // Taking answerId from the route
    const answerId = useParams().answerId;

    // State for Loading Spinner and Error model
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState();

    // Form State initially it is empty because we have not sended the get request to backend
    const [formState, handleInput, setFormData] =  useForm(
        {
            answer:{
                value:'',
                isValid:false,
            }
        },
        false
    );

    // Sending the fetch get request to get the data of the answer
    useEffect(() => {
        const sendRequest = async () => {
            try{
                // Turning on the loading spinner
                setIsLoading(true);

                // Sending get request for answer data
                const response = await fetch(`http://localhost:5000/api/answer/getAnswer/${answerId}`);
                const responseData = await response.json();
                if(responseData.message){
                    throw new Error(responseData.message);
                }

                // After getting the answer data we have to update our formState
                setFormData(
                    {
                        answer:{
                            value:responseData.answer.answer,
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
     
        // Sending the Patch request with old answer details to update the answer 
        try{
            const response = await fetch(`http://localhost:5000/api/answer/${answerId}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answer:formState.inputs.answer.value
                })
            });
            const responseData = await response.json();

            // Sending the error if it is comming from backend
            if(responseData.message){
                throw new Error(responseData.message);
            }

            // After updation we should redirect to question(QuesPage component) page
            history.push(`/ques/${responseData.answer.questionId}`);
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

            { !isLoading && (
                <form onSubmit={submitHandler}>
                    {/* Taking answer as input */}
                    <p className="U-ans-heading">Your Answer</p>
                    <div className="U-ans-text">
                        <Input 
                            id="answer"
                            element="textarea"
                            type="text"
                            className=" post-ans-text form-control U-ans-text"
                            rows="5"
                            value={formState.inputs.answer.value}
                            isValid={formState.inputs.answer.isValid}
                            isTouch={true}
                            errorMessage="Please write your answer."
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={handleInput}
                        />
                    </div>
                    
                    {/* This button should be disabled if the form in invalid */}
                    <button disabled={!formState.isValid} className="btn btn-outline-danger submit-btn"><i class="fas fa-check-circle"></i> Submit</button>
                </form>
            )}
            
        </React.Fragment>
    )
}

export default UpdateAnswer;