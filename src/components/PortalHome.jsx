import { Home, QuestionAnswerSharp } from '@material-ui/icons';
import React,{useState} from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import myQuestions from "./questions";

function PortalHome(){
    const [categories,setCategorite]=useState(["Arduino","RPA","RPI","Augmented Reality","Virtual reality","ROS","Dron Tech"])
    
    const [postAns,setPostAns] = useState("");

    const allCategories = categories.map((category) => {
        return <a className="single-category" href="#">{category}</a> 
    })


    const [questions,setQuestions]= useState([{
        studentName:"",
        title:"",
        question:"",
    }]);

    function showAnswers(index){
        console.log(index);
        var myId = `#i_${index}.answers-div`;
        console.log(myId);
        var ans = document.querySelector(`#i_${index}.answers-div`);
        console.log(ans);
        var post = document.getElementById("post-ans-div");
        post.style.display = "none";
        if(ans.style.display === "none"){
            ans.style.display = "block";
        }else{
            ans.style.display = "none";
        }
    }

    function showPostSection(){
        var ans = document.getElementById("answers-div");
        var post = document.getElementById("post-ans-div");
        ans.style.display = "none";
        if(post.style.display === "none"){
            post.style.display = "block";
        }else{
            post.style.display = "none";
        }
    }

    function handlePostAns(event){
        const ipValue=event.target.value;
        setPostAns(ipValue);
    }

    function nowPostAns(event){
        event.preventDefault();
        console.log(postAns);
        alert(postAns);
    }

    var allQuestions = myQuestions.map((ques,index) => {
        return(
            <div className="question-container">
                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                <h6 className="student-name">{ques.studentName}</h6>
                <h4 className="question-title">{ques.title}</h4>
                <p>{ques.question}</p>
                <button className="answers-btn" onClick={() => {
                    showAnswers(index);
                }}>Answers</button>
                <button className="give-ans-btn" onClick={showPostSection}>Give Answer</button>
                <div id={`i_${index}`} className="answers-div">
                    {
                        ques.answers.map((ans,index) => {
                            return (
                                <React.Fragment>
                                    <p className="answers">{ans}</p>
                                    <hr style={{width:"95%",margin:"0 auto"}}/>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
                <div id="post-ans-div">
                    <hr />
                    <form onSubmit={nowPostAns}>
                        <textarea className="post-ans-text" rows="3" value={postAns} onChange={handlePostAns}/>
                        <button type="submit" className="post-btn">Post</button>
                    </form>
                </div>
            </div>
        )
    })
    
    return(
        <div className="home">
            <div className="left">
                <h6 className="category-heading">ALL CATEGORIES</h6>
                <div className="categories-div">
                    {allCategories}
                </div>
            </div>
            <div className="right">
                <h6 className="answers-heading">ANSWERS</h6>
                <hr noshade/>
                {allQuestions}
            </div>
        </div>
    )
}

export default PortalHome;