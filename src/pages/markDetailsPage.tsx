import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { PageLayout } from "../shared/layout/pageLayout";
import MarkDetailTable from "./components/mark-detail-table/markDetailTable";

export class MarkDetailsPage extends PureComponent<RouteComponentProps<{subjectId: string}>> {
  render() {

    const subjectId=+this.props.match.params.subjectId;

    return (
      <PageLayout>
        <MarkDetailTable subjectId={subjectId}/>
      </PageLayout>
    );
  }
}
export default withRouter(MarkDetailsPage);