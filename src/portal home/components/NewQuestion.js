import React,{useReducer} from 'react';
import Input from '../../shared/components/Input';

import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/components/validators";

const formReducer = (state,action) => {
    switch(action.type){
        case 'INPUT-CHANGE':
            let formIsValid=true;
            for(const inputId in state.inputs){
                if(inputId === action.inputId){
                    formIsValid = formIsValid && action.isValid;
                }
                else{
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }

            return{
                ...state,
                inputs:{
                    ...state.inptus,
                    [action.inputId]:{
                        value:action.value,
                        isValid:action.isValid
                    }
                },
                isValid:formIsValid
            }

        default :
            return state
    }
}

const NewQuestion = () => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputs:{
            category:{
                value:'',
                isValid:false
            },
            title:{
                value:'',
                isValid:false
            },
            question:{
                value:'',
                isValid:false
            }
        },
        isValid:false
    });

    const handleInput = (id,value,isValid) => {
        dispatch({
            type:'INPUT-CHANGE',
            inputId:id,
            value:value,
            isValid:isValid
        });
    }

    return(
        <form>
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
                id="question"
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