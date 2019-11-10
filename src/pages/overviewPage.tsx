import { PureComponent } from "react";
import React from "react";

import { PageLayout } from "../shared/layout/pageLayout";
import { SemesterSelector } from "./components/semester-selector/semesterSelector";

export class OverviewPage extends PureComponent {
  render() {
    return (
      <PageLayout>
          <SemesterSelector />
      </PageLayout>
    );
  }
}
