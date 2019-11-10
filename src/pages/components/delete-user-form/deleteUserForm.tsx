import "react-datepicker/dist/react-datepicker.css";

import "../../../App.css";

import React, { PureComponent } from "react";
import { Alert, Button, Jumbotron } from "react-bootstrap";
import { RouteComponentProps, withRouter } from "react-router";

import { deleteUser } from "../../../shared/util/apiConnector";
import { getUserId, removeStoredUser } from "../../../shared/util/userHandler";
import { DeleteDialog } from "../delete-dialog/deleteDialog";

export interface DeleteUserFormState {
  showDialog: boolean;
  showError: boolean;
}

export class DeleteUserForm extends PureComponent<
  RouteComponentProps,
  DeleteUserFormState
> {
  state = {
    showDialog: false,
    showError: false,
  };

  handleDelete = async () => {
    this.changeDialogVisibility(false);
    const success = await deleteUser(getUserId());
    if(success) {
      removeStoredUser();
      this.props.history.push("/login");
    }
    
  };

  changeDialogVisibility = (showDialog: boolean) => {
    this.setState({ showDialog });
  };

  getDialog = () => {
    return (
      <DeleteDialog
        headerText="Benutzer löschen"
        description="Sind Sie sich sicher, dass Sie diesen Benutzer löschen wollen?"
        closeFn={() => {
          this.changeDialogVisibility(false);
        }}
        executeFn={this.handleDelete}
      />
    );
  };

  render() {
    return (
      <Jumbotron className="create-card">
        <h1 className="heading-no-margin-left">Benutzer löschen</h1>
        {this.state.showError && <Alert id="errorAlert" variant="danger" dismissible={true}>
                Der Benutzer konnte nicht gelöscht werden
              </Alert>}
        <div className=" align-left">
          <Button
            variant="danger"
            onClick={() => {
              this.changeDialogVisibility(true);
            }}
          >
            Diesen Benutzer löschen
          </Button>
        </div>
        {this.state.showDialog && this.getDialog()}
      </Jumbotron>
    );
  }
}
export default withRouter(DeleteUserForm);
