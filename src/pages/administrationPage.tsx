import React, { PureComponent } from "react";

import { PageLayout } from "../shared/layout/pageLayout";
import CreateSemesterForm from "./components/create-semester-form/createSemesterForm";
import CreateSubjectForm from "./components/create-subject-form/createSubjectForm";
import DeleteSemesterForm from "./components/delete-semester-form/deleteSemesterForm";
import DeleteUserForm from "./components/delete-user-form/deleteUserForm";

export class AdministrationPage extends PureComponent {
  render() {
    return (
      <PageLayout>
        <CreateSemesterForm />
        <CreateSubjectForm />
        <DeleteSemesterForm />
        <DeleteUserForm />
      </PageLayout>
    );
  }
}
