import React from 'react';
import {useParams} from 'react-router-dom';

import myQuestions from "./questions";
import QuesList from './QuesList';
import Categories from './Categories';

const CatQuestions = ( ) =>  {
    const cat = useParams().catID;

    const catQuestions = myQuestions.filter((ques) => {
        return ques.category === cat;
    });
    
    return(
        <React.Fragment>
            <h1>{cat}</h1>
            {console.log(cat)}
            <div className="home">
                <div className="left">
                    <Categories />
                </div>
                <div className="right">
                    <QuesList allQuestions={catQuestions} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default CatQuestions;