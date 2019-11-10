import { PureComponent } from "react";
import React from "react";

import { PageLayout } from "../shared/layout/pageLayout";
import RegistrationForm from "./components/registration-form/registrationForm";

export class RegistrationPage extends PureComponent {
  render() {
    return (
      <PageLayout>
        <RegistrationForm />
      </PageLayout>
    );
  }
}
