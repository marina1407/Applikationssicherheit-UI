import React, { PureComponent } from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from "react-router";

import { getUser } from "../shared/util/userHandler";
import { AdministrationPage } from "./administrationPage";
import { CreateMarkPage } from "./createMarkPage";
import { MarkDetailsPage } from "./markDetailsPage";
import { OverviewPage } from "./overviewPage";

export class AuthenticatedPage extends PureComponent<RouteComponentProps> {
  render() {
    const user = getUser();

    if (!user) {
      return <Redirect to="/login" />;
    }
    
    return (
      <Switch>
        <Route path="/overview" exact={true} component={OverviewPage} />
        <Route
          path="/administration"
          exact={true}
          component={AdministrationPage}
        />
        <Route path="/create/mark" exact={true} component={CreateMarkPage} />
        <Route
          path="/subject/:subjectId"
          exact={true}
          component={MarkDetailsPage}
        />
      </Switch>
    );
  }
}
export default withRouter(AuthenticatedPage);
