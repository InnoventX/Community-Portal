import React,{useState,useEffect,useContext} from 'react';
import {useParams,Link} from 'react-router-dom';

import "./CourseView.css";
import {AuthContext} from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const SubTopic = () => {

    const subTopicId = useParams().subtopic;

    const auth = useContext(AuthContext);

    // State for  loading spinner
    const [isLoading , setIsLoading] = useState(false);
    
    // State for Error handling
    const [error , setError] = useState();

    const [subTopic , setSubTopic] = useState();

    const [course , setCourse] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
            
                const response = await fetch(`http://localhost:5000/api/section/${subTopicId}/${auth.userId}`,{
                    headers:{
                        'Authorization':'Bearer ' + auth.token
                    }
                });
                const responseData = await response.json();

                if(responseData.message){
                    throw new Error(responseData.message);
                }

                setSubTopic(responseData.section);

                setCourse(responseData.courseId);

            }catch(err){
                console.log(err);
                setError(err.message || 'Something went wrong, please try again');
            }
            setIsLoading(false);
        }
        sendRequest();
    },[])

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

            { !isLoading && subTopic && (
                <React.Fragment>
                    <div className="video-description">
                        <h1 className="subTopic-name">{subTopic.sectionName}</h1>
                        <h2 className="courseName">{subTopic.courseName}</h2>

                        <button className="btn btn-danger Query-btn">Queries</button>
                    </div>

                    <iframe style={{marginTop:'1%'}} width="854" height="480" src={`${subTopic.videoLink}`}></iframe> 
                </React.Fragment>   
            )}
            
            { !isLoading && course && (
                <div className="course-content course-nav">
                    <h3 style={{color:'white', fontWeight:'700', marginBottom:'0'}}>Course Content</h3>
                    <p className="lec-length">{course.topics.length} lectures ▪ </p> <p style={{color: 'rgb(153, 153, 153)'}} className="time">{course.totalTime} hours</p>
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
                                                                        <Link to={`/subtopic/${subTopic.id}`} style={{color:'black',textDecoration:"none"}}>
                                                                            <p style={{marginBottom:'0%'}}>{subTopic.sectionName}</p>
                                                                        </Link>
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
            )}

        </React.Fragment>
    )
}

export default SubTopic;