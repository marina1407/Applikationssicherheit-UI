import "react-datepicker/dist/react-datepicker.css";

import "../../../App.css";

import { Field, FieldProps, Form, Formik } from "formik";
import React, { PureComponent } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormText,
  InputGroup,
  Jumbotron,
  Row,
  Alert
} from "react-bootstrap";
import { object, string } from "yup";

import { createSemester } from "../../../shared/util/apiConnector";
import { SemesterModel } from "../../../shared/util/appContent";
import { getUserId } from "../../../shared/util/userHandler";
import { RouteComponentProps, withRouter } from "react-router";

interface FormData {
  bezeichnung: string;
  schulTyp: string;
}

const initialValues: FormData = {
  bezeichnung: "",
  schulTyp: ""
};

export const schema = () =>
  object<FormData>().shape({
    bezeichnung: string().required("Sie müssen eine Bezeichnung angeben!"),
    schulTyp: string().required("Sie müssen einen Schultyp angeben!")
  });

export interface CreateSemesterFormState {
  showError: boolean
}

export class CreateSemesterForm extends PureComponent<RouteComponentProps, CreateSemesterFormState> {

  state = {
    showError: false,
  }

  handleSubmit = async (values: FormData) => {
    var semester: SemesterModel = {
      id: 0,
      bezeichnung: values.bezeichnung,
      schulTyp: values.schulTyp
    };
    const response = await createSemester(semester, getUserId());
    if(!response) {
      this.setState({showError: true});
    }
    else {
      this.props.history.push('/overview');
    }
  };

  render() {
    return (
      <Jumbotron className="create-card">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          validateOnBlur={true}
          validateOnChange={true}
          render={({ isValid, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="create-semester-form">
              <h1>Semester erstellen</h1>
              {this.state.showError && <Alert id="errorAlert" variant="danger" dismissible={true}>
                Mit diesem Namen existiert bereits ein Semester
              </Alert>}
              <Container>
                <Row>
                  <Col md={5}>
                    <Field
                      name="bezeichnung"
                      render={({ form, field }: FieldProps<FormData>) => (
                        <InputGroup>
                          <FormText>Bezeichnung</FormText>
                          <FormControl
                            name={field.name}
                            type="text"
                            value={field.value.bezeichnung}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Bezeichnung"
                          />
                          <FormText>
                            {form.touched.bezeichnung &&
                              form.errors.bezeichnung}
                          </FormText>
                        </InputGroup>
                      )}
                    />
                  </Col>
                  <Col md={5}>
                    <Field
                      name="schulTyp"
                      render={({ form, field }: FieldProps<FormData>) => (
                        <InputGroup>
                          <FormText>SchulTyp</FormText>
                          <FormControl
                            name={field.name}
                            type="text"
                            value={field.value.schulTyp}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="SchulTyp"
                          />
                          <FormText>
                            {form.touched.schulTyp && form.errors.schulTyp}
                          </FormText>
                        </InputGroup>
                      )}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      className="create-button"
                      disabled={!isValid || isSubmitting}
                      type="submit"
                      variant="primary"
                    >
                      Erstellen
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Form>
          )}
        />
      </Jumbotron>
    );
  }
}
export default withRouter(CreateSemesterForm);