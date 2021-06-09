import React,{useState , useCallback} from 'react';
import { BrowserRouter as Router, Switch , Route, Redirect} from 'react-router-dom';

import './App.css';
import Authenticate from "./user/components/Authenticate";
import PortalNavbar from './shared/components/PortalNavbar';
import PortalHome from "./portal home/pages/PortalHome";
import QuesPage from "./portal home/pages/QuesPage";
import CatQuestions from "./portal home/pages/CatQuestions";
import UserQuestions from "./portal home/pages/UserQuestions";
import NewQuestion from "./portal home/pages/NewQuestion";
import {AuthContext} from "./shared/context/AuthContext";
import UpdateQues from "./portal home/pages/UpdateQues";
import UpdateAnswer from "./portal home/pages/UpdateAnswer";
import UserAnswers from "./portal home/pages/UserAnswers";
import SavedAnswers from "./portal home/pages/SavedAnswers";
import Reset from "./user/components/Reset";
import NewPassword from "./user/components/NewPassword";
import HomePage from "./courses portal/pages/HomePage";
import CoursePage from "./courses portal/pages/CoursePage";
import SubTopic from "./courses portal/pages/SubTopic";
import FirstSubTopic from "./courses portal/pages/FirstSubTopic";
import UserCourses from "./courses portal/pages/UserCourses";

 
function App() {

  // State for Login
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [token, setToken] = useState(null);
  // State for userId comming from BACKEND
  const [userId , setUserId] = useState(null);

  const login = useCallback((uid,token) => {
    setToken(token);
    setIsLogedIn(true);
    setUserId(uid);
  },[]);

  const logout = useCallback((uid) => {
    setToken(null);
    setIsLogedIn(false);
    setUserId(null);
  },[]);

  let routes;

  if(!isLogedIn){
    routes = (
      <Switch>
          {/*  Home Page  */}
          <Route path="/" exact>
            <PortalNavbar />
            <PortalHome />
          </Route>

          {/*  User Authentication  */}
          <Route path="/authenticate" exact>      
            <Authenticate />
          </Route>

          <Route path="/reset" exact>
            <Reset />
          </Route>

          <Route path="/reset/:token" exact>
              <NewPassword />
          </Route>

          {/*  Question ( Single Page )  */}
          <Route path="/ques/:quesID" exact>
            <PortalNavbar />
            <QuesPage />
          </Route>

          {/*  Questions According to the Category  */}
          <Route path="/questions/:catID" exact>
            <PortalNavbar />
            <CatQuestions />
          </Route>

          <Route path="/courses" exact>
            <HomePage />
          </Route>

          <Route path="/course/:courseId" exact>
            <CoursePage />
          </Route>

          <Route path="/subTopic/:subtopic">
            <SubTopic />
          </Route>

          <Redirect to="/" /> 
      </Switch>
    )
  }
  else{
    routes = (
      <Switch>

          {/*  Home Page  */}
          <Route path="/" exact>
            <PortalNavbar />
            <PortalHome />
          </Route>

          {/*  Question ( Add New Question)  */}
          <Route path = "/question/new" exact>
            <PortalNavbar />
            <NewQuestion />
          </Route>

          {/*  Question ( Single Question Page )  */}
          <Route path="/ques/:quesID" exact>
            <PortalNavbar />
            <QuesPage />
          </Route>

          {/*  Question ( According to the Category )  */}
          <Route path="/questions/:catID" exact>
            <PortalNavbar />
            <CatQuestions />
          </Route>

          {/*  Question ( Update Question )  */}
          <Route path="/:quesId/update" exact>
            <PortalNavbar />
            <UpdateQues />
          </Route>

          {/*  Question ( Update Question )  */}
          <Route path="/update/:answerId" exact>
            <PortalNavbar />
            <UpdateAnswer />
          </Route>
          
          {/*  User ( Questions asked By User )  */}
          <Route path="/:userId/questions" exact>
            <PortalNavbar />
            <UserQuestions />
          </Route>

          {/*  User ( Answers given By User )  */}
          <Route path="/:userId/answers" exact>
            <PortalNavbar />
            <UserAnswers />
          </Route>

          {/*  User ( Show Saved Answers of User )  */}
          <Route path="/:userId/savedAnswers" exact>
            <PortalNavbar />
            <SavedAnswers />
          </Route>

          <Route path="/courses" exact>
            <HomePage />
          </Route>

          <Route path="/course/:courseId" exact>
            <CoursePage />
          </Route>

          <Route path="/subTopic/:subtopic">
            <SubTopic />
          </Route>

          <Route path="/first/subTopic/:subtopic">
            <FirstSubTopic />
          </Route>

          <Route path="/:userId/courses">
            <UserCourses />
          </Route>
        
          <Redirect to="/" />
        </Switch>
    )
  }


  return (
    <AuthContext.Provider value={{
      isLogedIn:isLogedIn,
      token:token,
      userId:userId,
      login:login,
      logout:logout
    }}>
      <Router>
        <main>
          
          {routes}   
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
