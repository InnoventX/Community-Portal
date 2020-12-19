import React from 'react';
import { BrowserRouter as Router, Switch , Route, Redirect} from 'react-router-dom';

import './App.css';
import SignIn from "./user/components/SignIn";
import PortalNavbar from './shared/components/PortalNavbar';
import PortalHome from "./portal home/pages/PortalHome";
import QuesPage from "./portal home/components/QuesPage";
import CatQuestions from "./portal home/components/CatQuestions";
import UserQuestions from "./portal home/components/UserQuestions";
import NewQuestion from "./portal home/components/NewQuestion";

function App() {
  return (
    <Router>
      <main>
        <PortalNavbar />
        <Switch>

          <Route path="/" exact>
            <PortalHome />
          </Route>

          <Route path="/authenticate" exact>      
            <SignIn />
          </Route>

          <Route path = "/question/new" exact>
            <NewQuestion />
          </Route>

          <Route path="/ques/:quesID" exact>
            <QuesPage />
          </Route>

          <Router path="/questions/:catID" exact>
            <CatQuestions />
          </Router>

          {/* <Router path="/questions/:userId" exact>
            <UserQuestions />
          </Router> */}

          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
