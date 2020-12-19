import React,{useState} from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import myQues from "../components/questions";
import "./PortalHome.css";
import Categories from "../components/Categories";
import QuesList from "../components/QuesList";

function PortalHome(){

    const [myQuestions,setQuestions] = useState(myQues)
    
    return(
        <div className="home">
            <div className="left">
                <Categories />
            </div>
            <div className="right">
                <QuesList allQuestions={myQuestions} />
            </div>
        </div>
    )
}

export default PortalHome;