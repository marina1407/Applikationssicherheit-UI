import "react-datepicker/dist/react-datepicker.css";

import "../../../App.css";

import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import React, { ChangeEvent, PureComponent } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  FormControl,
  FormText,
  InputGroup,
  Jumbotron,
  Row,
  Spinner
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { number, object, string } from "yup";

import {
  createMark,
  getSemesterMarks,
  getSemesters
} from "../../../shared/util/apiConnector";
import { MarkModel, SemesterModel, SubjectModel } from "../../../shared/util/appContent";
import { getUserId } from "../../../shared/util/userHandler";
import { RouteComponentProps, withRouter } from "react-router";

interface FormData {
  note: number;
  gewichtung: number;
  datum: string;
  notiz: string;
  fachId: number;
}

const initialValues: FormData = {
  note: 6.0,
  gewichtung: 1.0,
  datum: new Date().toISOString(),
  notiz: "",
  fachId: 4
};

export const schema = () =>
  object<FormData>().shape({
    note: number()
      .required("Sie müssen eine Note eingeben")
      .min(1, "Die Note muss zwischen 1.0 und 6.0 sein")
      .max(6, "Die Note muss zwischen 1.0 und 6.0 sein"),
    gewichtung: number()
      .required("Sie müssen eine Gewichtung eingeben")
      .min(0.1, "Die Gewichtung muss zwischen 0.1 und 10 liegen")
      .max(10, "Die Gewichtung muss zwischen 0.1 und 10 liegen"),
    datum: string()
      .transform((value: string) => {
        return new Date(value).toISOString();
      })
      .required("Sie müssen ein Datum angeben"),
    notiz: string(),
    fachId: number().required("Die Note muss einem Fach zugewiesen werden")
  });

export interface CreateMarkFormState {
  date: Date;
  semester: number;
  semesters: SemesterModel[],
  subjects: SubjectModel[],
  fachId: number;
  showError: boolean;
}

export class CreateMarkForm extends PureComponent<RouteComponentProps, CreateMarkFormState> {
  state: Readonly<CreateMarkFormState> = {
    date: new Date(),
    semester: 1,
    semesters: [],
    subjects: [],
    fachId: 1,
    showError: false,
  };

  handleSubmit = async (values: FormData, { setErrors }: FormikHelpers<FormData>) => {
    var hasErrors = false;
    if (!values.note) {
      setErrors({ note: "Sie müssen eine Note eingeben" });
      hasErrors = true;
    }
    if (!values.gewichtung) {
      setErrors({ gewichtung: "Sie müssen eine Gewichtung eingeben" });
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    var mark: MarkModel = {
      id: 0,
      note: values.note!,
      gewichtung: values.gewichtung!,
      notiz: values.notiz,
      date: this.state.date,
      fachId: this.state.fachId
    };
    const response = await createMark(mark);
    if (response) {
      this.props.history.push('/overview');
    }
    else {
      this.setState({showError: true});
    }
  };

  handleSemesterSelect = async (semester: number) => {
    const subjects = await getSemesterMarks(semester);

    if (subjects.length !== 0) {
      this.setState({ fachId: subjects[0].id });
    }
    this.setState({ subjects });
  }

  componentDidMount = async () => {
    const semesters = await getSemesters(getUserId());
    if (semesters.length !== 0) {
      this.setState({ semester: semesters[0].id, semesters });
      this.handleSemesterSelect(semesters[0].id);

    }
    this.setState({ semesters });
  }

  render() {
    const { semester, semesters, subjects } = this.state;


    return (
      <Jumbotron className="create-card">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          validateOnBlur={true}
          validateOnChange={true}
          render={({ isValid, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="create-mark-form">
              <h1>Note erstellen</h1>
              {this.state.showError && <Alert id="errorAlert" variant="danger" dismissible={true}>
                Es ist ein Fehler aufgetreten
              </Alert>}
              {semesters.length !== 0 ?
                <Container>
                  <Row>
                    <Col md={2}>
                      <Field
                        name="note"
                        render={({ form, field }: FieldProps<FormData>) => (
                          <InputGroup>
                            <FormText>Note</FormText>
                            <input
                              name={field.name}
                              className="form-control"
                              type="number"
                              value={field.value.note}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              step="0.01"
                            />
                            <FormText>{form.errors.note}</FormText>
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
                              step="0.01"
                            />
                            <FormText>{form.errors.gewichtung}</FormText>
                          </InputGroup>
                        )}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        name="datum"
                        render={({ form, field }: FieldProps<FormData>) => (
                          <InputGroup>
                            <FormText>Datum</FormText>
                            <DatePicker
                              selected={this.state.date}
                              className="form-control"
                              dateFormat="dd.MM.yyyy"
                              onChange={value => {
                                if (value != null) {
                                  this.setState({ date: value! });
                                  field.onChange(value.toISOString());
                                }
                              }}
                              onBlur={field.onBlur}
                            />
                            <FormText>{form.errors.datum}</FormText>
                          </InputGroup>
                        )}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        name="notiz"
                        render={({ form, field }: FieldProps<FormData>) => (
                          <InputGroup>
                            <FormText>Notiz</FormText>
                            <input
                              name={field.name}
                              className="form-control"
                              type="input"
                              value={field.value.notiz}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              placeholder="Zusätzliche Informationen..."
                            />
                            <FormText>{form.errors.notiz}</FormText>
                          </InputGroup>
                        )}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        name="semester"
                        render={({ form, field }: FieldProps<FormData>) => (
                          <InputGroup>
                            <FormText>Semester</FormText>
                            <FormControl
                              as="select"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                this.handleSemesterSelect(+event.target.value);
                                this.setState({ semester: +event.target.value });
                              }}
                              selected={this.state.semester}
                            >
                              {semesters.map(sem => (
                                <option value={sem.id}>{sem.bezeichnung}</option>
                              ))}
                            </FormControl>
                          </InputGroup>
                        )}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        name="fachId"
                        render={({ form, field }: FieldProps<FormData>) => (
                          <InputGroup>
                            <FormText>Subject</FormText>
                            <FormControl
                              as="select"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                this.setState({ fachId: +event.target.value });
                              }}
                              selected={this.state.fachId}
                            >
                              {subjects.map(sub => (
                                <option value={sub.id}>{sub.bezeichnung}</option>
                              ))}
                            </FormControl>
                          </InputGroup>
                        )}
                      />
                    </Col>
                    <Col md={2}>
                      <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                        variant="primary"
                        className="create-button"
                      >
                        Erstellen
                    </Button>
                    </Col>
                  </Row>
                </Container>
                : <p className="align-left">Sie müssen zuerst ein Semester erstellen, um eine Note hinzufügen zu können.</p>}
            </Form>
          )}
        />
      </Jumbotron>
    );
  }
}
export default withRouter(CreateMarkForm);