import React,{useState,useEffect,useContext} from 'react';
import {useParams, Link, useHistory} from 'react-router-dom';

import myCourses from "./courses";
import "./CoursePage.css";
import {AuthContext} from "../../shared/context/AuthContext";
import ratings from '../../photos/ratings.svg';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";


const CoursePage = () => {
    const courseId = useParams().courseId;

    const auth = useContext(AuthContext);

    const history = useHistory();

    // State for  loading spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for Error handling
    const [error , setError] = useState();

    const [course , setCourse] = useState();
    
    // Setting error to null after we click the screen
    const errorHandler = () => {
        setError(null);
    }

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
            
                const response = await fetch( process.env.REACT_APP_BACKEND_URL+ `/course/${courseId}`,{
                    headers:{
                        'Authorization':'Bearer ' + auth.token
                    }
                });
                const responseData = await response.json();

                if(responseData.message){
                    throw new Error(responseData.message);
                }

                setCourse(responseData.course);

            }catch(err){
                console.log(err);
                setError(err.message || 'Something went wrong, please try again');
            }
            setIsLoading(false);
        }
        sendRequest();
    },[])

    const enrollCourseHandler = async () => {
        try{
            setIsLoading(true);
            const response = await fetch( process.env.REACT_APP_BACKEND_URL + `/course/enrollcourse/${course.id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    userId:auth.userId
                })
            });

            const responseData = await response.json();

            if(responseData.message){
                throw new Error(responseData.message);
            }

            // history.push(`/subTopic/${course.topics[0].subTopics[0].id}`);
        }catch(err){
            console.log(err);
            setError(err.message || 'Something went wrong, please try again');
        }
        setIsLoading(false);
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

            { !isLoading && course && (
                <div className="course">
                    <div className="course-heading"> 
                        <h1 className="course-name">{course.name}</h1>
                        <h6 className="rating">{course.rating}<img className="ratings-img" src={ratings}></img></h6>
                        
                        <div className="course-subDIV">
                            <p className="price">₹{course.price}</p>

                            {
                                auth.isLogedIn ? (
                                    <Link to={`/first/subTopic/${course.topics[0].subTopics[0]._id}`}>
                                        <button className="btn btn-outline-dark enroll-btn" onClick={enrollCourseHandler}>
                                            <i style={{fontSize:"1.4rem"}} class="far fa-plus-square"></i> Enroll Now
                                        </button>
                                    </Link>
                                ):(
                                    <a href="/authenticate" style={{textDecoration:"none"}}>
                                        <button className="btn btn-outline-dark enroll-btn">
                                            <i style={{fontSize:"1.4rem"}} class="far fa-plus-square"></i> Enroll Now
                                        </button>
                                    </a>
                                )
                            }
                            
                            <div className="course-features">
                                <p><i class="fas fa-video"></i> 40 hours on-demand video</p>
                            </div>
                        </div>

                        <p className="time">{course.totalTime} hours</p>
                    </div>
                    
                    <div className="description-container">
                        <h3 style={{fontWeight:'700', marginBottom:'5%'}}>What you will learn</h3>
                        {
                            course.desc.map(des => {
                                return(
                                    <p className="learn-desription"><i style={{marginRight:"3%"}} class="fas fa-check"></i> {des.para}</p>
                                )
                            })
                        }
                    </div>

                    <div className="course-content">
                        <h3 style={{fontWeight:'700', marginBottom:'0'}}>Course Content</h3>
                        <p className="lec-length">{course.topics.length} lectures</p> ▪ <p style={{color: 'rgb(153, 153, 153)'}} className="time">{course.totalTime} hours</p>
                        <div class="accordion" id="accordionExample">
                            {
                                course.topics.map(topic => {
                                    return(
                                        <React.Fragment>
                                            <div class="accordion-item">
                                    
                                                <h2 class="accordion-header" id="headingOne">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${topic._id}`} aria-expanded="true" aria-controls={`collapse-${topic._id}`}>
                                                        {topic.topicName}
                                                    </button>
                                                </h2>

                                                <div id={`collapse-${topic._id}`} class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">                                            
                                                    {
                                                        topic.subTopics.map(subTopic => {
                                                            return(
                                                                <React.Fragment>    
                                                                        <div class="accordion-body">
                                                                            <p style={{marginBottom:'0%'}}>{subTopic.sectionName}</p>
                                                                        </div>                                                
                                                                </React.Fragment>
                                                            )
                                                        })
                                                }
                                                </div>                                            
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                            }                   
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}



export default CoursePage;
