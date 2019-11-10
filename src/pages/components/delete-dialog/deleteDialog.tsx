import React, { PureComponent } from "react";
import {
  Button,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalTitle
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

export interface DeleteDialogProps {
  headerText: string;
  description: string;
  executeFn: () => void;
  closeFn: () => void;
}

export class DeleteDialog extends PureComponent<DeleteDialogProps> {
  render() {
    const { headerText, description, executeFn, closeFn } = this.props;
    return (
      <ModalDialog>
        <ModalHeader closeButton>
          <ModalTitle>{headerText}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <p>{description}</p>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={closeFn}>
            Schliessen
          </Button>
          <Button variant="danger" onClick={executeFn}>
            Löschen
          </Button>
        </ModalFooter>
      </ModalDialog>
    );
  }
}
