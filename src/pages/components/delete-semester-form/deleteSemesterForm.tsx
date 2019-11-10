import "react-datepicker/dist/react-datepicker.css";

import "../../../App.css";

import React, { ChangeEvent, PureComponent, Fragment } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  Jumbotron,
  Row
} from "react-bootstrap";
import { RouteComponentProps, withRouter } from "react-router";

import {
  deleteSemester,
  getSemesters
} from "../../../shared/util/apiConnector";
import { SemesterModel } from "../../../shared/util/appContent";
import { getUserId } from "../../../shared/util/userHandler";
import { DeleteDialog } from "../delete-dialog/deleteDialog";

export interface DeleteSemesterFormState {
  showDialog: boolean;
  semesterId: number;
  semesters: SemesterModel[];
}

export class DeleteSemesterForm extends PureComponent<
  RouteComponentProps,
  DeleteSemesterFormState
> {
  state: Readonly<DeleteSemesterFormState> = {
    showDialog: false,
    semesterId: 0,
    semesters: [],
  };

  semesters: SemesterModel[] | undefined;

  handleDelete = () => {
    this.changeDialogVisibility(false);
    deleteSemester(this.state.semesterId);
  };

  changeDialogVisibility = (showDialog: boolean) => {
    this.setState({ showDialog });
  };

  getDialog = () => {
    return (
      <DeleteDialog
        headerText="Semester löschen"
        description="Sind Sie sich sicher, dass Sie das Semester löschen wollen?"
        closeFn={() => {
          this.changeDialogVisibility(false);
        }}
        executeFn={this.handleDelete}
      />
    );
  };

  componentDidMount = async () => {
    const semesters = await getSemesters(getUserId());
    if(semesters.length !== 0) {
      this.setState({ semesterId: semesters[0].id, semesters });
    }
    this.setState({semesters});
  }

  render() {
    const {semesters} = this.state;

    if(semesters.length === 0) {
      return <Fragment />
    }

    return (
      <Jumbotron className="create-card">
        <h1 className="heading">Semester löschen</h1>
        <Container>
          <Row>
            <Col md={9}>
              <FormControl
                className="semester-selector-form"
                as="select"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ semesterId: +event.target.value });
                }}
                selected={this.state.semesterId}
              >
                {semesters &&
                  semesters.map(sem => (
                    <option value={sem.id}>{sem.bezeichnung}</option>
                  ))}
              </FormControl>
            </Col>
            <Col md={3}>
              <Button
                variant="danger"
                onClick={() => {
                  this.changeDialogVisibility(true);
                }}
              >
                Semester löschen
              </Button>
            </Col>
          </Row>
        </Container>
        {this.state.showDialog && this.getDialog()}
      </Jumbotron>
    );
  }
}
export default withRouter(DeleteSemesterForm);
