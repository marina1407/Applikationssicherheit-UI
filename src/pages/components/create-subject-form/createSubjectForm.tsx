import "react-datepicker/dist/react-datepicker.css";

import "../../../App.css";

import { Field, FieldProps, Form, Formik } from "formik";
import React, { ChangeEvent, PureComponent, Fragment } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormText,
  InputGroup,
  Jumbotron,
  Row,
  Spinner,
  Alert
} from "react-bootstrap";
import { number, object, string } from "yup";

import { createSubject, getSemesters } from "../../../shared/util/apiConnector";
import { SubjectModel, SemesterModel } from "../../../shared/util/appContent";
import { getUserId } from "../../../shared/util/userHandler";
import { RouteComponentProps, withRouter } from "react-router";

export interface CreateSubjectFormState {
  semesterId: number;
  semesters: SemesterModel[];
  showError: boolean;
}

interface FormData {
  bezeichnung: string;
  gewichtung: number;
  notizen: string;
  semesterId: number;
}

const initialValues: FormData = {
  bezeichnung: "",
  gewichtung: 1.0,
  notizen: "",
  semesterId: 0,
};

export const schema = () =>
  object<FormData>().shape({
    bezeichnung: string().required("Sie müssen eine Bezeichnung angeben!"),
    gewichtung: number()
      .required("Sie müssen eine Gewichtung angeben!")
      .min(0.1, "Die Gewichtung muss zwischen 0.1 und 10 liegen!")
      .max(10, "Die Gewichtung muss zwischen 0.1 und 10 liegen!"),
    notizen: string(),
  });

export class CreateSubjectForm extends PureComponent<RouteComponentProps, CreateSubjectFormState> {

  state: Readonly<CreateSubjectFormState> = {
    semesterId: 0,
    semesters: [],
    showError: false,
  }

  handleSubmit = async (values: FormData) => {
    values.semesterId = this.state.semesterId;
    var subject: SubjectModel = {
      id: 0,
      bezeichnung: values.bezeichnung,
      gewichtung: values.gewichtung,
      durchschnitt: 0,
      notizen: values.notizen,
      semesterId: values.semesterId,
    };
    const response = await createSubject(subject);
    if (!response) {
      this.setState({ showError: true });
    }
    else {
      this.props.history.push('/overview')
    }
  };

  componentDidMount = async () => {
    const semesters = await getSemesters(getUserId());
    if (semesters.length !== 0) {
      this.setState({ semesterId: semesters[0].id, semesters });
    }
    this.setState({ semesters });
  }

  render() {
    const { semesters } = this.state;

    if (semesters.length === 0) {
      return <Fragment />
    }

    return (
      <Jumbotron className="create-card">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          validateOnBlur={true}
          validateOnChange={true}
          render={({ isValid, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="create-subject-form">
              <h1>Fach erstellen</h1>
              {this.state.showError && <Alert id="errorAlert" variant="danger" dismissible={true}>
                Mit diesem Namen existiert bereits ein Fach
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
                  <Col md={2}>
                    <Field
                      name="gewichtung"
                      render={({ form, field }: FieldProps<FormData>) => (
                        <InputGroup>
                          <FormText>Gewichtung</FormText>
                          <input
                            name={field.name}
                            className="form-control"
                            type="number"
                            value={field.value.gewichtung}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="1.00"
                            step="0.01"
                          />
                          <FormText>{form.errors.gewichtung}</FormText>
                        </InputGroup>
                      )}
                    />
                  </Col>
                  <Col md={5}>
                    <Field
                      name="notizen"
                      render={({ form, field }: FieldProps<FormData>) => (
                        <InputGroup>
                          <FormText>Notizen</FormText>
                          <FormControl
                            name={field.name}
                            type="text"
                            value={field.value.notizen}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Weitere Informationen..."
                          />
                          <FormText>
                            {form.touched.notizen && form.errors.notizen}
                          </FormText>
                        </InputGroup>
                      )}
                    />
                  </Col>
                  <Col md={4}>
                    <Field
                      name="semesterId"
                      render={({ form, field }: FieldProps<FormData>) => (
                        <InputGroup>
                          <FormText>Semester</FormText>
                          <FormControl
                            as="select"
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>
                            ) => {
                              this.setState({ semesterId: +event.target.value });
                            }}
                            selected={this.state.semesterId}
                          >
                            {semesters.map(sem => (
                              <option
                                value={sem.id}
                              >
                                {sem.bezeichnung}
                              </option>
                            ))}
                          </FormControl>
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

export default withRouter(CreateSubjectForm);