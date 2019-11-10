import React, { Fragment, PureComponent } from "react";
import { Button, Table } from "react-bootstrap";
import { RouteComponentProps, withRouter } from "react-router";

import { deleteSubject } from "../../../shared/util/apiConnector";
import { SubjectModel } from "../../../shared/util/appContent";
import { DeleteDialog } from "../delete-dialog/deleteDialog";

export interface SubjectSelectorProps extends RouteComponentProps {
  subjects: SubjectModel[];
}

export interface SubjectSelectorState {
  showDialog: boolean;
  selectedSubjectId: number;
}

export class SubjectSelector extends PureComponent<
  SubjectSelectorProps,
  SubjectSelectorState
> {
  state = {
    showDialog: false,
    selectedSubjectId: 0
  };

  handleSubjectSelect = (subjectId: number) => {
    this.props.history.push(`/subject/${subjectId}`);
  };

  handleSubjectDeleteAction = (subjectId: number) => {
    this.setState({ selectedSubjectId: subjectId, showDialog: true });
  };

  handleDelete = () => {
    deleteSubject(this.state.selectedSubjectId);
    this.changeDialogVisibility(false);
  };

  getDialog = () => {
    return (
      <DeleteDialog
        headerText="Fach löschen"
        description="Sind Sie sich sicher, dass Sie das Fach löschen wollen?"
        closeFn={() => {
          this.changeDialogVisibility(false);
        }}
        executeFn={this.handleDelete}
      />
    );
  };

  changeDialogVisibility = (showDialog: boolean) => {
    this.setState({ showDialog });
  };

  render() {
    const { subjects } = this.props;

    return (
      <Fragment>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Bezeichnung</th>
              <th>Gewichtung</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(sub => (
              <tr>
                <td>{sub.bezeichnung}</td>
                <td>{sub.gewichtung}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      this.handleSubjectSelect(sub.id);
                    }}
                  >
                    Details
                  </Button>
                  <Button
                    variant="danger"
                    className="button-margin"
                    onClick={() => {
                      this.handleSubjectDeleteAction(sub.id);
                    }}
                  >
                    Löschen
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {this.state.showDialog && this.getDialog()}
      </Fragment>
    );
  }
}

export default withRouter(SubjectSelector);
