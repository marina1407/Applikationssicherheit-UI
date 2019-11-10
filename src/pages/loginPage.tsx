import { PureComponent } from "react";
import React from "react";

import { PageLayout } from "../shared/layout/pageLayout";
import LoginForm from "./components/login-form/loginForm";

export class LoginPage extends PureComponent {
  render() {
    return (
      <PageLayout>
        <LoginForm />
      </PageLayout>
    );
  }
}
