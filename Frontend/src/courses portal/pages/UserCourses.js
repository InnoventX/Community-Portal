import React,{useEffect,useState,useContext} from 'react';

import myCourses from "./courses";
import {AuthContext} from "../../shared/context/AuthContext";
import AllCourses from "../components/AllCourses";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserCourses = () => {

    const auth = useContext(AuthContext);

    // State for  loading spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for Error handling
    const [error , setError] = useState();

    const [allCourses , setAllCourses] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
            
                const response = await fetch(process.env.REACT_APP_BACKEND_URL+ `/user/${auth.userId}/courses`,{
                    headers:{
                        'Authorization':'Bearer ' + auth.token
                    }
                });
                const responseData = await response.json();

                if(responseData.message && responseData.message!=="No Course found"){
                    throw new Error(responseData.message);
                }

                const courses = responseData.courses.map((course,index) => {
                    return({
                        ...course,
                        lastSeenSectionId: responseData.myCoursesData[index].lastSeenSectionId
                    })
                })

                setAllCourses(courses);
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

export default UserCourses;