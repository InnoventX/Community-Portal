import React,{useState , useEffect} from 'react';

import myQues from "../components/questions";
import "./PortalHome.css";
import Categories from "../components/Categories";
import QuesList from "../components/QuesList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";

function PortalHome(){

    // State for  loading spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for Error handling
    const [error , setError] = useState();

    // State which renders all the questions
    const [allQuestions , setAllQuestions] = useState();

    // Using useEffect hoock because this should be updated & re-rendered whenever the question is add 
    useEffect(() => {

        // Making another function because we cannot write async in useEffect function
        const sendRequest = async () => {

            // Loading the spinner till the data arrived
            setIsLoading(true);

            // Getting all the questions from the api
            try{
                const response = await fetch("http://localhost:5000/api/question");

                const responseData = await response.json();

                if(responseData.message){
                    throw new Error(responseData.message);
                }

                // Storing the response comming from backend into allQuestions State
                setAllQuestions(responseData.questions);
            }catch(err){
                console.log(err);

                // Setting the error message in frontend
                setError(err.message || 'Something went wrong, please try again');
            }
            
            // Truning off the Loading spinner
            setIsLoading(false);
        }

        // Calling our function
        sendRequest();
    },[]);

    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
    }
    

    return(
        <React.Fragment>

            {/* Showing error if occured */}
            {error && <Backdrop onClick={errorHandler} />}
            {error && <h1>{error}</h1>}

            {/* Showing Loading spinner */}
            {isLoading && <LoadingSpinner asOverlay />}

            {/* Showing Home page */}
            <div className="home">
                <div className="left">
                    <Categories />
                </div>
                <div className="right">
                    {/* Questions will be only rendered if the data is arrived from the backend */}
                    { !isLoading && allQuestions && <QuesList allQuestions={allQuestions} />}
                </div>
            </div>
        </React.Fragment>
    )
}

export default PortalHome;