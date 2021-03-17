// This component is responsible for rendering the question block on Portal's home page

import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./Question.css";


const Question = (props) => {

    const [studentName , setStudentName] = useState();
    const [isLoading , setIsLoading] = useState(false);

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/user/${props.userId}`);

                const responseData = await response.json();

                if(responseData.message){
                    throw new Error(responseData.message);
                }

                console.log(responseData.user.name);
                setStudentName(responseData.user.name);

            }catch(err){
                console.log(err);
            }
            setIsLoading(false);
        }

        sendRequest();
    },[]);

    return(
        <React.Fragment>
            {/* {isLoading && <LoadingSpinner asOverlay/>} */}
            {!isLoading && studentName && (
                <Link to={`/ques/${props.id}`} style={{textDecoration:"none"}}>
                <div className="question-container">
                {studentName && (
                    <React.Fragment>
                    <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                    <h6 className="student-name">{studentName}</h6>
                    </React.Fragment>
                )
                }
                    <h4 className="question-title">{props.title}</h4>
                    <p>{props.wholeQuestion.substring(0,100) + '...'}</p>
                </div>
                </Link>
            )}
            
        </React.Fragment>

    );
}

export default Question;