import React,{useState} from 'react';
import logo from '../../photos/logo.png';
import './SignIn.css';

function SignIn(){

    const [signIn,setSignIn] = useState({
        email:"",
        password:""
    });

    function handleSignIn(event){
        const ipName = event.target.name;
        const ipValue = event.target.value;
    
        setSignIn((prevsValue) => {
            if(ipName === "Email"){
                return{
                    email:ipValue,
                    password:prevsValue.password
                }
            }else if(ipName === "Password"){
                return{
                    email:prevsValue.email,
                    password:ipValue
                }
            }
        })
    
    }
    
    function handleSubmit(event){
        event.preventDefault();
        alert("Email address is: "+signIn.email+" And password is: "+signIn.password);
        console.log("Email address is: "+signIn.email+" And password is: "+signIn.password); 
    }
    
    return(
        <div className="my-form">
            <img className="logo2" src={logo}/>
            <form onSubmit={handleSubmit}>
                <input className="sign-in" name="Email" type="email" placeholder="Email" autoComplete="off" value={signIn.email} onChange={handleSignIn}/>
                <input className="sign-in" name="Password" type="password" placeholder="Password" autoComplete="off" value={signIn.password} onChange={handleSignIn}/>
                <button className="signup-button" type="submit">Sign In</button>
                <a className="forgot-password"href="#">Forgot password?</a>
                <label className="moveto-signup">Don't have an account?</label>
                <a href="#">Sign up</a>
            </form>
        </div>
    )

}

export default SignIn; 