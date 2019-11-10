import "./App.css";

import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router } from "react-router";

import { AuthenticatedPage } from "./pages/authenticatedRoute";
import { LoginPage } from "./pages/loginPage";
import { RegistrationPage } from "./pages/registrationPage";
import { OverviewPage } from "./pages/overviewPage";

const history = createBrowserHistory();

const App: React.FC = () => {
  return (
    <div className="App">
      <Router history={history}>
        <Route path="/login" exact={true} component={LoginPage} />
        <Route path="/registration" exact={true} component={RegistrationPage} />
        <Route
          path={["/overview", "/create/mark", "/administration", "/subject"]}
          component={AuthenticatedPage}
        />
        
      </Router>
    </div>
  );
};

export default App;
