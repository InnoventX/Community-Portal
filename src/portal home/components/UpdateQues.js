import React,{useState,useReducer,useCallback} from 'react';
import {useParams} from 'react-router-dom';

import myQuestions from "./questions";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";
import Input from "../../shared/components/Input";
import {useForm} from "../../shared/hoocks/form-hook";

/*
const formReducer = (state,action) => {
    switch(action.type){
        case 'INPUT-CHANGE':
            let formIsValid = true;
            for(const inputId in state.inputs){
                if(inputId === action.inputIdId){
                    formIsValid = formIsValid && action.isValid
                }else{
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                }
            }

            return{
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.inputId] : {
                        value:action.value,
                        isValid:action.isValid
                    }
                },
                isValid:formIsValid
            }
        
            default:
                return state
    }
}
*/


const UpdateQues = (props) => {
    const quesId = useParams().quesId;

    const myQuestion = myQuestions.find((ques) => {
        return ques.id ===quesId;
    });

    /*
    const [formState, dispatch] = useReducer(formReducer,{
        inputs:{
            category:{
                value:myQuestion.category,
                isValid:true,
            },
            title:{
                value:myQuestion.title,
                isValid:true
            },
            wholeQuestion:{
                value:myQuestion.wholeQuestion,
                isValid:true,
            }
        },
        isValid:true
    });

    const handleInput = useCallback((id,value,isValid) => {
        dispatch({
            type:'INPUT-CHANGE',
            value:value,
            isValid:isValid,
            inputId:id
        });
    },[])
    */

   const [formState, handleInput, setFormData] =  useForm(
    {
        category:{
            value:myQuestion.category,
            isValid:true,
        },
        title:{
            value:myQuestion.title,
            isValid:true
        },
        wholeQuestion:{
            value:myQuestion.wholeQuestion,
            isValid:true,
        }
    },
    true
   )

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    return(
        <React.Fragment>
            <form onSubmit={submitHandler}>
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
            />
            <Input 
                id="title"
                element="textarea"
                label="Title"
                value={formState.inputs.title.value}
                isValid={formState.inputs.title.isValid}
                isTouch={true}
                errorMessage = "Please enter a valid title"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={handleInput}
            />
            <Input  
                id="wholeQuestion"
                element="textarea"
                rows={5}
                label="Question"
                value={formState.inputs.wholeQuestion.value}
                isValid={formState.inputs.wholeQuestion.isValid}
                isTouch={true}
                errorMessage="Question must be of 10 Characters"
                validators={[VALIDATOR_MINLENGTH(10)]}
                onInput={handleInput}
            />
            <button disabled={!formState.isValid}>
                Submit
            </button>
        </form>
        </React.Fragment>
    )
}

export default UpdateQues;