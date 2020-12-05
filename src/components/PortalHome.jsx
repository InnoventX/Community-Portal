import { Home, QuestionAnswerSharp } from '@material-ui/icons';
import React,{useState} from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import myQuestions from "./questions";

function PortalHome(){
    const [categories,setCategorite]=useState(["Arduino","RPA","RPI","Augmented Reality","Virtual reality","ROS","Dron Tech","my tech"])
    
    const [postAns,setPostAns] = useState("");

    const allCategories = categories.map((category) => {
        return <a className="single-category" href="#">{category}</a> 
    })

    function showAnswers(index){
        console.log(index);
        var myId = `#answers_${index}.answers-div`;
        console.log(myId);
        var ans = document.querySelector(`#answers_${index}.answers-div`);
        console.log(ans);
        var post = document.querySelector(`#post_${index}.post-ans-div`);
        post.style.display = "none";
        if(ans.style.display === "none"){
            ans.style.display = "block";
        }else{
            ans.style.display = "none";
        }
    }

    function showPostSection(index){
        var ans = document.querySelector(`#answers_${index}.answers-div`);
        var post = document.querySelector(`#post_${index}.post-ans-div`);
        ans.style.display = "none";
        if(post.style.display === "none"){
            post.style.display = "block";
        }else{
            post.style.display = "none";
        }
    }

    const [questions,setQuestions]= useState(myQuestions);

    function handlePostAns(event){
        const ipValue=event.target.value;
        setPostAns(ipValue);
    }

    function nowPostAns(event,index){
        event.preventDefault();
        setQuestions((prevValues) => {
            return (
                prevValues.map((que,i) => {
                if(i===index){
                    return{
                        studentName:que.studentName,
                        title:que.title,
                        question:que.question,
                        answers:[...que.answers,postAns]
                    }
                }else{
                    return{
                        studentName:que.studentName,
                        title:que.title,
                        question:que.question,
                        answers:[...que.answers]
                    }
                }
            })
            )
        })
        setPostAns("");
        showAnswers(index);
    }

    var allQuestions = questions.map((ques,index) => {
        return(
            <div className="question-container">
                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                <h6 className="student-name">{ques.studentName}</h6>
                <h4 className="question-title">{ques.title}</h4>
                <p>{ques.question}</p>
                <button className="answers-btn" onClick={() => {
                    showAnswers(index);
                }}>Answers</button>
                <button className="give-ans-btn" onClick={() => {
                    showPostSection(index)
                }}>Give Answer</button>
                <div id={`answers_${index}`} className="answers-div">
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
                <div id={`post_${index}`} className="post-ans-div">
                    <hr />
                    <form onSubmit={(event) => {
                        nowPostAns(event,index);
                    }}>
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