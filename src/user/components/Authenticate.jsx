import React,{useState,useContext,useReducer,useCallback} from 'react';
// import {useHistory} from 'react-router-dom';

import logo from '../../photos/logo.svg';
import './SignIn.css';
import {AuthContext} from "../../shared/context/AuthContext";
import Input from "../../shared/components/Input";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/validators";
// import {useForm} from "../../shared/hoocks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

// This function will be called whenever we use "dispatch"
const formReducer = ( state, action) => {

    // Checks the action type
    switch( action.type ){

        case 'INPUT_CHANGE':
            // Initially the form is valid
            let formIsValid = true;

            // Traversing through all inputs
            for(const inputId in state.inputs){
                if(!state.inputs[inputId]){
                    continue;
                }

                // Taking the Input which is chaning right now
                if(inputId === action.inputId){
                    // The form will only be valid if the changed "Input" is valid
                    formIsValid = formIsValid && action.isValid;
                }
                else{
                    // Setting the default values for the rest input components
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }

            return{
                // Returning the State after the input state is changed
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.inputId]:{
                        value:action.value,
                        isValid:action.isValid
                    }
                },
                isValid:formIsValid
            }

        // For setting the data which we pass
        case 'SET_DATA':
            return{
                inputs:action.inputs,
                isValid:action.formIsValid
            }

        default:
            return state;
    }
}

function Authenticate(){

    // Using AuthContext for user login detalis(userId)  
    const auth = useContext(AuthContext);

    // State for submit button
    const [onSubmit , setOnSubmit] = useState(false);

    // State which display Login form when set to true
    const [isLogin , setIsLogin] = useState(true);

    // Initial state of form(login)  
    const [formState, dispatch] = useReducer(formReducer,{
       inputs:{
        email:{
            value:"",
            isValid:false
        },
        password:{
            value:"",
            isValid:false
        },
    },
        isValid:false
    });

    // State For Loading Spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for error modal or block
    const [error, setError] = useState();

    // Trigers whenever input changes
    const handleInput = useCallback((id , value, isValid) => {
        dispatch({
            type:'INPUT_CHANGE',
            value:value,
            isValid:isValid,
            inputId:id
        });

    },[]);

    // To set the data after the switching from signup->login or visa-versa 
    const setData = (inputs,formIsValid) => {
        dispatch({
            type:'SET_DATA',
            inputs:inputs,
            formIsValid:formIsValid
        })
    }

    // Triger when we click the "SWITCH" button
    const handleSwitch = (event) => {

        // This prevents the form to get submitted
        setOnSubmit(false);

        if(!isLogin){
            // Signup -> Login
            setData({
                ...formState.inputs,
                name:undefined 
            },
            formState.inputs.email.isValid && formState.inputs)
        }else{
            // Login -> Signup
            setData(
                {
                  ...formState.inputs,
                  name: {
                    value: '',
                    isValid: false
                  }
                },
                false
            );
        }
        setIsLogin(prevMode => !prevMode);
    }

    // Triggers when the form is submitted
    const handleSubmit = async (event) => {
        event.preventDefault();

        // If the submit button is clicked 
        if(onSubmit){

            // If the user is Loggin in
            if(isLogin){
                try{
                    // Showing the Loaading spinney till the data is arrived
                    setIsLoading(true);

                    // Getting the data from api
                    const response = await fetch("http://localhost:5000/api/user/login",{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email:formState.inputs.email.value,
                            password:formState.inputs.password.value
                        })
                    });

                    // Converting the data into json format
                    const responseData = await response.json();

                    // It the error is comming as a response
                    if(responseData.message){
                        throw Error(responseData.message);
                    }

                    // Getting userId in Frontend
                    auth.login(responseData.user.id);
                }catch(err){
                    console.log(err);

                    // Showing the Error modal in frontend
                    setError(err.message || 'Something wentt wrong, please try again');
                }

                // After the data is arrived the remove the loading spinner
                setIsLoading(false);
            }else{
                try{
                    setIsLoading(true);
                    const response = await fetch("http://localhost:5000/api/user/signup",{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name:formState.inputs.name.value,
                            email:formState.inputs.email.value,
                            password:formState.inputs.password.value
                        })
                    });
        
                    const responseData = await response.json();
        
                    if(responseData.message){
                        throw Error(responseData.message);
                    }

                    auth.login(responseData.user.id);
                }catch(err){
                    console.log(err);
                    setError(err.message || 'Something went wrong, please try again.');
                }
                setIsLoading(false);
            }
        }
    }

    // Triggered when the submit button is clicked
    const haldleSubmitButton = (event) => {
        event.preventDefault();
        // The form shoul only be submitted now
        setOnSubmit(true);
        handleSubmit(event);
    }

    // To handle error
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

            {/* Showing Loading Spinner till the data is arrived */}
            { isLoading && <LoadingSpinner asOverlay />}
                <div id="wrapper">
                    <div className="signIn-text-DIV">
                        <h1 className="signIN-text">INSPIRING.</h1>
                        <h1 className="signIN-text">INNOVATING.</h1>
                        <h1 className="signIN-text">INNVENTING.</h1>
                    </div>
                    <div className="my-form">
                        <img className="logo2" src={logo}/>

                        {/* Authentication Form */}
                        <form onSubmit={handleSubmit}>

                            {/* Display "Name" only if it is in Signup form(!isLogin) */}
                            { !isLogin && (
                                <div>
                                    <span className="icon"><i class="fas fa-user"></i></span>  
                                    <Input 
                                        id="name"
                                        element="input"
                                        placeholder="User Name"
                                        type="text"
                                        className="form-control sign-in-Box"
                                        value={formState.inputs.name.value}
                                        onInput = {handleInput}
                                        validators = {[VALIDATOR_REQUIRE()]}
                                        errorMessage="Please enter a valid user name"
                                    />
                                </div>
                                )
                            }

                            {/* Email & password input components */}
                            <div className="email-div"> 
                                <span className="icon"><i class="far fa-envelope"></i></span>  
                                <div className="input">
                                <Input 
                                    id="email"
                                    element="input"
                                    type="email"
                                    placeholder="Email"
                                    className="email form-control"
                                    value={formState.inputs.email.value}
                                    onInput={handleInput}
                                    validators={[VALIDATOR_EMAIL()]}
                                    errorMessage="Please enter a valid email"
                                    >
                                </Input>
                                </div>
                                
                            </div>
                            
                            <div>
                                <span className="icon password-icon"><i class="fas fa-key"></i></span>  
                                <Input
                                    id="password"
                                    element="input"
                                    type="password"
                                    placeholder="Password"
                                    className="password form-control"
                                    value={formState.inputs.password.value}
                                    onInput={handleInput}
                                    validators={[VALIDATOR_MINLENGTH(6)]}
                                    errorMessage="Pleaase enter a password of length 6"
                                >
                                </Input>
                            </div>

                            {/* This button will be disabled if the form is not valid */}
                            <div className="buttons">
                                {/* This button will be disabled if the form is not valid */}
                                <button className="btn btn-success LOGIN" disabled={!formState.isValid} onClick={haldleSubmitButton}>{ isLogin ? "Login" : "Signup" }</button>

                                {/* Switching button */}
                                <a className="SIGNUP" onClick={handleSwitch}>{ isLogin ? "Sign up" : "Login" }?</a>
                            </div>
                        </form>
                    </div>
            </div>
        </React.Fragment>
        
    )
}

export default Authenticate; 