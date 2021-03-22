import React,{useState , useCallback} from 'react';
import { BrowserRouter as Router, Switch , Route, Redirect} from 'react-router-dom';

import './App.css';
import Authenticate from "./user/components/Authenticate";
import PortalNavbar from './shared/components/PortalNavbar';
import PortalHome from "./portal home/pages/PortalHome";
import QuesPage from "./portal home/pages/QuesPage";
import CatQuestions from "./portal home/pages/CatQuestions";
import UserQuestions from "./portal home/components/UserQuestions";
import NewQuestion from "./portal home/pages/NewQuestion";
import {AuthContext} from "./shared/context/AuthContext";
import UpdateQues from "./portal home/pages/UpdateQues";
import UpdateAnswer from "./portal home/pages/UpdateAnswer";
import UserAnswers from "./portal home/pages/UserAnswers";

function App() {

  // State for Login
  const [isLogedIn, setIsLogedIn] = useState(false);

  // State for userId comming from BACKEND
  const [userId , setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLogedIn(true);
    setUserId(uid);
  },[]);

  const logout = useCallback((uid) => {
    setIsLogedIn(false);
    setUserId(null);
  },[]);

  let routes;

  if(!isLogedIn){
    routes = (
      <Switch>
          {/*  Home Page  */}
          <Route path="/" exact>
            <PortalHome />
          </Route>

          {/*  User Authentication  */}
          <Route path="/authenticate" exact>      
            <Authenticate />
          </Route>

          {/*  Question ( Single Page )  */}
          <Route path="/ques/:quesID" exact>
            <QuesPage />
          </Route>

          {/*  Questions According to the Category  */}
          <Route path="/questions/:catID" exact>
            <CatQuestions />
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
            <PortalHome />
          </Route>

          {/*  Question ( Add New Question)  */}
          <Route path = "/question/new" exact>
            <NewQuestion />
          </Route>

          {/*  Question ( Single Question Page )  */}
          <Route path="/ques/:quesID" exact>
            <QuesPage />
          </Route>

          {/*  Question ( According to the Category )  */}
          <Route path="/questions/:catID" exact>
            <CatQuestions />
          </Route>

          {/*  Question ( Update Question )  */}
          <Route path="/:quesId/update" exact>
            <UpdateQues />
          </Route>

          {/*  Question ( Update Question )  */}
          <Route path="/update/:answerId" exact>
            <UpdateAnswer />
          </Route>
          
          {/*  User ( Questions asked By User )  */}
          <Route path="/:userId/questions" exact>
            <UserQuestions />
          </Route>

          {/*  User ( Answers given By User )  */}
          <Route path="/:userId/answers" exact>
            <UserAnswers />
          </Route>

          <Redirect to="/" />
        </Switch>
    )
  }


  return (
    <AuthContext.Provider value={{
      isLogedIn:isLogedIn,
      userId:userId,
      login:login,
      logout:logout
    }}>
      <Router>
        <main>
          <PortalNavbar />
          {routes}   
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
