import React,{useState , useEffect} from 'react';

import "./PortalHome.css";
import Categories from "../components/Categories";
import QuesList from "../components/QuesList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

function PortalHome(){

    // State for  loading spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for Error handling
    const [error , setError] = useState();

    // State which renders all the questions
    const [allQuestions , setAllQuestions] = useState();

    // Using useEffect hoock because this should be rendered only once 
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

                    // Initially if there is no questions available then
                    if(responseData.message === "No questions found"){
                        setAllQuestions(null);
                    }
                    else{
                        throw new Error(responseData.message);
                    }
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
            {error && (
                <React.Fragment>
                    <Backdrop onClick={errorHandler} />
                    <ErrorModal heading="Error Occured!" error={error} />
                </React.Fragment>
            )}
                
            {/* Showing Loading spinner */}
            {isLoading && <LoadingSpinner asOverlay />}

            {/* Showing Home page */}
            <div className="home">
                {/* Showing all the categories */}
                { !isLoading && allQuestions && (
                    <div className="left">
                        <Categories />
                    </div>
                )}
                <div className="right">
                    {/* Questions will be only rendered if the data is arrived from the backend */}
                    { !isLoading  && allQuestions && <QuesList allQuestions={allQuestions} />}

                    {/* If there are no questions in the database */}
                    { !isLoading && !allQuestions &&  <h1>No questios available</h1>}
                </div>
            </div>
        </React.Fragment>
    )
}

export default PortalHome;
