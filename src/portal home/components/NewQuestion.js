import React,{useCallback, useReducer} from 'react';
import Input from '../../shared/components/Input';

import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";
import {useForm} from "../../shared/hoocks/form-hook";


const NewQuestion = () => {


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
    
    const submitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    return(
        <form onSubmit={submitHandler}>
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
            <Input 
                id="title"
                element="textarea"
                label="Title"
                errorMessage = "Please enter a valid title"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={handleInput}
            />
            <Input  
                id="wholeQuestion"
                element="textarea"
                rows={5}
                label="Question"
                errorMessage="Question must be of 10 Characters"
                validators={[VALIDATOR_MINLENGTH(10)]}
                onInput={handleInput}
            />
            <button disabled={!formState.isValid}>
                Submit
            </button>
        </form>
    )
}

export default NewQuestion;