import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';

import QuesList from '../components/QuesList';
import Categories from '../components/Categories';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const CatQuestions = ( ) =>  {

    // Taking the category name from the route
    const category = useParams().catID;

    // State for storing all the questions of the given category
    const [categoryQuestions , setCategoryQuestions] = useState();

    // State for Loading spinner & Error model
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState();

    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
    }

    // This request will be sended every time when the category is changed in route
    useEffect(() => {

        // Sending the get request
        const sendRequest = async () => {
            try{
                // Turning on the loading spinner
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/question/category/${category}`);
                const responseData = await response.json();

                // Throwing error comming from backend
                if(responseData.message && responseData.message !== "No questions of mentioned category"){
                    throw new Error(responseData.message);
                }

                // Storing the category questions in our State
                setCategoryQuestions(responseData.questions);
            }catch(err){
                console.log(err);
                // Setting the error in frontend
                setError(err.message);
            }
            // Turning off the loading spinner after the data is received
            setIsLoading(false);
        }

        // Calling our function
        sendRequest();
    },[category]);
    
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

            {/* Showing the categories and question after the data is received from backend */}
            { !isLoading && (
                <div className="home">
                    <div className="left">
                        <Categories />
                    </div>
                    <div className="right">
                        { categoryQuestions && <QuesList allQuestions={categoryQuestions} /> }
                        { !categoryQuestions && <h1>No questios of this category available</h1>}
                    </div>
                </div>
            )}
            
        </React.Fragment>
    );
}

export default CatQuestions;