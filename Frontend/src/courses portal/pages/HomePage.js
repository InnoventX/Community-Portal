import React,{useEffect,useState} from 'react';

import myCourses from "./courses";
import AllCourses from "../components/AllCourses";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const HomePage = () => {

    // State for  loading spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for Error handling
    const [error , setError] = useState();

    const [allCourses , setAllCourses] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
            
                const response = await fetch("http://localhost:5000/api/course/");
                const responseData = await response.json();

                if(responseData.message && responseData.message!=="No Course found"){
                    throw new Error(responseData.message);
                }

                setAllCourses(responseData.courses);

            }catch(err){
                console.log(err);
                setError(err.message || 'Something went wrong, please try again');
            }
            setIsLoading(false);
        }
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

            { !isLoading && allCourses && <AllCourses courses={allCourses} /> }
        </React.Fragment>
    )
}

export default HomePage;