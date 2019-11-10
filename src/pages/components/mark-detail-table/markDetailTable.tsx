import React, { PureComponent } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { RouteComponentProps, withRouter } from "react-router";
import { getSubjectMarks } from "../../../shared/util/apiConnector";
import { MarkModel } from "../../../shared/util/appContent";

export interface MarkDetailTableProps extends RouteComponentProps {
  subjectId: number;
}

export interface MarkDetailTableState {
  marks: MarkModel[],
}

export class MarkDetailTable extends PureComponent<MarkDetailTableProps, MarkDetailTableState> {

  state: Readonly<MarkDetailTableState> = {
    marks: [],
  }

  componentDidMount = async () => {
    const marks = await getSubjectMarks(this.props.subjectId);
    this.setState({marks});
  };

  handleBack = () => {
    this.props.history.push("/overview");
  };

  render() {
    const { subjectId } = this.props;
    const {marks} = this.state;

    if(marks.length === 0) {
      return <Spinner animation="border" />
    }

    return (
      <div className="create-card">
        <div className="align-left">
          <Button
            className="align-left"
            onClick={this.handleBack}
            variant="secondary"
          >
            Zurück
          </Button>
        </div>
        <h1 className="heading">Noten</h1>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Note</th>
              <th>Datum</th>
              <th>Gewichtung</th>
              <th>Notizen</th>
            </tr>
          </thead>
          <tbody>
            {marks.map(mark => (
              <tr>
                <td>{mark.note}</td>
                <td>{mark.date.toLocaleDateString("de-ch")}</td>
                <td>{mark.gewichtung}</td>
                <td>{mark.notiz}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default withRouter(MarkDetailTable);
