import React,{useReducer,useEffect} from 'react';

import {validate} from './validators';
import "./Input.css";

const inputReducer = (state,action) => {
    switch(action.type){
        case 'CHANGE':
            return{
                ...state,
                value:action.val,
                isValid:validate(action.val,action.validators)
            }
        case 'TOUCH':
            return{
                ...state,
                isTouch:true
            }
        default:
            return state
    }
}

const Input = (props) =>  {

    const [inputState , dispatch] = useReducer(inputReducer, {
        value:props.value || "",
        isValid:props.isValid || false,
        isTouch:props.isTouch || false
    })


    const handleChange = (event) => {
        dispatch({
            type:'CHANGE',
            val:event.target.value,
            validators:props.validators
        });
    }

    const handleTouch = () => {
        dispatch({
            type:"TOUCH"
        })
    }

    const {id, onInput} = props;
    const {value,isValid} = inputState;

    useEffect(() =>{
        onInput(id,value,isValid)
    },[id,value,isValid,onInput]);

    var element = ( props.element === "input") ? (
            <input 
                id={props.id}
                name={props.name}
                className={props.className}
                type={props.type}
                placeholder={props.placeholder}
                value={inputState.value}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleTouch}
            /> 
        ): (
            <textarea
                id={props.id}
                className={props.className || "text-area"}
                rows={props.rows || 1}
                placeholder={props.placeholder}
                value={inputState.value}
                onChange={handleChange}
                onBlur={handleTouch}
            />
        )

    return(
        <div>
            <label>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouch && <p className="error"><i class="fas fa-exclamation-triangle" style={{color:"red"}}></i>  {props.errorMessage}</p>}
        </div>
    )
}


export default Input;