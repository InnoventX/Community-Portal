import React,{useState} from 'react';
import {useParams} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import myQuestions from "./questions";
import "./QuesPage.css";


const QuesPage = () => {
    const quesID = useParams().quesID;

    const myQuestion = myQuestions.find( (ques)=> {
        return ques.id === quesID
    });

    const [question,setQuestion] = useState(myQuestion);
    const [ansGiven, setAnsGiven] = useState({
        givenBy:'',
        rating:'',
        ans:''
    });


    if(!question){
        return(
            <h1>Not A QUESTION</h1>
        );
    }

    const showPostSection = () => {
        const postDiv = document.querySelector(".post-ans-div");
        if(postDiv.style.display === "none"){
            postDiv.style.display = "block";
        }
        else{
            postDiv.style.display = "none";
        }
    }

    const handleGivenAns = (event) => {
        const ans = {
            givenBy:'u10',
            rating:'0',
            ans:event.target.value
        }
        setAnsGiven(ans);
    }

    const nowPostAns = (event) => {
        event.preventDefault();
        setQuestion((question) => {
            return{
                id:question.id,
                studentName:question.studentName,
                title:question.title,
                wholeQuestion:question.wholeQuestion,
                answers:[...question.answers , ansGiven]
            }
        });
        console.log("AnssGiven",ansGiven);
        console.log(question.answers);
        showPostSection();
    }


    return(
            <div className="question-container">
                <AccountCircleIcon className="user-icon" style={{fontSize:"1.8rem"}}/>
                <h6 className="student-name">{question.studentName}</h6>
                <h4 className="question-title">{question.title}</h4>
                <p>Category -> {question.category}</p>
                <p>{question.wholeQuestion}</p>
                <div className="answers-div">
                    {
                        question.answers.map((ans) => {
                            return (
                                <React.Fragment>
                                    <h6>{ans.givenBy}</h6>
                                    <button><StarBorderIcon style={{display:"inlineBlock"}}/></button>
                                    <p >Rating :- {ans.rating}</p>
                                    <p className="answers">{ans.ans}</p>
                                    <hr style={{width:"95%",margin:"0 auto"}}/>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
                <button className="give-ans-btn" onClick={() => {
                    showPostSection()
                }}>Give Answer</button>

                <div className="post-ans-div">
                    <hr />
                    <form onSubmit={nowPostAns}>
                        <textarea className="post-ans-text" rows="3" value={ansGiven.ans} onChange={handleGivenAns}/>
                        <button type="submit" className="post-btn">Post</button>
                    </form>
                </div>

                
            </div>   
    );
}

export default QuesPage;