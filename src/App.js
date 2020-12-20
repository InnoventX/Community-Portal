import React,{useState} from 'react';
import { BrowserRouter as Router, Switch , Route, Redirect} from 'react-router-dom';

import './App.css';
import SignIn from "./user/components/SignIn";
import PortalNavbar from './shared/components/PortalNavbar';
import PortalHome from "./portal home/pages/PortalHome";
import QuesPage from "./portal home/components/QuesPage";
import CatQuestions from "./portal home/components/CatQuestions";
import UserQuestions from "./portal home/components/UserQuestions";
import NewQuestion from "./portal home/components/NewQuestion";
import {AuthContext} from "./shared/context/AuthContext";
import UpdateQues from "./portal home/components/UpdateQues";

function App() {

  const [isLogedIn, setIsLogedIn] = useState(false);
  // const [userId,setUserId] = useState(null);

  const login = () => {
    setIsLogedIn(true);
  }

  const logout = () => {
    setIsLogedIn(false);
  }

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
            <SignIn />
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

          {/*  User ( Questions asked By User )  */}
          <Route path="/:userId/questions" exact>
            <UserQuestions />
          </Route>

          <Redirect to="/" />
        </Switch>
    )
  }


  return (
    <AuthContext.Provider value={{
      isLogedIn:isLogedIn,
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
