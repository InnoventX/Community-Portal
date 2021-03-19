import React,{useContext,useState} from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/components/Input';
import {AuthContext} from "../../shared/context/AuthContext";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";
import {useForm} from "../../shared/hoocks/form-hook";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const NewQuestion = () => {

    // For getting userId from AuthContext
    const auth = useContext(AuthContext);

    // For redirecting the user to "/" route after clicking submit button
    const history = useHistory();

    // For showing errors in frontend
    const [error,setError] = useState();

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

            <form onSubmit={submitHandler}>
                {/* Input for category of question*/}
                <Input 
                    id="category"
                    element="input"
                    type="text"
                    label="Category"
                    placeholder="Arduino"
                    errorMessage="Please enter a category"
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={handleInput}
                />
                {/* Input for title of question */}
                <Input 
                    id="title"
                    element="textarea"
                    label="Title"
                    errorMessage = "Please enter a valid title"
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={handleInput}
                />
                {/* Input for wholeQuestion of question */}
                <Input  
                    id="wholeQuestion"
                    element="textarea"
                    rows={5}
                    label="Question"
                    errorMessage="Question must be of 10 Characters"
                    validators={[VALIDATOR_MINLENGTH(10)]}
                    onInput={handleInput}
                />

                {/* This button will be disabled if the formState is invalid */}
                <button disabled={!formState.isValid}>
                    Submit
                </button>
            </form>
        </React.Fragment>
    )
}

export default NewQuestion;