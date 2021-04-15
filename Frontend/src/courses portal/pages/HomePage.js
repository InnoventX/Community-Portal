import React from 'react';

import myCourses from "./courses";
import AllCourses from "../components/AllCourses";

const HomePage = () => {

    return(
        <React.Fragment>    
            <AllCourses courses={myCourses} />
        </React.Fragment>
    )
}

export default HomePage;