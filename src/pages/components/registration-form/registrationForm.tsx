import "../../../App.css";

import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import React, { PureComponent } from "react";
import {
  Button,
  FormControl,
  FormText,
  InputGroup,
  Jumbotron,
  Alert
} from "react-bootstrap";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import { object, ref, string } from "yup";

import { createUser } from "../../../shared/util/apiConnector";
import { CreateUserModel } from "../../../shared/util/appContent";
import { getUser, saveUser } from "../../../shared/util/userHandler";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const initialValues: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordRepeat: ""
};

export const schema = () =>
  object<FormData>().shape({
    firstName: string().required("Sie müssen Ihre Vornamen angeben!"),
    lastName: string().required("Sie müssen Ihren Nachnamen angeben!"),
    email: string()
      .required("Sie müssen eine E-Mail Adresse angeben!")
      .email("Sie müssen eine gültige E-Mail Adresse angeben."),
    password: string()
      .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein!")
      .matches(
        /[a-z]/,
        "Das Passwort muss mindestens einen Kleinbuchstaben enthalten!"
      )
      .matches(
        /[A-Z]/,
        "Das Passwort muss mindestens einen Grossbuchstaben enthalten!"
      )
      .matches(/.*[0-9].*/, "Das Passwort muss mindestens eine Zahl enthalten!")
      .matches(
        /(?=.*[@$!%*#?&])/,
        "Das Passwort muss mindestens ein spezielles Zeichen (@,$.!,%,#,#,?,&) enthalten!"
      ),
    passwordRepeat: string()
      .required("Sie müssen das Passwort wiederholen!")
      .oneOf([ref("password")], "Die Passwörter müssen übereinstimmen!")
  });

export interface RegistrationFormState {
  showEmailExistsError: boolean;
}

export class RegistrationForm extends PureComponent<RouteComponentProps, RegistrationFormState> {

  state = {
    showEmailExistsError: false,
  }

  handleSubmit = async (values: FormData, {setErrors} : FormikHelpers<FormData>) => {
    const { firstName, lastName, email, password } = values;

    const createUserObject: CreateUserModel = {
      firstName,
      lastName,
      email,
      password
    };
    const user = await createUser(createUserObject);
    if (user) {
      saveUser(user);
      this.forceUpdate();
    }
    else {
      setErrors({email: 'Bitte geben Sie eine andere E-Mail Adresse an'})
      this.setState({ showEmailExistsError: true });
    }
  };

  render() {
    const user = getUser();
    if (user) {
      return <Redirect to="/overview" />;
    }

    return (
      <Jumbotron className="card">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={({ isValid, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="registration-form">
              <h1>Benutzer anlegen</h1>
              {this.state.showEmailExistsError && <Alert id="errorAlert" variant="danger" dismissible={true}>
                Mit der angegebenen E-Mail Adresse existiert bereits ein Benutzer
              </Alert>}
              <Field
                name="firstName"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormText>Vorname</FormText>
                    <FormControl
                      name={field.name}
                      type="text"
                      value={field.value.firstName}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Max"
                    />
                    <FormText>
                      {form.touched.firstName && form.errors.firstName}
                    </FormText>
                  </InputGroup>
                )}
              />
              <Field
                name="lastName"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormText>Nachname</FormText>
                    <FormControl
                      name={field.name}
                      type="text"
                      value={field.value.lastName}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Mustermann"
                    />
                    <FormText>
                      {form.touched.lastName && form.errors.lastName}
                    </FormText>
                  </InputGroup>
                )}
              />
              <Field
                name="email"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormText>Email</FormText>
                    <FormControl
                      name={field.name}
                      type="email"
                      value={field.value.email}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Email"
                    />
                    <FormText>
                      {form.touched.email && form.errors.email}
                    </FormText>
                  </InputGroup>
                )}
              />
              <Field
                name="password"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormText>Passwort</FormText>
                    <FormControl
                      name={field.name}
                      type="password"
                      value={field.value.password}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <FormText>
                      {form.touched.password && form.errors.password}
                    </FormText>
                  </InputGroup>
                )}
              />
              <Field
                name="passwordRepeat"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormText>Passwort wiederholen</FormText>
                    <FormControl
                      name={field.name}
                      type="password"
                      value={field.value.passwordRepeat}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <FormText>
                      {form.touched.passwordRepeat &&
                        form.errors.passwordRepeat}
                    </FormText>
                  </InputGroup>
                )}
              />
              <p>
                Haben Sie bereits ein Konto?
                <a href="/login"> Hier anmelden!</a>
              </p>
              <Button disabled={!isValid} type="submit" variant="primary">
                Registrieren
              </Button>
            </Form>
          )}
        />
      </Jumbotron>
    );
  }
}
export default withRouter(RegistrationForm);
